namespace MasApi.Models.Dtos;

public class OrderCreateDto
{
    public required Guid CustomerId { get; set; }
    public required Guid SellerId { get; set; }
    public required string Currency { get; set; }
    public ICollection<OrderItemCreateDto>? OrderProducts { get; set; }
}

public class OrderItemCreateDto
{
    public required Guid ProductId { get; set; }
    public required int Quantity { get; set; }
}

public class OrderListDto
{
    public required Guid Id { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required Guid CustomerId { get; set; }
    public required Guid SellerId { get; set; }
    public required string Currency { get; set; }
    public required string Status { get; set; }
    public required decimal TotalNetPrice { get; set; }
    public required decimal TotalVatAmount { get; set; }
    public required decimal TotalGrossPrice { get; set; }
}

public class OrderDetailsDto
{
    public required Guid Id { get; set; }
    public required DateTime CreatedAt { get; set; }
    public required CustomerListDto Customer { get; set; }
    public required SellerListDto Seller { get; set; }
    public required string Currency { get; set; }
    public required string Status { get; set; }
    public required decimal TotalNetPrice { get; set; }
    public required decimal TotalVatAmount { get; set; }
    public required decimal TotalGrossPrice { get; set; }
    public ICollection<OrderItemDetailsDto>? OrderProducts { get; set; }
    public ICollection<PaymentListDto>? Payments { get; set; }
    public InvoiceListDto? Invoice { get; set; }
    public DeliveryListDto? Delivery { get; set; }
}

public class OrderItemDetailsDto
{
    public required Guid ProductId { get; set; }
    public required ProductListDto Product { get; set; }
    public required int Quantity { get; set; }
    public required decimal UnitNetPrice { get; set; }
    public required decimal VatRate { get; set; }
    public required string Currency { get; set; }
    public required decimal TotalNetPrice { get; set; }
    public required decimal TotalVatAmount { get; set; }
    public required decimal TotalGrossPrice { get; set; }
}