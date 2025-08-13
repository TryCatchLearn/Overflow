using System.ComponentModel.DataAnnotations;

namespace ProfileService.Models;

public class UserProfile
{
    [MaxLength(36)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [MaxLength(200)]
    public required string DisplayName { get; set; }
    [MaxLength(1000)]
    public string? Description { get; set; }
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public int Reputation { get; set; }
}