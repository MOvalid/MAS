namespace MasApi.Models.Enums;

public enum OrderStatus
{
    Draft,
    PendingPayment,
    Paid,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Returned,
}