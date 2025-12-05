using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Claims;
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
        var order = await dbContext.Orders.FindAsync(deliveryRequest.OrderId);
        if (order == null) return TypedResults.BadRequest("Order does not exist.");

        var existingDelivery = await dbContext.Deliveries.FirstOrDefaultAsync(d => d.OrderId == deliveryRequest.OrderId);
        if (existingDelivery != null) return TypedResults.BadRequest("Delivery for this order already exists.");

        var delivery = mapper.Map<Delivery>(deliveryRequest);

        dbContext.Deliveries.Add(delivery);
        await dbContext.SaveChangesAsync();

        var deliveryDto = mapper.Map<DeliveryDetailsDto>(delivery);

        return TypedResults.Created($"/deliveries/{delivery.Id}", deliveryDto);
    }

    private static async Task<Results<Ok<DeliveryDetailsDto>, NotFound>> GetDelivery(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var delivery = await dbContext.Deliveries
            .Include(d => d.Order)
                .ThenInclude(o => o!.OrderProducts)
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

    private static async Task<Results<Ok<DeliveryDetailsDto>, NotFound>> UpdateDelivery(Guid id, DeliveryCreateDto deliveryRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var delivery = await dbContext.Deliveries
            .Include(d => d.Order)
                .ThenInclude(o => o!.OrderProducts)
            .Include(d => d.Carrier)
            .FirstOrDefaultAsync(d => d.Id == id);
        if (delivery == null) return TypedResults.NotFound();

        mapper.Map(deliveryRequest, delivery);

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