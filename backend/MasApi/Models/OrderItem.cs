using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    [PrimaryKey(nameof(OrderId), nameof(ProductId))]
    public class OrderItem
    {
        public required Guid OrderId { get; set; }
        public Order? Order { get; set; }

        public required Guid ProductId { get; set; }
        public Product? Product { get; set; }

        public required int Quantity { get; set; }
        [Precision(18, 2)]
        public required decimal UnitPrice { get; set; }
    }
}