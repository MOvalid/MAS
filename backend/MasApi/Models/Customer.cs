using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Customer: BaseModel
    {
        [Key]
        public required Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        [EmailAddress]
        [MaxLength(450)]
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public required Address Address { get; set; }

        public ICollection<Order>? Orders { get; set; }
    }
}