using Microsoft.EntityFrameworkCore;
using ProfileService.Models;

namespace ProfileService.Data;

public class ProfileDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<UserProfile> UserProfiles { get; set; }
}