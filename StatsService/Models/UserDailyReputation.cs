namespace StatsService.Models;

public class UserDailyReputation
{
    public required string Id { get; set; }
    public required string UserId { get; set; }
    public DateOnly Date { get; set; }
    public int Delta { get; set; }
}