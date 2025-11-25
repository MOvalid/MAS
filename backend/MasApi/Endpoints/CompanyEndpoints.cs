using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

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

    private static async Task<Results<Created<Company>, BadRequest<string>>> CreateCompany(CompanyCreateDto companyRequest, Data.MasDbContext dbContext)
    {
        var company = new Company
        {
            Id = Guid.NewGuid(),
            Name = companyRequest.Name,
            Description = companyRequest.Description,
            Street = companyRequest.Street,
            HouseNumber = companyRequest.HouseNumber,
            City = companyRequest.City,
            PostalCode = companyRequest.PostalCode,
            Country = companyRequest.Country,
            TaxId = companyRequest.TaxId,
            Email = companyRequest.Email,
            PhoneNumber = companyRequest.PhoneNumber
        };

        dbContext.Companies.Add(company);
        await dbContext.SaveChangesAsync();

        return TypedResults.Created($"/companies/{company.Id}", company);
    }

    private static async Task<Results<Ok<CompanyDetailsDto>, NotFound>> GetCompany(Guid id, Data.MasDbContext dbContext)
    {
        var company = await dbContext.Companies.FindAsync(id);
        if (company == null) return TypedResults.NotFound();

        var companyDto = new CompanyDetailsDto
        {
            Id = company.Id,
            Name = company.Name,
            Description = company.Description,
            Street = company.Street,
            HouseNumber = company.HouseNumber,
            City = company.City,
            PostalCode = company.PostalCode,
            Country = company.Country,
            TaxId = company.TaxId,
            Email = company.Email,
            PhoneNumber = company.PhoneNumber
        };

        return TypedResults.Ok(companyDto);
    }

    private static async Task<Results<Ok<List<CompanyListDto>>, NotFound>> GetCompanies(Data.MasDbContext dbContext)
    {
        var companyDtos = await dbContext.Companies
        .Select(company => new CompanyListDto
        {
            Id = company.Id,
            Name = company.Name,
            Description = company.Description,
            Street = company.Street,
            HouseNumber = company.HouseNumber,
            City = company.City,
            PostalCode = company.PostalCode,
            Country = company.Country,
            TaxId = company.TaxId,
            Email = company.Email,
            PhoneNumber = company.PhoneNumber
        })
        .ToListAsync();

        return TypedResults.Ok(companyDtos);
    }

    private static async Task<Results<Ok<CompanyListDto>, NotFound>> UpdateCompany(Guid id, CompanyCreateDto companyRequest, Data.MasDbContext dbContext)
    {
        var company = await dbContext.Companies.FindAsync(id);
        if (company == null) return TypedResults.NotFound();

        company.Name = companyRequest.Name;
        company.Description = companyRequest.Description;
        company.Street = companyRequest.Street;
        company.HouseNumber = companyRequest.HouseNumber;
        company.City = companyRequest.City;
        company.PostalCode = companyRequest.PostalCode;
        company.Country = companyRequest.Country;
        company.TaxId = companyRequest.TaxId;
        company.Email = companyRequest.Email;
        company.PhoneNumber = companyRequest.PhoneNumber;

        dbContext.Companies.Update(company);
        await dbContext.SaveChangesAsync();

        var companyDto = new CompanyListDto
        {
            Id = company.Id,
            Name = company.Name,
            Description = company.Description,
            Street = company.Street,
            HouseNumber = company.HouseNumber,
            City = company.City,
            PostalCode = company.PostalCode,
            Country = company.Country,
            TaxId = company.TaxId,
            Email = company.Email,
            PhoneNumber = company.PhoneNumber
        };

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