using System.ComponentModel.DataAnnotations;

namespace MasApi.Models
{
    public class Invoice
    {
        [Key]
        public required Guid Id { get; set; }
        public required Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public Guid? CompanyId { get; set; }
        public Company? Company { get; set; }
        public required DateTime IssuedAt { get; set; }
        public required Enums.InvoiceStatus Status { get; set; }
    }
}