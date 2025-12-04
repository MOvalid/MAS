using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class PaymentEndpoints
{
    private const int PaymentDueDays = 14;

    public static WebApplication MapPaymentEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/payments")
            .WithTags("Payments")
            .RequireAuthorization();

        group.MapPost("/", CreatePayment)
            .WithName("CreatePayment");

        group.MapGet("/{id}", GetPayment)
            .WithName("GetPayment");

        group.MapGet("/", GetPayments)
            .WithName("GetPayments");

        group.MapPut("/{id}", UpdatePayment)
            .WithName("UpdatePayment");

        group.MapDelete("/{id}", DeletePayment)
            .WithName("DeletePayment");

        return app;
    }

    private static async Task<Results<Created<PaymentDetailsDto>, BadRequest<string>>> CreatePayment(PaymentCreateDto paymentRequest, Data.MasDbContext dbContext, IMapper mapper)
    {

        var order = await dbContext.Orders.FindAsync(paymentRequest.OrderId);
        if (order == null) return TypedResults.BadRequest("Order does not exist.");

        var payment = mapper.Map<Payment>(paymentRequest);

        payment.PaymentDate = DateTime.UtcNow.AddDays(PaymentDueDays);

        dbContext.Payments.Add(payment);
        await dbContext.SaveChangesAsync();

        var paymentDto = mapper.Map<PaymentDetailsDto>(payment);

        return TypedResults.Created($"/payments/{payment.Id}", paymentDto);
    }

    private static async Task<Results<Ok<PaymentDetailsDto>, NotFound>> GetPayment(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var payment = await dbContext.Payments
            .Include(p => p.Order)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) return TypedResults.NotFound();

        var paymentDto = mapper.Map<PaymentDetailsDto>(payment);
        return TypedResults.Ok(paymentDto);
    }

    private static async Task<Results<Ok<List<PaymentListDto>>, NotFound>> GetPayments(Data.MasDbContext dbContext, IMapper mapper)
    {
        var payments = await dbContext.Payments
            .Select(payment => mapper.Map<PaymentListDto>(payment))
            .ToListAsync();

        return TypedResults.Ok(payments);
    }

    private static async Task<Results<Ok<PaymentDetailsDto>, NotFound, BadRequest<string>>> UpdatePayment(Guid id, PaymentCreateDto paymentRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var payment = await dbContext.Payments.FindAsync(id);
        if (payment == null) return TypedResults.NotFound();

        var order = await dbContext.Orders.FindAsync(paymentRequest.OrderId);
        if (order == null) return TypedResults.BadRequest("Order does not exist.");

        mapper.Map(paymentRequest, payment);

        dbContext.Payments.Update(payment);
        await dbContext.SaveChangesAsync();

        var paymentDto = mapper.Map<PaymentDetailsDto>(payment);

        return TypedResults.Ok(paymentDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeletePayment(Guid id, Data.MasDbContext dbContext)
    {
        var payment = await dbContext.Payments.FindAsync(id);
        if (payment == null) return TypedResults.NotFound();

        dbContext.Payments.Remove(payment);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}