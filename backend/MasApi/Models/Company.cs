using System.ComponentModel.DataAnnotations;

namespace MasApi.Models;

public class Company: BaseModel
{
    [Key]
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required Address Address { get; set; }
    public required string TaxId { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

    public ICollection<Invoice>? Invoices { get; set; }
}
