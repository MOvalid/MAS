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

    private static async Task<Results<Created<Company>, BadRequest<string>>> CreateCompany(CompanyCreateDto companyRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var company = mapper.Map<Company>(companyRequest);

        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/companies/{company.Id}", company);
    }

    private static async Task<Results<Ok<CompanyDetailsDto>, NotFound>> GetCompany(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var company = await dbContext.Companies.FindAsync(id);
        if (company == null) return TypedResults.NotFound();

        var companyDto = mapper.Map<CompanyDetailsDto>(company);

        return TypedResults.Ok(companyDto);
    }

    private static async Task<Results<Ok<List<CompanyListDto>>, NotFound>> GetCompanies(Data.MasDbContext dbContext, IMapper mapper)
    {
        var companyDtos = await dbContext.Companies
        .Select(company => mapper.Map<CompanyListDto>(company))
        .ToListAsync();

        return TypedResults.Ok(companyDtos);
    }

    private static async Task<Results<Ok<CompanyListDto>, NotFound>> UpdateCompany(Guid id, CompanyCreateDto companyRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var company = await dbContext.Companies.FindAsync(id);
        if (company == null) return TypedResults.NotFound();

        mapper.Map(companyRequest, company);

        dbContext.Companies.Update(company);
        await dbContext.SaveChangesAsync();

        var companyDto = mapper.Map<CompanyListDto>(company);

        return TypedResults.Ok(companyDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteCompany(Guid id, Data.MasDbContext dbContext)
    {
        var company = await dbContext.Companies
            .Include(c => c.Invoices)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (company == null) return TypedResults.NotFound();
        if (company.Invoices != null && company.Invoices.Count != 0) return TypedResults.BadRequest("Cannot delete a company with existing invoices.");

        dbContext.Companies.Remove(company);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}