namespace MasApi.Models.Dtos;

public class DeliveryCreateDto
{
    public required Guid OrderId { get; set; }
    public required Guid CarrierId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public string? TrackingNumber { get; set; }
}

public class DeliveryListDto
{
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public required Guid CarrierId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public string? TrackingNumber { get; set; }
}

public class DeliveryDetailsDto
{
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public OrderListDto? Order { get; set; }
    public required Guid CarrierId { get; set; }
    public CarrierListDto? Carrier { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public string? TrackingNumber { get; set; }
}