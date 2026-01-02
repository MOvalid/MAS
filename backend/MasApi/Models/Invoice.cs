using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    [Index(nameof(InvoiceNumber), IsUnique = true)]
    public class Invoice
    {
        [Key]
        public required Guid Id { get; set; }
        public required string InvoiceNumber { get; set; }
        public required Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public Guid? CompanyId { get; set; }
        public Company? Company { get; set; }
        public required DateTime IssuedAt { get; set; }
        public required DateTime PaymentDueDate { get; set; }
        public required Enums.InvoiceStatus Status { get; set; }
    }
}