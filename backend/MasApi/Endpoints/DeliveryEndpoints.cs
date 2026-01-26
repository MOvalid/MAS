using MasApi.Models;
using MasApi.Models.Dtos;
using MasApi.Models.Enums;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class DeliveryEndpoints
{
    public static WebApplication MapDeliveryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/deliveries")
            .WithTags("Deliveries")
            .RequireAuthorization();

        group.MapPost("/", CreateDelivery)
            .WithName("CreateDelivery");

        group.MapGet("/{id}", GetDelivery)
            .WithName("GetDelivery");

        group.MapGet("/", GetDeliveries)
            .WithName("GetDeliveries");

        group.MapPut("/{id}", UpdateDelivery)
            .WithName("UpdateDelivery");

        group.MapDelete("/{id}", DeleteDelivery)
            .WithName("DeleteDelivery");

        return app;
    }

    private static async Task<Results<Created<DeliveryDetailsDto>, BadRequest<string>>> CreateDelivery(DeliveryCreateDto deliveryRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var order = await dbContext.Orders
            .Include(o => o.OrderProducts)
            .Include(o => o.Invoice)
            .Include(o => o.Delivery)
            .Include(o => o.Payments)
            .FirstOrDefaultAsync(o => o.Id == deliveryRequest.OrderId);
        if (order == null) return TypedResults.BadRequest("Order does not exist.");

        var existingDelivery = await dbContext.Deliveries.Where(d => d.Status != DeliveryStatus.Cancelled).FirstOrDefaultAsync(d => d.OrderId == deliveryRequest.OrderId);
        if (existingDelivery != null) return TypedResults.BadRequest("Delivery for this order already exists.");

        if (order.Status == OrderStatus.Cancelled || order.Status == OrderStatus.Returned)
        {
            return TypedResults.BadRequest("Cannot create delivery for a cancelled or returned order.");
        }

        var delivery = mapper.Map<Delivery>(deliveryRequest);

        if (order.Status == OrderStatus.PendingPayment)
        {
            delivery.Status = DeliveryStatus.PendingPayment;
        }
        else
        {
            delivery.Status = DeliveryStatus.InProgress;
        }

        var (isValid, validationErrors) = delivery.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Deliveries.Add(delivery);
        await dbContext.SaveChangesAsync();

        delivery = await dbContext.Deliveries
            .Include(d => d.Order!.OrderProducts!)
                .ThenInclude(op => op.Product!.Manufacturer)
            .Include(d => d.Order!.Customer)
            .Include(d => d.Order!.Seller)
            .Include(d => d.Order!.Invoice!.Company)
            .Include(d => d.Carrier)
            .FirstAsync(d => d.Id == delivery.Id);

        var deliveryDto = mapper.Map<DeliveryDetailsDto>(delivery);

        return TypedResults.Created($"/deliveries/{delivery.Id}", deliveryDto);
    }

    private static async Task<Results<Ok<DeliveryDetailsDto>, NotFound>> GetDelivery(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var delivery = await dbContext.Deliveries
            .Include(d => d.Order!.OrderProducts!)
                .ThenInclude(op => op.Product!.Manufacturer)
            .Include(d => d.Order!.Customer)
            .Include(d => d.Order!.Seller)
            .Include(d => d.Order!.Invoice!.Company)
            .Include(d => d.Carrier)
            .FirstOrDefaultAsync(d => d.Id == id);
        if (delivery == null) return TypedResults.NotFound();

        var deliveryDto = mapper.Map<DeliveryDetailsDto>(delivery);

        return TypedResults.Ok(deliveryDto);
    }

    private static async Task<Results<Ok<List<DeliveryListDto>>, NotFound>> GetDeliveries(Data.MasDbContext dbContext, IMapper mapper)
    {
        var deliveries = await dbContext.Deliveries
            .Select(d => mapper.Map<DeliveryListDto>(d))
            .ToListAsync();

        return TypedResults.Ok(deliveries);
    }

    private static async Task<Results<Ok<DeliveryDetailsDto>, NotFound, BadRequest<string>>> UpdateDelivery(Guid id, DeliveryUpdateDto deliveryRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var delivery = await dbContext.Deliveries
            .Include(d => d.Order!.OrderProducts!)
                .ThenInclude(o => o!.Product!.Manufacturer)
            .Include(d => d.Order!.Customer)
            .Include(d => d.Order!.Seller)
            .Include(d => d.Order!.Invoice!.Company)
            .Include(d => d.Carrier)
            .FirstOrDefaultAsync(d => d.Id == id);
        if (delivery == null) return TypedResults.NotFound();

        var currentStatus = delivery.Status;
        mapper.Map(deliveryRequest, delivery);

        var (isValid, validationErrors) = delivery.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        var isTransitionValid = (currentStatus, delivery.Status) switch
        {
            (DeliveryStatus.InProgress, DeliveryStatus.Completed) => true,
            (DeliveryStatus.PendingPayment, DeliveryStatus.Cancelled) => true,
            _ => false
        };

        if (!isTransitionValid)
        {
            return TypedResults.BadRequest($"Invalid status transition from {currentStatus} to {delivery.Status}.");
        }

        delivery.Order?.UpdateStatus();
        dbContext.Deliveries.Update(delivery);
        await dbContext.SaveChangesAsync();

        var deliveryDto = mapper.Map<DeliveryDetailsDto>(delivery);

        return TypedResults.Ok(deliveryDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteDelivery(Guid id, Data.MasDbContext dbContext)
    {
        var delivery = await dbContext.Deliveries.FindAsync(id);
        if (delivery == null) return TypedResults.NotFound();

        dbContext.Deliveries.Remove(delivery);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}