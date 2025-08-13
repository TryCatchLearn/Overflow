using System.Security.Claims;
using ProfileService.Data;
using ProfileService.Models;

namespace ProfileService.Middleware;

public class UserProfileCreationMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, ProfileDbContext db)
    {
        if (context.User.Identity?.IsAuthenticated is true)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var name = context.User.FindFirstValue("name");

            if (userId is not null)
            {
                var profile  = await db.UserProfiles.FindAsync(userId);
                if (profile is null)
                {
                    var newProfile = new UserProfile
                    {
                        Id = userId,
                        DisplayName = name ?? "Unnamed",
                    };
                    
                    db.UserProfiles.Add(newProfile);
                    await db.SaveChangesAsync();
                }
            }
        }
        
        await next(context);
    }
}