using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    public class Invoice
    {
        [Key]
        public required Guid Id { get; set; }
        public required DateTime IssuedAt { get; set; }
        // some url to retrieve the invoice pdf
    }
}                                                       