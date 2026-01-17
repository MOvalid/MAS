using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models;

public class Payment: BaseModel
{
    [Key]
    public required Guid Id { get; set; }
    public required Guid OrderId { get; set; }
    public Order? Order { get; set; }
    public required DateTime PaymentDate { get; set; }
    [Precision(18, 2)]
    [Range(0.0, double.MaxValue)]
    public required decimal Amount { get; set; }
    public required Enums.PaymentMethod PaymentMethod { get; set; }
    public required Enums.PaymentStatus Status { get; set; }
    public required Enums.Currency Currency { get; set; }
}