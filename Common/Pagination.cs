using Microsoft.EntityFrameworkCore;

namespace Common;

public record PaginationRequest
{
    public int? Page { get; init; }
    public int? PageSize { get; init; }

    public int SafePage => Page.GetValueOrDefault(1);
    public int CappedPageSize => Math.Min(PageSize ?? 5, 50);
}

public record PaginationResult<T>
{
    public IReadOnlyList<T> Items { get; init; } = [];
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
}

public static class PaginationExtensions
{
    public static async Task<PaginationResult<T>> ToPaginatedListAsync<T>(this IQueryable<T> 
        source, PaginationRequest request)
    {
        var total = await source.CountAsync();
        
        var page = request.SafePage <= 0 ? 1 : request.SafePage;
        var pageSize = request.CappedPageSize;
        
        var items = await source
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PaginationResult<T>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize,
        };
    }
}