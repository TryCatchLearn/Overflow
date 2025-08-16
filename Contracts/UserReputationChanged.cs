namespace Contracts;

public record UserReputationChanged(
    string UserId,
    int Delta,
    ReputationReason Reason,
    string ActorUserId,
    DateTime Occurred
    );