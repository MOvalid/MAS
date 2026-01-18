using Microsoft.EntityFrameworkCore;

namespace MasApi.Models;

[Owned]
public class Address : BaseModel
{
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
}