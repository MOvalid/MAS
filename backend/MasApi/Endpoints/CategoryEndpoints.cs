using MasApi.Models.Dtos;
using MasApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

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

    public static async Task<Results<Created<Category>, BadRequest<string>>> CreateCategory(CategoryCreateDto categoryRequest, Data.MasDbContext dbContext)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = categoryRequest.Name,
            Description = categoryRequest.Description
        };

        dbContext.Categories.Add(category);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/categories/{category.Id}", category);
    }

    public static async Task<Results<Ok<CategoryDetailsDto>, NotFound>> GetCategory(Guid id, Data.MasDbContext dbContext)
    {
        var category = await dbContext.Categories.FindAsync(id);
        if (category == null) return TypedResults.NotFound();

        var categoryDetails = new CategoryDetailsDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description
        };

        return TypedResults.Ok(categoryDetails);
    }

    public static async Task<Ok<List<CategoryListDto>>> GetCategories(Data.MasDbContext dbContext)
    {
        var categories = await dbContext.Categories
            .Select(c => new CategoryListDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            })
            .ToListAsync();

        return TypedResults.Ok(categories);
    }

    public static async Task<Results<Ok<Category>, NotFound>> UpdateCategory(Guid id, CategoryCreateDto categoryRequest, Data.MasDbContext dbContext)
    {
        var category = await dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
            
        if (category == null) return TypedResults.NotFound();

        category.Name = categoryRequest.Name;
        category.Description = categoryRequest.Description;

        dbContext.Categories.Update(category);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(category);
    }

    public static async Task<Results<Ok<Category>, NotFound, BadRequest<string>>> DeleteCategory(Guid id, Data.MasDbContext dbContext)
    {
        var category = await dbContext.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null) return TypedResults.NotFound();
        if (category.Products != null && category.Products.Count != 0) return TypedResults.BadRequest("Cannot delete category with associated products.");

        dbContext.Categories.Remove(category);
        await dbContext.SaveChangesAsync();

        return TypedResults.Ok(category);
    }
}