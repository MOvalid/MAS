using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    public class Product: BaseModel
    {
        [Key]
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Sku { get; set; }
        public required Guid ManufacturerId { get; set; }
        public Company? Manufacturer { get; set; }
        [Precision(18, 2)]
        [Range(0.0, double.MaxValue)]
        public required decimal NetPrice { get; set; }
        [Precision(3, 2)]
        [Range(0.0, 1.0)]
        public required decimal VatRate { get; set; }
        [Range(0, int.MaxValue)]
        public required int StockQuantity { get; set; }
        public string? Description { get; set; }
        [Precision(18, 3)]
        [Range(0.0, double.MaxValue)]
        public required decimal Length { get; set; }
        [Precision(18, 3)]
        [Range(0.0, double.MaxValue)]
        public required decimal Width { get; set; }
        [Precision(18, 3)]
        [Range(0.0, double.MaxValue)]
        public required decimal Height { get; set; }
        public DateTime? LastRestockedAt { get; set; }

        [NotMapped]
        public Enums.StockLevel StockLevel
        {
            get
            {
                if (StockQuantity == 0) return Enums.StockLevel.None;
                if (StockQuantity < 20) return Enums.StockLevel.Low;
                if (StockQuantity < 40) return Enums.StockLevel.Medium;
                return Enums.StockLevel.High;
            }
        }

        public Guid? CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}