using Microsoft.EntityFrameworkCore;
using QuestionService.Models;

namespace QuestionService.Data;

public class QuestionDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<Question> Questions { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Answer> Answers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Tag>()
            .HasData(
                new Tag
                {
                    Id = "aspire",
                    Name = "Aspire",
                    Slug = "aspire",
                    Description =
                        "A composable, opinionated stack for building distributed apps with .NET. Provides dashboard, diagnostics, and simplified service orchestration."
                },
                new Tag
                {
                    Id = "keycloak",
                    Name = "Keycloak",
                    Slug = "keycloak",
                    Description =
                        "An open-source identity and access management solution for modern applications and services. Integrates easily with OAuth2, OIDC, and SSO."
                },
                new Tag
                {
                    Id = "dotnet",
                    Name = ".NET",
                    Slug = "dotnet",
                    Description =
                        "A modern, cross-platform development platform for building cloud, web, mobile, desktop, and IoT apps using C# and F#."
                },
                new Tag
                {
                    Id = "ef-core",
                    Name = "Entity Framework Core",
                    Slug = "ef-core",
                    Description =
                        "A modern object-database mapper (ORM) for .NET that supports LINQ, change tracking, and migrations for working with relational databases."
                },
                new Tag
                {
                    Id = "wolverine",
                    Name = "Wolverine",
                    Slug = "wolverine",
                    Description =
                        "A high-performance messaging and command-handling framework for .NET with built-in support for Mediator, queues, retries, and durable messaging."
                },
                new Tag
                {
                    Id = "postgresql",
                    Name = "PostgreSQL",
                    Slug = "postgresql",
                    Description =
                        "A powerful, open-source object-relational database system known for reliability, feature richness, and standards compliance."
                },
                new Tag
                {
                    Id = "signalr",
                    Name = "SignalR",
                    Slug = "signalr",
                    Description =
                        "A real-time communication library for ASP.NET that enables server-to-client messaging over WebSockets, long polling, and more."
                },
                new Tag
                {
                    Id = "nextjs",
                    Name = "Next.js",
                    Slug = "nextjs",
                    Description =
                        "A React framework for building fast, full-stack web apps with server-side rendering, routing, and static site generation."
                },
                new Tag
                {
                    Id = "typescript",
                    Name = "TypeScript",
                    Slug = "typescript",
                    Description =
                        "A statically typed superset of JavaScript that compiles to clean JavaScript. Helps build large-scale apps with tooling support."
                },
                new Tag
                {
                    Id = "microservices",
                    Name = "Microservices",
                    Slug = "microservices",
                    Description =
                        "An architectural style that structures an application as a collection of loosely coupled services that can be independently deployed and scaled."
                }
            );
    }
}