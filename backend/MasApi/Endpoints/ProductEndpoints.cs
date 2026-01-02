using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class ProductEndpoints
{
    public static WebApplication MapProductEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/products")
            .WithTags("Products")
            .RequireAuthorization();

        group.MapPost("/", CreateProduct)
            .WithName("CreateProduct");

        group.MapGet("/{id}", GetProduct)
            .WithName("GetProduct");

        group.MapGet("/", GetProducts)
            .WithName("GetProducts");

        group.MapPut("/{id}", UpdateProduct)
            .WithName("UpdateProduct");

        group.MapDelete("/{id}", DeleteProduct)
            .WithName("DeleteProduct");

        return app;
    }

    private static async Task<Results<Created<ProductDetailsDto>, BadRequest<string>>> CreateProduct(ProductCreateDto productRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        if (productRequest.CategoryId != null)
        {
            var category = await dbContext.Categories.FindAsync(productRequest.CategoryId);
            if (category == null) return TypedResults.BadRequest("Category does not exist.");
        }

        var product = mapper.Map<Product>(productRequest);

        dbContext.Products.Add(product);
        await dbContext.SaveChangesAsync();

        var productDto = mapper.Map<ProductDetailsDto>(product);

        return TypedResults.Created($"/products/{product.Id}", productDto);
    }

    private static async Task<Results<Ok<ProductDetailsDto>, NotFound>> GetProduct(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var product = await dbContext.Products
            .Include(p => p.Category)
            .Include(p => p.Manufacturer)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return TypedResults.NotFound();

        var productDto = mapper.Map<ProductDetailsDto>(product);

        return TypedResults.Ok(productDto);
    }

    private static async Task<Results<Ok<List<ProductListDto>>, NotFound>> GetProducts(Data.MasDbContext dbContext, IMapper mapper)
    {
        var products = await dbContext.Products
            .Include(p => p.Manufacturer)
            .Select(product => mapper.Map<ProductListDto>(product))
            .ToListAsync();

        return TypedResults.Ok(products);
    }

    private static async Task<Results<Ok<ProductDetailsDto>, NotFound, BadRequest<string>>> UpdateProduct(Guid id, ProductCreateDto productRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var product = await dbContext.Products.FindAsync(id);
        if (product == null) return TypedResults.NotFound();

        if (productRequest.CategoryId != null)
        {
            var category = await dbContext.Categories.FindAsync(productRequest.CategoryId);
            if (category == null) return TypedResults.BadRequest("Category does not exist.");
        }

        mapper.Map(productRequest, product);

        dbContext.Products.Update(product);
        await dbContext.SaveChangesAsync();

        var productDto = mapper.Map<ProductDetailsDto>(product);

        return TypedResults.Ok(productDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteProduct(Guid id, Data.MasDbContext dbContext)
    {
        var product = await dbContext.Products.FindAsync(id);
        if (product == null) return TypedResults.NotFound();

        if (await dbContext.OrderItems.AnyAsync(items => items.ProductId == product.Id))
        {
            return TypedResults.BadRequest("Cannot delete product associated with existing order items.");
        }

        dbContext.Products.Remove(product);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}