using System.ComponentModel.DataAnnotations;

namespace QuestionService.Models;

public class Tag
{
    [MaxLength(36)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [MaxLength(50)]
    public required string Name { get; set; }
    [MaxLength(50)]
    public required string Slug { get; set; }
    [MaxLength(1000)]
    public required string Description { get; set; }

    public int UsageCount { get; set; }
}