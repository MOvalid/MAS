namespace MasApi.Models.Dtos;

public class AddressDto
{
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
}