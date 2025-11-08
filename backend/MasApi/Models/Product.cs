using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    public class Product
    {
        [Key]
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Sku { get; set; }
        [Precision(18, 2)]
        public required decimal Price { get; set; }
        public required int StockQuantity { get; set; }
        public string? Description { get; set; }

        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}