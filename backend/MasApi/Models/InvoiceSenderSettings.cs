namespace MasApi.Models;

public class InvoiceSenderSettings
{
    public required string Name { get; set; }
    public required string TaxId { get; set; }
    public required string Email { get; set; }
    public required string Street { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
}