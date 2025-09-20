using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var kcPort = builder.ExecutionContext.IsPublishMode ? 80 : 6001;

var keycloak = builder.AddKeycloak("keycloak", kcPort)
    .WithEndpoint("http", e => e.IsExternal = true)
    .WithDataVolume("keycloak-data")
    .WithEnvironment("KC_HTTP_ENABLED", "true")
    .WithEnvironment("KC_HOSTNAME_STRICT", "false")
    .WithEnvironment("KC_PROXY_HEADERS", "xforwarded");

var pgUser = builder.AddParameter("pg-username", secret: true);
var pgPassword = builder.AddParameter("pg-password", secret: true);

var postgres = builder.AddAzurePostgresFlexibleServer("postgres")
    .WithPasswordAuthentication(pgUser, pgPassword);

// var typesenseApiKey = builder.AddParameter("typesense-api-key", secret: true);

var typesenseApiKey = builder.Environment.IsDevelopment()
    ? builder.Configuration["Parameters:typesense-api-key"]
      ?? throw new InvalidOperationException("Could not get typesense api key")
    : "${TYPESENSE_API_KEY}";

var typesense = builder.AddContainer("typesense", "typesense/typesense", "29.0")
    .WithArgs("--data-dir", "/data", "--api-key", typesenseApiKey, "--enable-cors")
    .WithVolume("typesense-data", "/data")
    .WithEnvironment("TYPESENSE_API_KEY", typesenseApiKey)
    .WithHttpEndpoint(8108, 8108, name: "typesense");

var typesenseContainer = typesense.GetEndpoint("typesense");

var questionDb = postgres.AddDatabase("questionDb");
var profileDb = postgres.AddDatabase("profileDb");
var statDb = postgres.AddDatabase("statDb");
var voteDb = postgres.AddDatabase("voteDb");

var rabbitmq = builder.AddRabbitMQ("messaging")
    .WithManagementPlugin(port: 15672);

var questionService = builder.AddProject<Projects.QuestionService>("question-svc")
    .WithReference(keycloak)
    .WithReference(questionDb)
    .WithReference(rabbitmq)
    .WaitFor(keycloak)
    .WaitFor(questionDb)
    .WaitFor(rabbitmq);

var searchService = builder.AddProject<Projects.SearchService>("search-svc")
    .WithEnvironment("typesense-api-key", typesenseApiKey)
    .WithReference(typesenseContainer)
    .WithReference(rabbitmq)
    .WaitFor(typesense)
    .WaitFor(rabbitmq);

var profileService = builder.AddProject<Projects.ProfileService>("profile-svc")
    .WithReference(keycloak)
    .WithReference(profileDb)
    .WithReference(rabbitmq)
    .WaitFor(keycloak)
    .WaitFor(profileDb)
    .WaitFor(rabbitmq);

var statService = builder.AddProject<Projects.StatsService>("stat-svc")
    .WithReference(statDb)
    .WithReference(rabbitmq)
    .WaitFor(statDb)
    .WaitFor(rabbitmq);

var voteService = builder.AddProject<Projects.VoteService>("vote-svc")
    .WithReference(keycloak)
    .WithReference(voteDb)
    .WithReference(rabbitmq)
    .WaitFor(keycloak)
    .WaitFor(voteDb)
    .WaitFor(rabbitmq);

var yarp = builder.AddYarp("gateway")
    .WithConfiguration(yarpBuilder =>
    {
        yarpBuilder.AddRoute("/questions/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/test/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/tags/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/search/{**catch-all}", searchService);
        yarpBuilder.AddRoute("/profiles/{**catch-all}", profileService);
        yarpBuilder.AddRoute("/stats/{**catch-all}", statService);
        yarpBuilder.AddRoute("/votes/{**catch-all}", voteService);
    })
    .WithEnvironment("ASPNETCORE_URLS", "http://*:8001")
    .WithEndpoint(port: 8001, targetPort: 8001, scheme: "http", name: "gateway", isExternal: true);

var webapp = builder.AddNpmApp("webapp", "../webapp", "dev")
    .WithReference(keycloak)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

if (builder.ExecutionContext.IsPublishMode)
{
    rabbitmq.WithVolume("rabbitmq-data", "var/lib/rabbitmq/mnesia");
    webapp.WithEndpoint(env: "PORT", port: 80, targetPort: 4000, scheme: "http", isExternal: true);
}
else
{
    postgres.RunAsContainer();
    rabbitmq.WithDataVolume("rabbitmq-data");
    webapp.WithHttpEndpoint(env: "PORT", port: 3000, targetPort: 4000);
    keycloak.WithRealmImport("../infra/realms");
}

builder.Build().Run();