using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VoteService.Data.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Votes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    UserId = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    TargetId = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    QuestionId = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    TargetType = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    VoteValue = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Votes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Votes_UserId_TargetType_TargetId",
                table: "Votes",
                columns: new[] { "UserId", "TargetType", "TargetId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Votes");
        }
    }
}
