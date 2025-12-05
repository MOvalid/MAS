namespace MasApi.Models.Dtos;

public class PaymentCreateDto
{
    public required Guid OrderId { get; set; }
    public required decimal Amount { get; set; }
    public required string PaymentMethod { get; set; }
    public required string Status { get; set; }
    public required string Currency { get; set; }
}

public class PaymentListDto
{
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public required DateTime PaymentDate { get; set; }
    public required decimal Amount { get; set; }
    public required string PaymentMethod { get; set; }
    public required string Status { get; set; }
    public required string Currency { get; set; }
}

public class PaymentDetailsDto
{
    public required Guid Id { get; set; }
    public required OrderListDto Order { get; set; }
    public required DateTime PaymentDate { get; set; }
    public required decimal Amount { get; set; }
    public required string PaymentMethod { get; set; }
    public required string Status { get; set; }
    public required string Currency { get; set; }
}