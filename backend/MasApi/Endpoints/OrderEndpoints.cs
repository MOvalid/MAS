using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace MasApi.Endpoints;

public static class OrderEndpoints
{
    public static WebApplication MapOrderEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/orders")
            .WithTags("Orders")
            .RequireAuthorization();

        group.MapPost("/", CreateOrder)
            .WithName("CreateOrder");

        group.MapGet("/{id}", GetOrder)
            .WithName("GetOrder");

        group.MapGet("/", GetOrders)
            .WithName("GetOrders");

        group.MapPut("/{id}", UpdateOrder)
            .WithName("UpdateOrder");

        group.MapDelete("/{id}", DeleteOrder)
            .WithName("DeleteOrder");

        return app;
    }

    private static async Task<Results<Created<OrderDetailsDto>, BadRequest<string>>> CreateOrder(OrderCreateDto orderRequest, Data.MasDbContext dbContext, IMapper mapper)
    {

        var seller = await dbContext.Sellers.FindAsync(orderRequest.SellerId);
        if (seller == null) return TypedResults.BadRequest("Seller does not exist.");

        var customer = await dbContext.Customers.FindAsync(orderRequest.CustomerId);
        if (customer == null) return TypedResults.BadRequest("Customer does not exist.");

        var order = mapper.Map<Order>(orderRequest);
        order.Status = Models.Enums.OrderStatus.Draft;

        using var transaction = await dbContext.Database.BeginTransactionAsync();

        try
        {
            order.CreatedAt = DateTime.UtcNow;
            foreach (var item in order.OrderProducts ?? Array.Empty<OrderItem>())
            {
                var product = await dbContext.Products.FindAsync(item.ProductId);
                if (product == null)
                {
                    await transaction.RollbackAsync();
                    return TypedResults.BadRequest($"Product with ID {item.ProductId} does not exist.");
                }
                if (product.StockQuantity < item.Quantity)
                {
                    await transaction.RollbackAsync();
                    return TypedResults.BadRequest($"Insufficient stock for product with ID {item.ProductId}.");
                }

                product.StockQuantity -= item.Quantity;
                item.UnitNetPrice = product.NetPrice;
                item.VatRate = product.VatRate;
                item.Currency = order.Currency;

                var (isItemValid, itemValidationErrors) = item.Validate();
                if (!isItemValid)
                {
                    await transaction.RollbackAsync();
                    var errorMessage = string.Join("; ", itemValidationErrors);
                    return TypedResults.BadRequest(errorMessage);
                }
            }

            var (isOrderValid, orderValidationErrors) = order.Validate();
            if (!isOrderValid)
            {
                var errorMessage = string.Join("; ", orderValidationErrors);
                return TypedResults.BadRequest(errorMessage);
            }

            dbContext.Orders.Add(order);
            await dbContext.SaveChangesAsync();

            await transaction.CommitAsync();
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }

        var orderDto = mapper.Map<OrderDetailsDto>(order);

        return TypedResults.Created($"/orders/{order.Id}", orderDto);
    }

    private static async Task<Results<Ok<OrderDetailsDto>, NotFound>> GetOrder(Guid id, Data.MasDbContext dbContext, IMapper mapper)
    {
        var order = await dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Seller)
            .Include(o => o.OrderProducts!)
                .ThenInclude(op => op.Product)
                .ThenInclude(p => p!.Manufacturer)
            .Include(o => o.Payments)
            .Include(o => o.Invoice)
            .Include(o => o.Delivery)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return TypedResults.NotFound();

        var orderDto = mapper.Map<OrderDetailsDto>(order);
        return TypedResults.Ok(orderDto);
    }

    private static async Task<Results<Ok<List<OrderListDto>>, NotFound>> GetOrders(Data.MasDbContext dbContext, IMapper mapper)
    {
        var orders = await dbContext.Orders
            .Include(o => o.OrderProducts)
            .Include(o => o.Customer)
            .Include(o => o.Seller)
            .Include(o => o.Delivery)
            .Include(o => o.Invoice)
                .ThenInclude(o => o!.Company)
            .Select(order => mapper.Map<OrderListDto>(order))
            .ToListAsync();

        return TypedResults.Ok(orders);
    }

    private static async Task<Results<Ok<OrderDetailsDto>, NotFound, BadRequest<string>>> UpdateOrder(Guid id, OrderUpdateDto orderRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var order = await dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Seller)
            .Include(o => o.OrderProducts!)
                .ThenInclude(op => op.Product)
            .Include(o => o.Payments)
            .Include(o => o.Invoice)
            .Include(o => o.Delivery)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return TypedResults.NotFound();

        mapper.Map(orderRequest, order);

        var (isValid, validationErrors) = order.Validate();
        if (!isValid)
        {
            var errorMessage = string.Join("; ", validationErrors);
            return TypedResults.BadRequest(errorMessage);
        }

        dbContext.Orders.Update(order);
        await dbContext.SaveChangesAsync();

        var orderDto = mapper.Map<OrderDetailsDto>(order);

        return TypedResults.Ok(orderDto);
    }

    private static async Task<Results<NoContent, NotFound, BadRequest<string>>> DeleteOrder(Guid id, Data.MasDbContext dbContext)
    {
        var order = await dbContext.Orders.FindAsync(id);
        if (order == null) return TypedResults.NotFound();

        dbContext.Orders.Remove(order);
        await dbContext.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}