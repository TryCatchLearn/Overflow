using Contracts;

namespace Reputation;

public class ReputationHelper
{
    private static int GetDelta(ReputationReason reason) => reason switch
    {
        ReputationReason.QuestionUpvoted => 5,
        ReputationReason.QuestionDownvoted => -2,
        ReputationReason.AnswerUpvoted => 5,
        ReputationReason.AnswerDownvoted => -2,
        _ => 15,
    };

    public static UserReputationChanged MakeEvent(string userId, ReputationReason reason, string actorUserId) =>
        new(
            UserId: userId,
            Delta: GetDelta(reason),
            Reason: reason,
            ActorUserId: actorUserId,
            Occurred: DateTime.UtcNow
        );
}