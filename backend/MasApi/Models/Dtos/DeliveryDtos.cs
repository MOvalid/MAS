using MasApi.Models.Enums;

namespace MasApi.Models.Dtos;

public class DeliveryCreateDto
{
    public required Guid OrderId { get; set; }
    public required Guid CarrierId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public required AddressDto Address { get; set; }
    public string? TrackingNumber { get; set; }
}

public class DeliveryUpdateDto
{
    public required string Status { get; set; }
}

public class DeliveryListDto
{
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public required Guid CarrierId { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public required AddressDto Address { get; set; }
    public string? TrackingNumber { get; set; }
    public required string Status { get; set; }
}

public class DeliveryDetailsDto
{
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public OrderListDto? Order { get; set; }
    public required Guid CarrierId { get; set; }
    public CarrierListDto? Carrier { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public required AddressDto Address { get; set; }
    public required string Status { get; set; }
    public string? TrackingNumber { get; set; }
}