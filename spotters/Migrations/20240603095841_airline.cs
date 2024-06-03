using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace spotters.Migrations
{
    public partial class airline : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "AirlineCode",
                table: "AirlineSightings",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_AirlineSightings_AirlineCode",
                table: "AirlineSightings",
                column: "AirlineCode",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AirlineSightings_AirlineCode",
                table: "AirlineSightings");

            migrationBuilder.AlterColumn<string>(
                name: "AirlineCode",
                table: "AirlineSightings",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
