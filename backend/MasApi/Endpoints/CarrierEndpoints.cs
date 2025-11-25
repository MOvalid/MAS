using MasApi.Models.Dtos;
using MasApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Endpoints;

public static class CarrierEndpoints
{
    public static WebApplication MapCarrierEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/carriers")
            .WithTags("Carriers")
            .RequireAuthorization();

        group.MapPost("/", CreateCarrier)
            .WithName("CreateCarrier");

        group.MapGet("/{id}", GetCarrier)
            .WithName("GetCarrier");

        group.MapGet("/", GetCarriers)
            .WithName("GetCarriers");

        group.MapPut("/{id}", UpdateCarrier)
            .WithName("UpdateCarrier");

        group.MapDelete("/{id}", DeleteCarrier)
            .WithName("DeleteCarrier");

        return app;
    }

    private static async Task<Results<Created<Carrier>, BadRequest<string>>> CreateCarrier(CarrierCreateDto carrierRequest, Data.MasDbContext dbContext)
    {
        var carrier = new Carrier
        {
            Id = Guid.NewGuid(),
            Name = carrierRequest.Name
        };

        dbContext.Carriers.Add(carrier);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/carriers/{carrier.Id}", carrier);
    }

    private static async Task<Results<Ok<Carrier>, NotFound>> GetCarrier(Guid id, Data.MasDbContext dbContext)
    {
        var carrier = await dbContext.Carriers.FindAsync(id);
        if (carrier == null) return TypedResults.NotFound();

        return TypedResults.Ok(carrier);
    }

    private static async Task<Ok<List<Carrier>>> GetCarriers(Data.MasDbContext dbContext)
    {
        var carriers = await dbContext.Carriers.ToListAsync();
        return TypedResults.Ok(carriers);
    }

    private static async Task<Results<Ok<Carrier>, NotFound>> UpdateCarrier(Guid id, CarrierCreateDto carrierRequest, Data.MasDbContext dbContext)
    {
        var carrier = await dbContext.Carriers.FindAsync(id);
        if (carrier == null) return TypedResults.NotFound();

        carrier.Name = carrierRequest.Name;

        dbContext.Carriers.Update(carrier);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(carrier);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteCarrier(Guid id, Data.MasDbContext dbContext)
    {
        var carrier = await dbContext.Carriers.FindAsync(id);
        var deliveriesExist = await dbContext.Deliveries.AnyAsync(d => d.CarrierId == id);

        if (carrier == null) return TypedResults.NotFound();
        if (deliveriesExist) return TypedResults.BadRequest("Cannot delete carrier with existing deliveries.");

        dbContext.Carriers.Remove(carrier);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}