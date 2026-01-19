using MasApi.Models;
using MasApi.Interfaces;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Microsoft.Extensions.Options;

namespace MasApi.Services;

public class InvoicePdfService : IInvoicePdfService
{
    private readonly InvoiceSenderSettings _senderSettings;

    public InvoicePdfService(IOptions<InvoiceSenderSettings> options)
    {
        _senderSettings = options.Value;
    }

    public byte[] GenerateInvoicePdf(Invoice invoice)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(handler => ComposeHeader(handler, invoice));
                page.Content().Element(handler => ComposeContent(handler, invoice));
                page.Footer().AlignCenter().Text(x =>
                {
                    x.CurrentPageNumber();
                    x.Span(" / ");
                    x.TotalPages();
                });
            });
        });

        return document.GeneratePdf();
    }

    private void ComposeHeader(IContainer container, Invoice invoice)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text($"Faktura nr: {invoice.InvoiceNumber}")
                    .FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

                column.Item().Text($"Data wystawienia: {invoice.IssuedAt:yyyy-MM-dd}");
                column.Item().Text($"Termin płatności: {invoice.PaymentDueDate:yyyy-MM-dd}");
            });
        });
    }

    private void ComposeContent(IContainer container, Invoice invoice)
    {
        var currency = invoice.Order?.Currency.ToString() ?? "";

        object? buyer = (object?)invoice.Company ?? invoice.Order?.Customer;

        container.PaddingVertical(40).Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Component(new AddressComponent("Sprzedawca", _senderSettings));
                row.RelativeItem().Component(new AddressComponent("Nabywca", buyer));
            });

            column.Item().PaddingTop(25).Element(handler => ComposeTable(handler, invoice, currency));

            column.Item().PaddingTop(25).Row(row =>
            {
                row.RelativeItem().ExtendHorizontal();
                row.RelativeItem().Column(c =>
                {
                    c.Item().Text($"Suma Netto: {invoice.Order?.TotalNetPrice:N2} {currency}").AlignRight();
                    c.Item().Text($"Suma VAT: {invoice.Order?.TotalVatAmount:N2} {currency}").AlignRight();

                    c.Item().BorderTop(1).BorderColor(Colors.Grey.Medium).PaddingTop(5)
                        .Text($"Do zapłaty: {invoice.Order?.TotalGrossPrice:N2} {currency}")
                        .FontSize(14).SemiBold().AlignRight();
                });
            });

            column.Item().PaddingTop(50).Element(ComposeSignatures);
        });
    }

    private void ComposeSignatures(IContainer container)
    {
        container.ShowEntire().Row(row =>
        {
            // Zmieniono Colors.Grey.Light na Colors.Grey.Lighten1
            row.RelativeItem().Border(1).BorderColor(Colors.Grey.Lighten1).Padding(10).Column(column =>
            {
                column.Item().Height(40);
                // Zmieniono Colors.Grey.Light na Colors.Grey.Lighten1
                column.Item().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).ExtendHorizontal();
                column.Item().AlignCenter().PaddingTop(5).Text("Podpis osoby upoważnionej do wystawienia").FontSize(9);
            });

            row.ConstantItem(20);

            // Zmieniono Colors.Grey.Light na Colors.Grey.Lighten1
            row.RelativeItem().Border(1).BorderColor(Colors.Grey.Lighten1).Padding(10).Column(column =>
            {
                column.Item().Height(40);
                // Zmieniono Colors.Grey.Light na Colors.Grey.Lighten1
                column.Item().BorderBottom(1).BorderColor(Colors.Grey.Lighten1).ExtendHorizontal();
                column.Item().AlignCenter().PaddingTop(5).Text("Podpis osoby upoważnionej do odbioru").FontSize(9);
            });
        });
    }

    private void ComposeTable(IContainer container, Invoice invoice, string orderCurrency)
    {
        const float spacing = 15;

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.ConstantColumn(25);
                columns.RelativeColumn(3);
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
                columns.RelativeColumn();
            });

            table.Header(header =>
            {
                header.Cell().Element(CellStyle).Text("#");
                header.Cell().Element(CellStyle).Text("Produkt");
                header.Cell().Element(CellStyle).AlignRight().Text("Ilość");
                header.Cell().Element(CellStyle).AlignRight().Text($"Cena Netto [{orderCurrency}]");
                header.Cell().Element(CellStyle).AlignRight().PaddingRight(spacing).Text("VAT");
                header.Cell().Element(CellStyle).AlignRight().Text($"Wartość [{orderCurrency}]");

                static IContainer CellStyle(IContainer container)
                {
                    return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).BorderBottom(1).BorderColor(Colors.Grey.Lighten1);
                }
            });

            if (invoice.Order?.OrderProducts != null)
            {
                int index = 1;
                foreach (var item in invoice.Order.OrderProducts)
                {
                    table.Cell().Element(CellStyle).Text($"{index++}");
                    table.Cell().Element(CellStyle).Text(item.Product?.Name ?? "Produkt usunięty");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.Quantity}");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.UnitNetPrice:N2}");
                    table.Cell().Element(CellStyle).AlignRight().PaddingRight(spacing).Text($"{item.VatRate:P0}");
                    table.Cell().Element(CellStyle).AlignRight().Text($"{item.TotalGrossPrice:N2}");

                    static IContainer CellStyle(IContainer container)
                    {
                        return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten3).PaddingVertical(5);
                    }
                }
            }
        });
    }
}

public class AddressComponent : IComponent
{
    private string Title { get; }
    private object? Entity { get; }

    public AddressComponent(string title, object? entity)
    {
        Title = title;
        Entity = entity;
    }

    public void Compose(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Text(Title).SemiBold().FontSize(12).FontColor(Colors.Grey.Medium);

            if (Entity is InvoiceSenderSettings sender)
            {
                column.Item().Text(sender.Name).SemiBold();
                column.Item().Text($"NIP: {sender.TaxId}");
                column.Item().Text(sender.Email);
                column.Item().Text(sender.Street);
                column.Item().Text($"{sender.PostalCode} {sender.City}");
                column.Item().Text(sender.Country);
            }
            else if (Entity is Company company)
            {
                column.Item().Text(company.Name).SemiBold();
                column.Item().Text($"NIP: {company.TaxId}");
                if (!string.IsNullOrEmpty(company.Email)) column.Item().Text(company.Email);
                FormatAddress(column, company.Address);
            }
            else if (Entity is Customer customer)
            {
                column.Item().Text($"{customer.FirstName} {customer.LastName}");
                column.Item().Text(customer.Email);
                FormatAddress(column, customer.Address);
            }
        });
    }

    private void FormatAddress(ColumnDescriptor column, Address? address)
    {
        if (address == null) return;
        column.Item().Text($"{address.Street} {address.HouseNumber}");
        column.Item().Text($"{address.PostalCode} {address.City}");
        column.Item().Text(address.Country);
    }
}