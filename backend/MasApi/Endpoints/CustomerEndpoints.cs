using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class CustomerEndpoints
{
    public static WebApplication MapCustomerEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/customers")
            .WithTags("Customers")
            .RequireAuthorization();

        group.MapPost("/", CreateCustomer)
            .WithName("CreateCustomer");

        group.MapGet("/{id}", GetCustomer)
            .WithName("GetCustomer");

        group.MapGet("/", GetCustomers)
            .WithName("GetCustomers");

        group.MapPut("/{id}", UpdateCustomer)
            .WithName("UpdateCustomer");

        group.MapDelete("/{id}", DeleteCustomer)
            .WithName("DeleteCustomer");

        return app;
    }

    private static async Task<Results<Created<CustomerDetailsDto>, BadRequest<string>>> CreateCustomer(CustomerCreateDto customerRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var customer = mapper.Map<Customer>(customerRequest);

        var (isValid, validationErrors) = customer.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Customers.Add(customer);
        await dbContext.SaveChangesAsync();

        var customerDetailsDto = mapper.Map<CustomerDetailsDto>(customer);

        return TypedResults.Created($"/customers/{customer.Id}", customerDetailsDto);
    }

    private static async Task<Results<Ok<CustomerDetailsDto>, NotFound>> GetCustomer(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var customer = await dbContext.Customers
            .Include(c => c.Orders!)
                .ThenInclude(o => o.OrderProducts)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (customer == null) return TypedResults.NotFound();

        var customerDetailsDto = mapper.Map<CustomerDetailsDto>(customer);

        return TypedResults.Ok(customerDetailsDto);
    }

    private static async Task<Results<Ok<List<CustomerListDto>>, NotFound>> GetCustomers(Data.MasDbContext dbContext, IMapper mapper)
    {
        var customers = await dbContext.Customers
            .Select(s => mapper.Map<CustomerListDto>(s))
            .ToListAsync();

        return TypedResults.Ok(customers);
    }

    private static async Task<Results<Ok<CustomerDetailsDto>, NotFound, BadRequest<string>>> UpdateCustomer(Guid id, CustomerCreateDto customerRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var customer = await dbContext.Customers
            .Include(c => c.Orders!)
                .ThenInclude(o => o.OrderProducts)
            .FirstOrDefaultAsync(c => c.Id == id);
        if (customer == null) return TypedResults.NotFound();

        mapper.Map(customerRequest, customer);

        var (isValid, validationErrors) = customer.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Customers.Update(customer);
        await dbContext.SaveChangesAsync();

        var customerDto = mapper.Map<CustomerDetailsDto>(customer);

        return TypedResults.Ok(customerDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteCustomer(Guid id, Data.MasDbContext dbContext)
    {
        var customer = await dbContext.Customers.Include(c => c.Orders).FirstOrDefaultAsync(c => c.Id == id);
        if (customer == null) return TypedResults.NotFound();
        if (customer.Orders != null && customer.Orders.Count != 0)
            return TypedResults.BadRequest("Cannot delete customer with existing orders.");

        dbContext.Customers.Remove(customer);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}