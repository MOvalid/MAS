using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Models
{
    [Index(nameof(InvoiceNumber), IsUnique = true)]
    public class Invoice: BaseModel
    {
        [Key]
        public required Guid Id { get; set; }
        public required string InvoiceNumber { get; set; }
        public required Guid OrderId { get; set; }
        public Order? Order { get; set; }
        public Guid? CompanyId { get; set; }
        public Company? Company { get; set; }
        public required DateTime IssuedAt { get; set; }
        public required DateTime PaymentDueDate { get; set; }
        public required Enums.InvoiceStatus Status { get; set; }

        public bool UpdateStatus()
        {
            switch (Status)
            {
                case Enums.InvoiceStatus.Issued:
                    if (Order != null && Order.Status == Enums.OrderStatus.Paid)
                    {
                        Status = Enums.InvoiceStatus.Paid;
                        return true;
                    }
                    else if (Order != null && Order.Status == Enums.OrderStatus.Cancelled)
                    {
                        Status = Enums.InvoiceStatus.Cancelled;
                        return true;
                    }
                    else if (DateTime.UtcNow > PaymentDueDate)
                    {
                        Status = Enums.InvoiceStatus.Overdue;
                        return true;
                    }
                    break;
                case Enums.InvoiceStatus.Paid:
                    if (Order != null && (Order.Status == Enums.OrderStatus.Cancelled || Order.Status == Enums.OrderStatus.Returned))
                    {
                        Status = Enums.InvoiceStatus.Refunded;
                        return true;
                    }
                    break;
            }
            return false;
        }
    }
}