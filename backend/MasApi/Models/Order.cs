using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        public required Enums.Currency Currency { get; set; }

        public Invoice? Invoice { get; set; }
        public Delivery? Delivery { get; set; }
        public ICollection<Payment>? Payments { get; set; }
        public ICollection<OrderItem>? OrderProducts { get; set; }

        [NotMapped]
        public decimal TotalNetPrice => OrderProducts?.Sum(op => op.TotalNetPrice) ?? 0;
        [NotMapped]
        public decimal TotalVatAmount => OrderProducts?.Sum(op => op.TotalVatAmount) ?? 0;
        [NotMapped]
        public decimal TotalGrossPrice => OrderProducts?.Sum(op => op.TotalGrossPrice) ?? 0;
    }
}