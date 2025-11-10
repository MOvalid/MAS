using System.ComponentModel.DataAnnotations;

namespace MasApi.Models
{
    public class Order
    {
        [Key]
        public required Guid Id { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }
        public required Guid SellerId { get; set; }
        public Seller? Seller { get; set; }
        public Guid? InvoiceId { get; set; }
        public Invoice? Invoice { get; set; }
        public ICollection<OrderItem>? OrderProducts { get; set; }
    }
}