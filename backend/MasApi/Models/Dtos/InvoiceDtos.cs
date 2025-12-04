namespace MasApi.Models.Dtos;

public class InvoiceCreateDto
{
    public required Guid OrderId { get; set; }
    public Guid? CompanyId { get; set; }
}

public class InvoiceListDto
{
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public Guid? CompanyId { get; set; }
    public required DateTime IssuedAt { get; set; }
    public required string Status { get; set; }
    // TODO: Add link to download invoice PDF
}

public class InvoiceDetailsDto
{
    public required Guid Id { get; set; }
    public required Order Order { get; set; } // TODO: Change to OrderListDto
    public CompanyListDto? Company { get; set; }
    public required DateTime IssuedAt { get; set; }
    public required string Status { get; set; }
    // TODO: Add link to download invoice PDF
}