namespace MasApi.Models.Dtos;

public class InvoiceCreateDto
{
    public required Guid OrderId { get; set; }
    public Guid? CompanyId { get; set; }
}

public class InvoiceUpdateDto
{
    public required string Status { get; set; }
}

public class InvoiceListDto
{
    public required Guid Id { get; set; }
    public required string InvoiceNumber { get; set; }
    public required Guid OrderId { get; set; }
    public Guid? CompanyId { get; set; }
    public required DateTime IssuedAt { get; set; }
    public required DateTime PaymentDueDate { get; set; }
    public required string Status { get; set; }
    public required decimal TotalNetPrice { get; set; }
    public required decimal TotalVatAmount { get; set; }
    public required decimal TotalGrossPrice { get; set; }
}

public class InvoiceDetailsDto
{
    public required Guid Id { get; set; }
    public required string InvoiceNumber { get; set; }
    public required OrderListDto Order { get; set; }
    public CompanyListDto? Company { get; set; }
    public required DateTime IssuedAt { get; set; }
    public required DateTime PaymentDueDate { get; set; }
    public required string Status { get; set; }
}