using MasApi.Models;
using MasApi.Models.Dtos;
using MasApi.Models.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
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

        var order = await dbContext.Orders
            .Include(o => o.OrderProducts)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == paymentRequest.OrderId);
        if (order == null) return TypedResults.BadRequest("Order does not exist.");

        var payment = mapper.Map<Payment>(paymentRequest);

        payment.PaymentDate = DateTime.UtcNow.AddDays(PaymentDueDays);

        var (isValid, validationErrors) = payment.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        if (
            (
                order.Payments?
                    .Where(p => !p.Status.Equals(PaymentStatus.Cancelled))
                    .Sum(p => p.Amount)
                + payment.Amount
            )
                > order.TotalGrossPrice
            )
        {
            return TypedResults.BadRequest("Payment amount exceeds order total.");
        }

        dbContext.Payments.Add(payment);
        await dbContext.SaveChangesAsync();

        var paymentDto = mapper.Map<PaymentDetailsDto>(payment);

        return TypedResults.Created($"/payments/{payment.Id}", paymentDto);
    }

    private static async Task<Results<Ok<PaymentDetailsDto>, NotFound>> GetPayment(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var payment = await dbContext.Payments
            .Include(p => p.Order)
                .ThenInclude(o => o!.OrderProducts)
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

    private static async Task<Results<Ok<PaymentDetailsDto>, NotFound, BadRequest<string>>> UpdatePayment(Guid id, PaymentUpdateDto paymentRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var payment = await dbContext.Payments
            .Include(p => p.Order)
                .ThenInclude(o => o!.OrderProducts)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) return TypedResults.NotFound();

        mapper.Map(paymentRequest, payment);

        var (isValid, validationErrors) = payment.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

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