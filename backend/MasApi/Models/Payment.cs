using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using MasApi.Models.Enums;

namespace MasApi.Models;

public class Payment : BaseModel
{
    [Key]
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public Order? Order { get; set; }
    public required DateTime PaymentDate { get; set; }
    [Precision(18, 2)]
    [Range(0.0, double.MaxValue)]
    public required decimal Amount { get; set; }
    public required PaymentMethod PaymentMethod { get; set; }
    public required PaymentStatus Status { get; set; }
    public required Currency Currency { get; set; }

    public bool UpdateStatus()
    {
        switch (Status, Order?.Status)
        {
            case (PaymentStatus.Completed, OrderStatus.Cancelled):
            case (PaymentStatus.Completed, OrderStatus.Returned):
                Status = PaymentStatus.Refunded;
                return true;
            case (PaymentStatus.Pending, OrderStatus.Cancelled):
            case (PaymentStatus.Pending, OrderStatus.Returned):
                Status = PaymentStatus.Cancelled;
                return true;
        }
        return false;
    }
}