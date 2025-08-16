using Contracts;
using Marten;
using Wolverine.Attributes;

namespace StatsService.MessageHandlers;

public class UserReputationChangeHandler
{
    [Transactional]
    public static async Task Handle(UserReputationChanged message, IDocumentSession session)
    {
        session.Events.Append(message.UserId, message);
        await session.SaveChangesAsync();
    }
}