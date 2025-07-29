using System.Text.RegularExpressions;
using Contracts;
using SearchService.Models;
using Typesense;

namespace SearchService.MessageHandlers;

public class QuestionUpdatedHandler(ITypesenseClient client)
{
    public async Task HandleAsync(QuestionUpdated message)
    {
        var doc = new SearchQuestion
        {
            Id = message.QuestionId,
            Title = message.Title,
            Content = StripHtml(message.Content),
            Tags = message.Tags.ToArray(),
        };
        await client.UpdateDocument("questions", doc.Id, doc);
    }
    
    private static string StripHtml(string content)
    {
        return Regex.Replace(content, "<.*?>", string.Empty);
    }
}