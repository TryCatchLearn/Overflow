using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using QuestionService.Data;
using QuestionService.Models;

namespace QuestionService.Services;

public class TagService(IMemoryCache cache, QuestionDbContext db)
{
    private const string CacheKey = "tags";

    private async Task<List<Tag>> GetTags()
    {
        return await cache.GetOrCreateAsync(CacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(2);

            var tags = await db.Tags.AsNoTracking().ToListAsync();

            return tags;
        }) ?? [];
    }

    public async Task<bool> AreTagsValidAsync(List<string> slugs)
    {
        var tags = await GetTags();
        var tagSet = tags.Select(x => x.Slug).ToHashSet(StringComparer.OrdinalIgnoreCase);
        return slugs.All(x => tagSet.Contains(x));
    }
}