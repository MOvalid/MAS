using System.ComponentModel.DataAnnotations;
using MasApi.Models.Enums;

namespace MasApi.Models;

public class Delivery : BaseModel
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
    public required DeliveryStatus Status { get; set; }

    public bool UpdateStatus()
    {
        switch (Status)
        {
            case DeliveryStatus.PendingPayment:
                if (Order != null && Order.Status == OrderStatus.Paid)
                {
                    Status = DeliveryStatus.InProgress;
                    return true;
                }
                break;
            case DeliveryStatus.InProgress:
                if (Order != null && Order.Status == OrderStatus.Cancelled)
                {
                    Status = DeliveryStatus.Cancelled;
                    return true;
                }
                break;
        }
        return false;
    }
}