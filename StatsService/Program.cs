using Common;
using Contracts;
using JasperFx.Events;
using JasperFx.Events.Projections;
using Marten;
using StatsService.Extensions;
using StatsService.Models;
using StatsService.Projections;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddOpenApi();
builder.AddServiceDefaults();
await builder.UseWolverineWithRabbitMqAsync(opts =>
{
    opts.ApplicationAssembly = typeof(Program).Assembly;
});

var connString = builder.Configuration.GetConnectionString("statDb")!;
await connString.EnsurePostgresDatabaseExistsAsync();

builder.Services.AddMarten(opts =>
{
    opts.Connection(connString);

    opts.Events.StreamIdentity = StreamIdentity.AsString;
    opts.Events.AddEventType<QuestionCreated>();
    opts.Events.AddEventType<UserReputationChanged>();

    opts.Schema.For<TagDailyUsage>()
        .Index(x => x.Tag)
        .Index(x => x.Date);
    
    opts.Schema.For<UserReputationChanged>()
        .Index(x => x.UserId)
        .Index(x => x.Occurred);
    
    opts.Projections.Add(new TrendingTagsProjection(), ProjectionLifecycle.Inline);
    opts.Projections.Add(new TopUsersProjection(), ProjectionLifecycle.Inline);

}).UseLightweightSessions();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/stats/trending-tags", async (IQuerySession session) =>
{
    var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
    var start = today.AddDays(-6);

    var rows = await session.Query<TagDailyUsage>()
        .Where(x => x.Date >= start && x.Date <= today)
        .Select(x => new { x.Tag, x.Count })
        .ToListAsync();
    
    var top = rows
        .GroupBy(x => x.Tag)
        .Select(x => new {tag = x.Key, count = x.Sum(t => t.Count)})
        .OrderByDescending(x => x.count)
        .Take(5)
        .ToList();
    
    return Results.Ok(top);
});

app.MapGet("/stats/top-users", async (IQuerySession session) =>
{
    var today = DateOnly.FromDateTime(DateTime.UtcNow.Date);
    var start = today.AddDays(-6);

    var rows = await session.Query<UserDailyReputation>()
        .Where(x => x.Date >= start && x.Date <= today)
        .Select(x => new { x.UserId, x.Delta })
        .ToListAsync();

    var top = rows.GroupBy(x => x.UserId)
        .Select(g => new { userId = g.Key, delta = g.Sum(t => t.Delta) })
        .OrderByDescending(x => x.delta)
        .Take(5)
        .ToList();

    return Results.Ok(top);
});

app.Run();