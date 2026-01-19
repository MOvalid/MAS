using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq.Expressions;

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

        product.LastRestockedAt = DateTime.UtcNow;

        var (isValid, validationResults) = product.Validate();
        if (!isValid)
        {
            var errors = string.Join("; ", validationResults.Select(vr => vr.ErrorMessage));
            return TypedResults.BadRequest($"Product data is invalid: {errors}");
        }

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

    private static async Task<Results<Ok<PagedResults<ProductListDto>>, NotFound>> GetProducts(string? search, string? sorting, int? page, int? limit, Guid? categoryId, Data.MasDbContext dbContext, IMapper mapper)
    {
        IQueryable<Product> productsQuery = dbContext.Products;

        if (!string.IsNullOrEmpty(search))
        {
            productsQuery = productsQuery.Where(p => p.Name.ToLower().Contains(search.ToLower()));
        }

        if (categoryId != null)
        {
            productsQuery = productsQuery.Where(p => p.CategoryId == categoryId);
        }

        var parts = sorting?.Split('_');
        var sortingField = parts?.Length > 0 ? parts[0] : string.Empty;
        var sortingOrder = parts?.Length > 1 ? parts[1] : null;

        if (sortingOrder != null && sortingOrder.Contains("desc", StringComparison.CurrentCultureIgnoreCase))
        {
            productsQuery = productsQuery.OrderByDescending(GetSortingFieldSelector(sortingField));
        }
        else
        {
            productsQuery = productsQuery.OrderBy(GetSortingFieldSelector(sortingField));
        }

        limit ??= 10;
        int totalCount = await productsQuery.CountAsync();
        var products = await productsQuery
            .Skip(((page ?? 1) - 1) * limit.Value)
            .Take(limit.Value)
            .Include(p => p.Manufacturer)
            .Include(p => p.Category)
            .Select(p => mapper.Map<ProductListDto>(p))
            .ToListAsync();

        return TypedResults.Ok(new PagedResults<ProductListDto>
        {
            Items = products,
            TotalCount = totalCount,
            Page = page ?? 1,
            Limit = limit.Value
        });
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

        if (productRequest.ManufacturerId != product.ManufacturerId)
        {
            var manufacturer = await dbContext.Companies.FindAsync(productRequest.ManufacturerId);
            if (manufacturer == null) return TypedResults.BadRequest("Manufacturer does not exist.");
        }

        if (productRequest.StockQuantity > product.StockQuantity)
        {
            product.LastRestockedAt = DateTime.UtcNow;
        }

        mapper.Map(productRequest, product);

        var (isValid, validationResults) = product.Validate();
        if (!isValid)
        {
            var errors = string.Join("; ", validationResults.Select(vr => vr.ErrorMessage));
            return TypedResults.BadRequest($"Product data is invalid: {errors}");
        }

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

    private static Expression<Func<Product, object>> GetSortingFieldSelector(string sortingField)
    {
        Enum.TryParse<ProductSortingField>(sortingField, true, out var parsedField);

        return parsedField switch
        {
            ProductSortingField.Name => product => product.Name,
            ProductSortingField.Stock => product => product.StockQuantity,
            ProductSortingField.Price => product => product.NetPrice * (1 + product.VatRate),
            ProductSortingField.Manufacturer => product => product.Manufacturer!.Name,
            _ => product => product.Name
        };
    }

    private enum ProductSortingField
    {
        Name,
        Manufacturer,
        Price,
        Stock
    }
}