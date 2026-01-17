using System.ComponentModel.DataAnnotations;

namespace MasApi.Models;

public class Company: BaseModel
{
    [Key]
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public required string TaxId { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    public ICollection<Invoice>? Invoices { get; set; }
}
