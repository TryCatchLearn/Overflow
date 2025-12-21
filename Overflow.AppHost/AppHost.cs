using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var compose = builder.AddDockerComposeEnvironment("production")
    .WithSshDeploySupport()
    .WithDashboard(dashboard => dashboard.WithHostPort(8080));

var keycloak = builder.AddKeycloak("keycloak", 6001)
    .WithDataVolume("keycloak-data")
    .WithRealmImport("../infra/realms")
    .WithEnvironment("KC_HTTP_ENABLED", "true")
    .WithEnvironment("KC_HOSTNAME_STRICT", "false")
    .WithEnvironment("VIRTUAL_HOST", "overflow-id.trycatchlearn.com")
    .WithEnvironment("VIRTUAL_PORT", "8080")
    .WithEnvironment("LETSENCRYPT_HOST", "overflow-id.trycatchlearn.com")
    .WithEnvironment("LETSENCRYPT_EMAIL", "trycatchlearn@outlook.com");

var postgres = builder.AddPostgres("postgres", port: 5432)
    .WithDataVolume("postgres-data")
    .WithPgWeb();

var typesenseApiKey = builder.AddParameter("typesense-api-key", secret: true);

var typesense = builder.AddContainer("typesense", "typesense/typesense", "29.0")
    .WithVolume("typesense-data", "/data")
    .WithEnvironment("TYPESENSE_DATA_DIR", "/data")
    .WithEnvironment("TYPESENSE_ENABLE_CORS", "true")
    .WithEnvironment("TYPESENSE_API_KEY", typesenseApiKey)
    .WithHttpEndpoint(8108, 8108, name: "typesense");

var typeSenseContainer = typesense.GetEndpoint("typesense");

var questionDb = postgres.AddDatabase("questionDb");
var profileDb = postgres.AddDatabase("profileDb");
var statDb = postgres.AddDatabase("statDb");
var voteDb = postgres.AddDatabase("voteDb");

var rabbitmq = builder.AddRabbitMQ("messaging")
    .WithDataVolume("rabbitmq-data")
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
    .WithReference(typeSenseContainer)
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
        yarpBuilder.AddRoute("/tags/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/search/{**catch-all}", searchService);
        yarpBuilder.AddRoute("/test/{**catch-all}", questionService);
        yarpBuilder.AddRoute("/profiles/{**catch-all}", profileService);
        yarpBuilder.AddRoute("/stats/{**catch-all}", statService);
        yarpBuilder.AddRoute("/votes/{**catch-all}", voteService);
    })
    .WithEnvironment("ASPNETCORE_URLS", "http://*:8001")
    .WithEndpoint(port: 8001, scheme: "http", targetPort: 8001, name: "gateway", isExternal: true)
    .WithEnvironment("VIRTUAL_HOST", "overflow-api.trycatchlearn.com")
    .WithEnvironment("VIRTUAL_PORT", "8001")
    .WithEnvironment("LETSENCRYPT_HOST", "overflow-api.trycatchlearn.com")
    .WithEnvironment("LETSENCRYPT_EMAIL", "trycatchlearn@outlook.com");

var webapp = builder.AddJavaScriptApp("webapp", "../webapp")
    .WithReference(keycloak)
    .WithHttpEndpoint(env: "PORT", port: 3000, targetPort: 4000)
    .WithEnvironment("VIRTUAL_HOST", "overflow.trycatchlearn.com")
    .WithEnvironment("VIRTUAL_PORT", "4000")
    .WithEnvironment("LETSENCRYPT_HOST", "overflow.trycatchlearn.com")
    .WithEnvironment("LETSENCRYPT_EMAIL", "trycatchlearn@outlook.com")
    .PublishAsDockerFile();

if (!builder.Environment.IsDevelopment())
{
    builder.AddContainer("nginx-proxy", "nginxproxy/nginx-proxy", "1.8")
        .WithEndpoint(80, 80, "nginx", isExternal: true)
        .WithEndpoint(443, 443, "nginx-ssl", isExternal: true)
        .WithBindMount("/var/run/docker.sock", "/tmp/docker.sock", true)
        .WithVolume("certs", "/etc/nginx/certs", false)
        .WithVolume("html", "/usr/share/nginx/html", false)
        .WithVolume("vhost", "/etc/nginx/vhost.d")
        .WithContainerName("nginx-proxy");
    
    builder.AddContainer("nginx-proxy-acme", "nginxproxy/acme-companion", "2.2")
        .WithEnvironment("DEFAULT_EMAIL", "your-email@address.com")
        .WithEnvironment("NGINX_PROXY_CONTAINER", "nginx-proxy")
        .WithBindMount("/var/run/docker.sock", "/var/run/docker.sock", isReadOnly: true)
        .WithVolume("certs", "/etc/nginx/certs")
        .WithVolume("html", "/usr/share/nginx/html")
        .WithVolume("vhost", "/etc/nginx/vhost.d", false)
        .WithVolume("acme", "/etc/acme.sh");

    keycloak.WithEnvironment("KC_HOSTNAME", "https://overflow-id.trycatchlearn.com")
        .WithEnvironment("KC_HOSTNAME_BACKCHANNEL_DYNAMIC", "true");
}

builder.Build().Run();