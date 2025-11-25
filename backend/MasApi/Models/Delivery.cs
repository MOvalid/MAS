using System.ComponentModel.DataAnnotations;

namespace MasApi.Models;

public class Delivery
{
    [Key]
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public Order? Order { get; set; }
    public required Guid CarrierId { get; set; }
    public Carrier? Carrier { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? Street { get; set; }
    public required string HouseNumber { get; set; }
    public required string City { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public string? TrackingNumber { get; set; }

}