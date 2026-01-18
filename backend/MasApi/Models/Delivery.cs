using System.ComponentModel.DataAnnotations;

namespace MasApi.Models;

public class Delivery: BaseModel
{
    [Key]
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public Order? Order { get; set; }
    public required Guid CarrierId { get; set; }
    public Carrier? Carrier { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public required Address Address { get; set; }
    public string? TrackingNumber { get; set; }

}