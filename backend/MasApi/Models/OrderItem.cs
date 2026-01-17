using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    [PrimaryKey(nameof(OrderId), nameof(ProductId))]
    public class OrderItem: BaseModel
    {
        public required Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public required Guid ProductId { get; set; }
        public Product? Product { get; set; }
        [Range(1, int.MaxValue)]
        public required int Quantity { get; set; }
        [Precision(18, 2)]
        [Range(0.0, double.MaxValue)]
        public required decimal UnitNetPrice { get; set; }
        [Precision(3, 2)]
        [Range(0.0, 1.0)]
        public required decimal VatRate { get; set; }
        public required Enums.Currency Currency { get; set; }

        [NotMapped]
        public decimal TotalNetPrice => UnitNetPrice * Quantity;
        [NotMapped]
        public decimal TotalVatAmount => TotalNetPrice * (decimal)VatRate;
        [NotMapped]
        public decimal TotalGrossPrice => TotalNetPrice + TotalVatAmount;
    }
}