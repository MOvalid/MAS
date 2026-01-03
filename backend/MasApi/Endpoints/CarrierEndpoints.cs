using MasApi.Models.Dtos;
using MasApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

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

    private static async Task<Results<Created<CarrierListDto>, BadRequest<string>>> CreateCarrier(CarrierCreateDto carrierRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var carrier = mapper.Map<Carrier>(carrierRequest);

        var (isValid, validationErrors) = carrier.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Carriers.Add(carrier);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/carriers/{carrier.Id}", mapper.Map<CarrierListDto>(carrier));
    }

    private static async Task<Results<Ok<CarrierListDto>, NotFound>> GetCarrier(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var carrier = await dbContext.Carriers.FindAsync(id);
        if (carrier == null) return TypedResults.NotFound();

        return TypedResults.Ok(mapper.Map<CarrierListDto>(carrier));
    }

    private static async Task<Ok<List<CarrierListDto>>> GetCarriers(Data.MasDbContext dbContext, IMapper mapper)
    {
        var carriers = await dbContext.Carriers
            .Select(c => mapper
            .Map<CarrierListDto>(c)).ToListAsync();
        return TypedResults.Ok(carriers);
    }

    private static async Task<Results<Ok<CarrierListDto>, NotFound, BadRequest<string>>> UpdateCarrier(Guid id, CarrierCreateDto carrierRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var carrier = await dbContext.Carriers.FindAsync(id);
        if (carrier == null) return TypedResults.NotFound();

        mapper.Map(carrierRequest, carrier);

        var (isValid, validationErrors) = carrier.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Carriers.Update(carrier);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(mapper.Map<CarrierListDto>(carrier));
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