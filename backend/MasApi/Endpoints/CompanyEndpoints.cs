using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class CompanyEndpoints
{
    public static WebApplication MapCompanyEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/companies")
            .WithTags("Companies")
            .RequireAuthorization();

        group.MapPost("/", CreateCompany)
            .WithName("CreateCompany");

        group.MapGet("/{id}", GetCompany)
            .WithName("GetCompany");

        group.MapGet("/", GetCompanies)
            .WithName("GetCompanies");

        group.MapPut("/{id}", UpdateCompany)
            .WithName("UpdateCompany");

        group.MapDelete("/{id}", DeleteCompany)
            .WithName("DeleteCompany");

        return app;
    }

    private static async Task<Results<Created<CompanyDetailsDto>, BadRequest<string>>> CreateCompany(CompanyCreateDto companyRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var company = mapper.Map<Company>(companyRequest);

        var (isValid, validationErrors) = company.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/companies/{company.Id}", mapper.Map<CompanyDetailsDto>(company));
    }

    private static async Task<Results<Ok<CompanyDetailsDto>, NotFound>> GetCompany(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var company = await dbContext.Companies
            .Include(c => c.Invoices!)
                .ThenInclude(i => i.Order!.OrderProducts)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (company == null) return TypedResults.NotFound();

        var companyDto = mapper.Map<CompanyDetailsDto>(company);

        return TypedResults.Ok(companyDto);
    }

    private static async Task<Results<Ok<PagedResults<CompanyListDto>>, NotFound>> GetCompanies(string? search, string? sorting, int? page, int? limit, Data.MasDbContext dbContext, IMapper mapper)
    {
        IQueryable<Company> companiesQuery = dbContext.Companies;

        if (!string.IsNullOrEmpty(search))
        {
            companiesQuery = companiesQuery.Where(c => c.Name.ToLower().Contains(search.ToLower()));
        }

        var sortingTokens = sorting?.Split('_');
        var sortingOrder = sortingTokens?.Length == 2 ? sortingTokens[1].ToLower() : null;

        if (sortingOrder != null && sortingOrder.Contains("desc", StringComparison.CurrentCultureIgnoreCase))
        {
            companiesQuery = companiesQuery.OrderByDescending(c => c.Name);
        }
        else
        {
            companiesQuery = companiesQuery.OrderBy(c => c.Name);
        }

        limit ??= 10;
        int totalCount = await companiesQuery.CountAsync();
        var companies = await companiesQuery
            .Skip(((page ?? 1) - 1) * limit.Value)
            .Take(limit.Value)
            .Select(c => mapper.Map<CompanyListDto>(c))
            .ToListAsync();

        return TypedResults.Ok(new PagedResults<CompanyListDto>
        {
            Items = companies,
            TotalCount = totalCount,
            Page = page ?? 1,
            Limit = limit.Value
        });
    }

    private static async Task<Results<Ok<CompanyDetailsDto>, NotFound, BadRequest<string>>> UpdateCompany(Guid id, CompanyCreateDto companyRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var company = await dbContext.Companies
            .Include(c => c.Invoices!)
                .ThenInclude(i => i.Order!.OrderProducts)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (company == null) return TypedResults.NotFound();

        mapper.Map(companyRequest, company);

        var (isValid, validationErrors) = company.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Companies.Update(company);
        await dbContext.SaveChangesAsync();

        var companyDto = mapper.Map<CompanyDetailsDto>(company);

        return TypedResults.Ok(companyDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteCompany(Guid id, Data.MasDbContext dbContext)
    {
        var company = await dbContext.Companies
            .Include(c => c.Invoices)
            .FirstOrDefaultAsync(c => c.Id == id);

        var productsCount = await dbContext.Products
            .Where(p => p.ManufacturerId == id)
            .CountAsync();

        if (company == null) return TypedResults.NotFound();
        if (company.Invoices != null && company.Invoices.Count != 0) return TypedResults.BadRequest("Cannot delete a company with existing invoices.");
        if (productsCount > 0) return TypedResults.BadRequest("Cannot delete a company that is a manufacturer of existing products.");

        dbContext.Companies.Remove(company);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}