using MasApi.Models;
using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using System.Linq.Expressions;
using MasApi.Models.Enums;

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
        order.Status = Models.Enums.OrderStatus.PendingPayment;

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

        order = await dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Seller)
            .Include(o => o.OrderProducts!)
                .ThenInclude(op => op.Product)
                .ThenInclude(p => p!.Manufacturer)
            .Include(o => o.Payments)
            .Include(o => o.Invoice!.Company)
            .Include(o => o.Delivery)
            .FirstAsync(o => o.Id == order.Id);

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

    private static async Task<Results<Ok<PagedResults<OrderListDto>>, NotFound>> GetOrders(string? search, string? sorting, int? page, int? limit, string? status, Guid? sellerId, string? dateFrom, string? dateTo, Data.MasDbContext dbContext, IMapper mapper)
    {
        IQueryable<Order> ordersQuery = dbContext.Orders;

        if (!string.IsNullOrEmpty(search))
        {
            ordersQuery = ordersQuery
            .Where(
                o => o.Customer!.LastName.ToLower().Contains(search.ToLower())
                || o.Invoice!.InvoiceNumber.ToLower().Contains(search.ToLower())
            );
        }

        if (!string.IsNullOrEmpty(status))
        {
            ordersQuery = ordersQuery.Where(o => o.Status.ToString().ToLower().Equals(status.ToLower()));
        }

        if (DateTime.TryParse(dateFrom, out var parsedDateFrom))
        {
            ordersQuery = ordersQuery.Where(o => o.CreatedAt.Date >= parsedDateFrom.Date);
        }
        if (DateTime.TryParse(dateTo, out var parsedDateTo))
        {
            ordersQuery = ordersQuery.Where(o => o.CreatedAt.Date <= parsedDateTo.Date);
        }

        if (sellerId != null)
        {
            ordersQuery = ordersQuery.Where(o => o.SellerId == sellerId);
        }

        var sortingTokens = sorting?.Split('_');
        var sortingField = sortingTokens?.Length > 0 ? sortingTokens[0] : string.Empty;
        var sortingOrder = sortingTokens?.Length > 1 ? sortingTokens[1] : null;

        if (sortingOrder != null && sortingOrder.Contains("desc", StringComparison.CurrentCultureIgnoreCase))
        {
            ordersQuery = ordersQuery.OrderByDescending(GetSortingFieldSelector(sortingField));
        }
        else
        {
            ordersQuery = ordersQuery.OrderBy(GetSortingFieldSelector(sortingField));
        }

        limit ??= 10;
        int totalCount = await ordersQuery.CountAsync();
        var orders = await ordersQuery
            .Skip(((page ?? 1) - 1) * limit.Value)
            .Take(limit.Value)
            .Include(o => o.OrderProducts)
            .Include(o => o.Customer)
            .Include(o => o.Seller)
            .Include(o => o.Delivery)
            .Include(o => o.Invoice)
                .ThenInclude(o => o!.Company)
            .Select(order => mapper.Map<OrderListDto>(order))
            .ToListAsync();

        return TypedResults.Ok(new PagedResults<OrderListDto>
        {
            Items = orders,
            TotalCount = totalCount,
            Page = page ?? 1,
            Limit = limit.Value
        });
    }

    private static async Task<Results<Ok<OrderDetailsDto>, NotFound, BadRequest<string>>> UpdateOrder(Guid id, OrderUpdateDto orderRequest, Data.MasDbContext dbContext, IMapper mapper)
    {
        var order = await dbContext.Orders
            .Include(o => o.Customer)
            .Include(o => o.Seller)
            .Include(o => o.OrderProducts!)
                .ThenInclude(op => op.Product!.Manufacturer)
            .Include(o => o.Payments)
            .Include(o => o.Invoice!.Company)
            .Include(o => o.Delivery)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return TypedResults.NotFound();

        if (!Enum.TryParse<OrderStatus>(orderRequest.Status, true, out var newStatus))
        {
            return TypedResults.BadRequest($"Invalid order status: {orderRequest.Status}.");
        }

        var isTransitionValid = (order.Status, newStatus) switch
        {
            (OrderStatus.PendingPayment, OrderStatus.Cancelled) => true,
            (OrderStatus.Delivered, OrderStatus.Returned) => true,
            (OrderStatus.Paid, OrderStatus.Cancelled) => true,
            _ => false
        };

        if (!isTransitionValid)
        {
            return TypedResults.BadRequest($"Invalid status transition from {order.Status} to {newStatus}.");
        }

        order.UpdateStatus(newStatus);
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

    private static Expression<Func<Order, object>> GetSortingFieldSelector(string? sortingField)
    {
        if (!Enum.TryParse<OrderSortingField>(sortingField, true, out var parsedField))
        {
            return order => order.CreatedAt;
        }

        return parsedField switch
        {
            OrderSortingField.Client => order => order.Customer!.LastName,
            OrderSortingField.Created => order => order.CreatedAt,
            _ => order => order.CreatedAt
        };
    }

    private enum OrderSortingField
    {
        Client,
        Created
    }
}