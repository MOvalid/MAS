using MasApi.Models.Dtos;
using MasApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class CategoryEndpoints
{
    public static WebApplication MapCategoryEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/categories")
            .WithTags("Categories")
            .RequireAuthorization();

        group.MapPost("/", CreateCategory)
            .WithName("CreateCategory");

        group.MapGet("/{id}", GetCategory)
            .WithName("GetCategory");

        group.MapGet("/", GetCategories)
            .WithName("GetCategories");

        group.MapPut("/{id}", UpdateCategory)
            .WithName("UpdateCategory");

        group.MapDelete("/{id}", DeleteCategory)
            .WithName("DeleteCategory");

        return app;
    }

    public static async Task<Results<Created<CategoryDetailsDto>, BadRequest<string>>> CreateCategory(CategoryCreateDto categoryRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var category = mapper.Map<Category>(categoryRequest);

        var (isValid, validationErrors) = category.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/categories/{category.Id}", mapper.Map<CategoryDetailsDto>(category));
    }

    public static async Task<Results<Ok<CategoryDetailsDto>, NotFound>> GetCategory(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var category = await dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (category == null) return TypedResults.NotFound();

        var categoryDetails = mapper.Map<CategoryDetailsDto>(category);

        return TypedResults.Ok(categoryDetails);
    }

    public static async Task<Ok<List<CategoryListDto>>> GetCategories(Data.MasDbContext dbContext, IMapper mapper)
    {
        var categories = await dbContext.Categories
            .Select(c => mapper.Map<CategoryListDto>(c))
            .ToListAsync();

        return TypedResults.Ok(categories);
    }

    public static async Task<Results<Ok<CategoryDetailsDto>, NotFound, BadRequest<string>>> UpdateCategory(Guid id, CategoryCreateDto categoryRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var category = await dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return TypedResults.NotFound();

        mapper.Map(categoryRequest, category);

        var (isValid, validationErrors) = category.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Categories.Update(category);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(mapper.Map<CategoryDetailsDto>(category));
    }

    public static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteCategory(Guid id, Data.MasDbContext dbContext)
    {
        var category = await dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return TypedResults.NotFound();
        if (category.Products != null && category.Products.Count != 0) return TypedResults.BadRequest("Cannot delete category with associated products.");

        dbContext.Categories.Remove(category);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}