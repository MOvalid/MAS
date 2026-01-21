using MasApi.Models;

namespace MasApi.Interfaces;

public interface IInvoicePdfService
{
    byte[] GenerateInvoicePdf(Invoice invoice);
}