using System.ComponentModel.DataAnnotations;

namespace VoteService.Models;

public class Vote
{
    [MaxLength(36)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [MaxLength(36)]
    public required string UserId { get; set; }
    [MaxLength(36)]
    public required string TargetId { get; set; }
    [MaxLength(36)]
    public required string QuestionId { get; set; }
    [MaxLength(10)]
    public required string TargetType { get; set; }
    public int VoteValue { get; set; }
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}