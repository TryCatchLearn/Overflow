using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QuestionService.Models;

public class Answer
{
    [MaxLength(36)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [MaxLength(5000)]
    public required string Content { get; set; }
    [MaxLength(36)]
    public required string UserId { get; set; }
    [MaxLength(300)]
    public required string UserDisplayName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool Accepted { get; set; }
    
    // nav properties
    [MaxLength(36)]
    public required string QuestionId { get; set; }
    [JsonIgnore]
    public Question Question { get; set; } = null!;
}