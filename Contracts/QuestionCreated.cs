namespace Contracts;

public record QuestionCreated(string QuestionId, string Title, 
    string Content, DateTime Created, List<string> Tags);