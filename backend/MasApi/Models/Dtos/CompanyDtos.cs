namespace MasApi.Models.Dtos;

public class CompanyCreateDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required AddressDto Address { get; set; }
    public required string TaxId { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}

public class CompanyDetailsDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required AddressDto Address { get; set; }
    public required string TaxId { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public ICollection<InvoiceListDto>? Invoices { get; set; }
}

public class CompanyListDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    public required AddressDto Address { get; set; }
    public required string TaxId { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}