using Npgsql;

namespace StatsService.Extensions;

public static class PostgresDbExtensions
{
    public static async Task EnsurePostgresDatabaseExistsAsync(this string connectionString)
    {
        var builder = new NpgsqlConnectionStringBuilder(connectionString);
        var targetDb = builder.Database;

        // Clone and switch to admin db ("postgres")
        builder.Database = "postgres";
        await using var adminConn = new NpgsqlConnection(builder.ToString());

        await adminConn.OpenAsync();

        // Check if the database already exists
        var existsCommand = new NpgsqlCommand(
            $"SELECT 1 FROM pg_database WHERE datname = @dbName", adminConn);
        existsCommand.Parameters.AddWithValue("dbName", targetDb!);
        var exists = await existsCommand.ExecuteScalarAsync();

        if (exists == null)
        {
            var createCommand = new NpgsqlCommand($"CREATE DATABASE \"{targetDb}\"", adminConn);
            await createCommand.ExecuteNonQueryAsync();
            Console.WriteLine($"✅ Created PostgreSQL database '{targetDb}'");
        }
        else
        {
            Console.WriteLine($"ℹ️ PostgreSQL database '{targetDb}' already exists");
        }
    }
}