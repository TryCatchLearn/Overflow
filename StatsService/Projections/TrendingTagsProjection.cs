using Contracts;
using JasperFx.Events;
using Marten;
using Marten.Events.Projections;
using StatsService.Models;

namespace StatsService.Projections;

public class TrendingTagsProjection : EventProjection
{
    public TrendingTagsProjection() => ProjectAsync<IEvent<QuestionCreated>>(Apply);

    private static async Task Apply(IEvent<QuestionCreated> ev, IDocumentOperations ops, 
        CancellationToken ct)
    {
        var day = DateOnly.FromDateTime(DateTime.SpecifyKind(ev.Data.Created, DateTimeKind.Utc));
        foreach (var tag in ev.Data.Tags)
        {
            var id = $"{tag}:{day:yyyy-MM-dd}";
            var doc = await ops.LoadAsync<TagDailyUsage>(id, ct)
                ?? new TagDailyUsage{Id = id, Tag = tag, Date = day, Count = 0};
            
            doc.Count += 1;
            ops.Store(doc);
        }
    }
}