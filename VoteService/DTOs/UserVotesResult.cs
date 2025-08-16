namespace VoteService.DTOs;

public record UserVotesResult(string TargetId, string TargetType, int VoteValue);