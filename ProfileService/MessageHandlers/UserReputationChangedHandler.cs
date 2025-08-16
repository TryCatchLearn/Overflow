using Contracts;
using Microsoft.EntityFrameworkCore;
using ProfileService.Data;

namespace ProfileService.MessageHandlers;

public class UserReputationChangedHandler(ProfileDbContext db)
{
    public async Task Handle(UserReputationChanged message)
    {
        await db.UserProfiles.Where(x => x.Id == message.UserId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.Reputation, 
                x => x.Reputation + message.Delta));
    }    
}