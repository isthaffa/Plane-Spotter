using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace spotters.Migrations
{
    public partial class AddUserReferencesToPlaneSighting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Photo",
                table: "AirlineSightings",
                type: "longblob",
                nullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "AirlineSightings");
        }
    }
}
