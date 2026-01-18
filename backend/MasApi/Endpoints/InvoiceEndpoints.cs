using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using MasApi.Models.Enums;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

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

        // TODO: Generate PDF and store it somewhere

        dbContext.Invoices.Add(invoice);
        await dbContext.SaveChangesAsync();

        var invoiceDto = mapper.Map<InvoiceDetailsDto>(invoice);

        return TypedResults.Created($"/invoices/{invoice.Id}", invoiceDto);
    }

    private static async Task<Results<Ok<InvoiceDetailsDto>, NotFound>> GetInvoice(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var invoice = await dbContext.Invoices
            .Include(i => i.Order)
                .ThenInclude(o => o!.OrderProducts)
            .Include(i => i.Company)
            .FirstOrDefaultAsync(i => i.Id == id);
        if (invoice == null) return TypedResults.NotFound();

        var invoiceDto = mapper.Map<InvoiceDetailsDto>(invoice);
        return TypedResults.Ok(invoiceDto);
    }

    private static async Task<Results<Ok<List<InvoiceListDto>>, NotFound>> GetInvoices(Data.MasDbContext dbContext, IMapper mapper)
    {
        var invoices = await dbContext.Invoices
            .Include(i => i.Order)
                .ThenInclude(o => o!.OrderProducts)
            .Select(invoice => mapper.Map<InvoiceListDto>(invoice))
            .ToListAsync();

        return TypedResults.Ok(invoices);
    }

    private static async Task<Results<Ok<InvoiceDetailsDto>, NotFound, BadRequest<string>>> UpdateInvoice(Guid id, InvoiceUpdateDto invoiceRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var invoice = await dbContext.Invoices
            .Include(i => i.Order)
                .ThenInclude(o => o!.OrderProducts)
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
}