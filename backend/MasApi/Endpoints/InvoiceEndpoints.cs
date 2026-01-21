using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using MasApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq.Expressions;
using MasApi.Interfaces;

namespace MasApi.Endpoints;

public static class InvoiceEndpoints
{
    private const int PaymentDueDays = 14;

    public static WebApplication MapInvoiceEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/invoices")
            .WithTags("Invoices")
            .RequireAuthorization();

        group.MapPost("/", CreateInvoice)
            .WithName("CreateInvoice");

        group.MapGet("/{id}", GetInvoice)
            .WithName("GetInvoice");

        group.MapGet("/", GetInvoices)
            .WithName("GetInvoices");

        group.MapPut("/{id}", UpdateInvoice)
            .WithName("UpdateInvoice");

        group.MapDelete("/{id}", DeleteInvoice)
            .WithName("DeleteInvoice");

        group.MapGet("/{id}/file", GetInvoiceFile)
            .WithName("GetInvoiceFile");

        return app;
    }

    private static async Task<Results<Created<InvoiceDetailsDto>, BadRequest<string>>> CreateInvoice(InvoiceCreateDto invoiceRequest, Data.MasDbContext dbContext, IMapper mapper)
    {

        var order = await dbContext.Orders
            .Include(o => o.OrderProducts)
            .FirstOrDefaultAsync(o => o.Id == invoiceRequest.OrderId);
        if (order == null) return TypedResults.BadRequest("Order does not exist.");

        Company? company = null;
        if (invoiceRequest.CompanyId != null)
        {
            company = await dbContext.Companies.FindAsync(invoiceRequest.CompanyId.Value);
            if (company == null) return TypedResults.BadRequest("Company does not exist.");
        }

        int todayInvoiceCount = await dbContext.Invoices
            .CountAsync(i => i.IssuedAt.Date == DateTime.UtcNow.Date) + 1;

        var invoice = mapper.Map<Invoice>(invoiceRequest);

        invoice.IssuedAt = DateTime.UtcNow;
        invoice.PaymentDueDate = invoice.IssuedAt.AddDays(PaymentDueDays);
        invoice.InvoiceNumber = $"{DateTime.UtcNow:yyyy/MM/dd}-{todayInvoiceCount.ToString().PadLeft(5, '0')}";
        invoice.Status = InvoiceStatus.Draft;
        invoice.Company = company;
        invoice.Order = order;

        var (isValid, validationErrors) = invoice.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Invoices.Add(invoice);
        await dbContext.SaveChangesAsync();

        invoice = await dbContext.Invoices
            .Include(i => i.Order!.OrderProducts!)
                .ThenInclude(o => o!.Product!.Manufacturer)
            .Include(i => i.Order!.Customer)
            .Include(i => i.Order!.Seller)
            .Include(i => i.Order!.Delivery)
            .Include(i => i.Company)
            .FirstAsync(i => i.Id == invoice.Id);

        var invoiceDto = mapper.Map<InvoiceDetailsDto>(invoice);

        return TypedResults.Created($"/invoices/{invoice.Id}", invoiceDto);
    }

    private static async Task<Results<Ok<InvoiceDetailsDto>, NotFound>> GetInvoice(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var invoice = await dbContext.Invoices
            .Include(i => i.Order!.OrderProducts!)
                .ThenInclude(o => o!.Product!.Manufacturer)
            .Include(i => i.Order!.Customer)
            .Include(i => i.Order!.Seller)
            .Include(i => i.Order!.Delivery)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == id);
        if (invoice == null) return TypedResults.NotFound();

        var invoiceDto = mapper.Map<InvoiceDetailsDto>(invoice);
        return TypedResults.Ok(invoiceDto);
    }

    private static async Task<Results<Ok<PagedResults<InvoiceListDto>>, NotFound>> GetInvoices(string? search, string? sorting, int? page, int? limit, string? status, string? startDate, string? endDate, string? paymentStartDate, string? paymentEndDate, Data.MasDbContext dbContext, IMapper mapper)
    {
        IQueryable<Invoice> invoicesQuery = dbContext.Invoices;

        if (!string.IsNullOrEmpty(search))
        {
            invoicesQuery = invoicesQuery.Where(i => i.InvoiceNumber.ToLower().Contains(search.ToLower()));
        }

        if (!string.IsNullOrEmpty(status))
        {
            invoicesQuery = invoicesQuery.Where(i => i.Status.ToString().ToLower().Equals(status.ToLower()));
        }

        if (DateTime.TryParse(startDate, out var parsedStartDate))
        {
            invoicesQuery = invoicesQuery.Where(i => i.IssuedAt.Date >= parsedStartDate.Date);
        }
        if (DateTime.TryParse(endDate, out var parsedEndDate))
        {
            invoicesQuery = invoicesQuery.Where(i => i.IssuedAt.Date <= parsedEndDate.Date);
        }

        if (DateTime.TryParse(paymentStartDate, out var parsedPaymentStartDate))
        {
            invoicesQuery = invoicesQuery.Where(i => i.PaymentDueDate.Date >= parsedPaymentStartDate.Date);
        }
        if (DateTime.TryParse(paymentEndDate, out var parsedPaymentEndDate))
        {
            invoicesQuery = invoicesQuery.Where(i => i.PaymentDueDate.Date <= parsedPaymentEndDate.Date);
        }

        var sortingTokens = sorting?.Split('_');
        var sortingField = sortingTokens?.Length > 0 ? sortingTokens[0] : string.Empty;
        var sortingOrder = sortingTokens?.Length > 1 ? sortingTokens[1] : null;

        if (sortingOrder != null && sortingOrder.Contains("desc", StringComparison.CurrentCultureIgnoreCase))
        {
            invoicesQuery = invoicesQuery.OrderByDescending(GetSortingFieldSelector(sortingField));
        }
        else
        {
            invoicesQuery = invoicesQuery.OrderBy(GetSortingFieldSelector(sortingField));
        }

        limit ??= 10;
        int totalCount = await invoicesQuery.CountAsync();
        var invoices = await invoicesQuery
            .Skip(((page ?? 1) - 1) * limit.Value)
            .Take(limit.Value)
            .Include(i => i.Order)
                .ThenInclude(o => o!.OrderProducts)
            .Select(invoice => mapper.Map<InvoiceListDto>(invoice))
            .ToListAsync();

        return TypedResults.Ok(new PagedResults<InvoiceListDto>
        {
            Items = invoices,
            TotalCount = totalCount,
            Page = page ?? 1,
            Limit = limit.Value
        });
    }

    private static async Task<Results<Ok<InvoiceDetailsDto>, NotFound, BadRequest<string>>> UpdateInvoice(Guid id, InvoiceUpdateDto invoiceRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var invoice = await dbContext.Invoices
            .Include(i => i.Order!.OrderProducts!)
                .ThenInclude(o => o!.Product!.Manufacturer)
            .Include(i => i.Order!.Customer)
            .Include(i => i.Order!.Seller)
            .Include(i => i.Order!.Delivery)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == id);
        if (invoice == null) return TypedResults.NotFound();

        mapper.Map(invoiceRequest, invoice);

        var (isValid, validationErrors) = invoice.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Invoices.Update(invoice);
        await dbContext.SaveChangesAsync();

        var invoiceDto = mapper.Map<InvoiceDetailsDto>(invoice);

        return TypedResults.Ok(invoiceDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteInvoice(Guid id, Data.MasDbContext dbContext)
    {
        var invoice = await dbContext.Invoices.FindAsync(id);
        if (invoice == null) return TypedResults.NotFound();

        dbContext.Invoices.Remove(invoice);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }

    private static async Task<Results<FileContentHttpResult, NotFound>> GetInvoiceFile(Guid id, Data.MasDbContext dbContext, IInvoicePdfService invoicePdfService)
    {
        var invoice = await dbContext.Invoices
            .Include(i => i.Order)
            .Include(i => i.Order!.Customer)
            .Include(i => i.Order!.Seller)
            .Include(i => i.Company)
            .Include(i => i.Order!.OrderProducts!)
                .ThenInclude(op => op.Product)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (invoice == null)
        {
            return TypedResults.NotFound();
        }

        var pdfBytes = invoicePdfService.GenerateInvoicePdf(invoice);
        var fileName = $"Faktura_{invoice.InvoiceNumber}.pdf";

        return TypedResults.File(
            fileContents: pdfBytes,
            contentType: "application/pdf",
            fileDownloadName: fileName
        );
    }

    private static Expression<Func<Invoice, object>> GetSortingFieldSelector(string? sortingField)
    {
        if (!Enum.TryParse<InvoiceSortingField>(sortingField, true, out var parsedField))
        {
            return invoice => invoice.IssuedAt;
        }

        return parsedField switch
        {
            InvoiceSortingField.Issued => invoice => invoice.IssuedAt,
            InvoiceSortingField.Payment => invoice => invoice.PaymentDueDate,
            InvoiceSortingField.Amount => invoice => invoice.Order!.OrderProducts!.Sum(op => op.Quantity * op.UnitNetPrice * (1 + op.VatRate)),
            _ => invoice => invoice.IssuedAt
        };
    }

    private enum InvoiceSortingField
    {
        Issued,
        Payment,
        Amount
    }
}