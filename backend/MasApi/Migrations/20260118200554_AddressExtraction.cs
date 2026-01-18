using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasApi.Migrations
{
    /// <inheritdoc />
    public partial class AddressExtraction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Deliveries",
                newName: "Address_Street");

            migrationBuilder.RenameColumn(
                name: "PostalCode",
                table: "Deliveries",
                newName: "Address_PostalCode");

            migrationBuilder.RenameColumn(
                name: "HouseNumber",
                table: "Deliveries",
                newName: "Address_HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Deliveries",
                newName: "Address_Country");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Deliveries",
                newName: "Address_City");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Customers",
                newName: "Address_Street");

            migrationBuilder.RenameColumn(
                name: "PostalCode",
                table: "Customers",
                newName: "Address_PostalCode");

            migrationBuilder.RenameColumn(
                name: "HouseNumber",
                table: "Customers",
                newName: "Address_HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Customers",
                newName: "Address_Country");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Customers",
                newName: "Address_City");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Companies",
                newName: "Address_Street");

            migrationBuilder.RenameColumn(
                name: "PostalCode",
                table: "Companies",
                newName: "Address_PostalCode");

            migrationBuilder.RenameColumn(
                name: "HouseNumber",
                table: "Companies",
                newName: "Address_HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Companies",
                newName: "Address_Country");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Companies",
                newName: "Address_City");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address_Street",
                table: "Deliveries",
                newName: "Street");

            migrationBuilder.RenameColumn(
                name: "Address_PostalCode",
                table: "Deliveries",
                newName: "PostalCode");

            migrationBuilder.RenameColumn(
                name: "Address_HouseNumber",
                table: "Deliveries",
                newName: "HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Address_Country",
                table: "Deliveries",
                newName: "Country");

            migrationBuilder.RenameColumn(
                name: "Address_City",
                table: "Deliveries",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "Address_Street",
                table: "Customers",
                newName: "Street");

            migrationBuilder.RenameColumn(
                name: "Address_PostalCode",
                table: "Customers",
                newName: "PostalCode");

            migrationBuilder.RenameColumn(
                name: "Address_HouseNumber",
                table: "Customers",
                newName: "HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Address_Country",
                table: "Customers",
                newName: "Country");

            migrationBuilder.RenameColumn(
                name: "Address_City",
                table: "Customers",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "Address_Street",
                table: "Companies",
                newName: "Street");

            migrationBuilder.RenameColumn(
                name: "Address_PostalCode",
                table: "Companies",
                newName: "PostalCode");

            migrationBuilder.RenameColumn(
                name: "Address_HouseNumber",
                table: "Companies",
                newName: "HouseNumber");

            migrationBuilder.RenameColumn(
                name: "Address_Country",
                table: "Companies",
                newName: "Country");

            migrationBuilder.RenameColumn(
                name: "Address_City",
                table: "Companies",
                newName: "City");
        }
    }
}
