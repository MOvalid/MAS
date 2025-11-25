using System.ComponentModel.DataAnnotations;
using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    [Index(nameof(Email), IsUnique = true)]
    public class Customer
    {
        [Key]
        public required Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }

        [EmailAddress]
        [MaxLength(450)]
        public required string Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Street { get; set; }
        public required string HouseNumber { get; set; }
        public required string City { get; set; }
        public required string PostalCode { get; set; }
        public required string Country { get; set; }

        public ICollection<Order>? Orders { get; set; }
    }
}