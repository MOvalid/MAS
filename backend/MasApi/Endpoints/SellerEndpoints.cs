using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class SellerEndpoints
{
    public static WebApplication MapSellerEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/sellers")
            .WithTags("Sellers")
            .RequireAuthorization();

        group.MapPost("/", CreateSeller)
            .WithName("CreateSeller");

        group.MapGet("/{id}", GetSeller)
            .WithName("GetSeller");

        group.MapGet("/", GetSellers)
            .WithName("GetSellers");

        group.MapPut("/{id}", UpdateSeller)
            .WithName("UpdateSeller");

        group.MapDelete("/{id}", DeleteSeller)
            .WithName("DeleteSeller");

        return app;
    }

    private static async Task<Results<Created<SellerDetailsDto>, BadRequest<string>>> CreateSeller(SellerCreateDto sellerRequest, Data.MasDbContext dbContext, HttpContext httpContext, IMapper mapper)
    {
        var sub = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        var email = httpContext.User.FindFirstValue(ClaimTypes.Email);

        if (!Guid.TryParse(sub, out Guid userId)) return TypedResults.BadRequest("Invalid user ID.");
        if (email == null) return TypedResults.BadRequest("Email claim is missing.");

        var existingSeller = await dbContext.Sellers.FindAsync(userId);
        if (existingSeller != null) return TypedResults.BadRequest("Seller already exists.");

        var seller = new Seller
        {
            Id = userId,
            FirstName = sellerRequest.FirstName,
            LastName = sellerRequest.LastName,
            Email = email
        };

        dbContext.Sellers.Add(seller);
        await dbContext.SaveChangesAsync();

        var sellerDto = mapper.Map<SellerDetailsDto>(seller);

        return TypedResults.Created($"/sellers/{seller.Id}", sellerDto);
    }

    private static async Task<Results<Ok<SellerDetailsDto>, NotFound>> GetSeller(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var seller = await dbContext.Sellers
            .Include(s => s.Orders!)
                .ThenInclude(o => o.OrderProducts)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (seller == null) return TypedResults.NotFound();

        var sellerDto = mapper.Map<SellerDetailsDto>(seller);

        return TypedResults.Ok(sellerDto);
    }

    private static async Task<Results<Ok<List<SellerListDto>>, NotFound>> GetSellers(Data.MasDbContext dbContext, IMapper mapper)
    {
        var sellers = await dbContext.Sellers
            .Select(s => mapper.Map<SellerListDto>(s))
            .ToListAsync();

        return TypedResults.Ok(sellers);
    }

    private static async Task<Results<Ok<SellerDetailsDto>, NotFound>> UpdateSeller(Guid id, SellerCreateDto sellerRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var seller = await dbContext.Sellers
            .Include(s => s.Orders!)
                .ThenInclude(o => o.OrderProducts)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (seller == null) return TypedResults.NotFound();

        mapper.Map(sellerRequest, seller);

        dbContext.Sellers.Update(seller);
        await dbContext.SaveChangesAsync();

        var sellerDto = mapper.Map<SellerDetailsDto>(seller);

        return TypedResults.Ok(sellerDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteSeller(Guid id, Data.MasDbContext dbContext)
    {
        var seller = await dbContext.Sellers.Include(s => s.Orders).FirstOrDefaultAsync(s => s.Id == id);
        if (seller == null) return TypedResults.NotFound();
        if (seller.Orders != null && seller.Orders.Count != 0)
            return TypedResults.BadRequest("Cannot delete seller with existing orders.");

        dbContext.Sellers.Remove(seller);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}