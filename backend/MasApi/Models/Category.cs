using System.ComponentModel.DataAnnotations;

namespace MasApi.Models
{
    public class Category
    {
        [Key]
        public required Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }

        public ICollection<Product>? Products { get; set; }
    }
}