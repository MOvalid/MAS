using MasApi.Models.Dtos;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace MasApi.Endpoints;

public static class StatisticsEndpoints
{
    public static WebApplication MapStatisticsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/statistics")
            .WithTags("Statistics")
            .RequireAuthorization();

        group.MapGet("/daySummary", GetDaySummaryStatistics)
            .WithName("GetDaySummaryStatistics");


        return app;
    }

    private static async Task<Results<Ok<DaySummaryStatisticsDto>, BadRequest<string>>> GetDaySummaryStatistics(DateTime date, Data.MasDbContext dbContext)
    {
        if (date == default)
        {
            return TypedResults.BadRequest("Date parameter is required.");
        }

        if (date.Date > DateTime.UtcNow.Date)
        {
            return TypedResults.BadRequest("Date cannot be in the future.");
        }

        var orders = await dbContext.Orders
            .Where(o => o.CreatedAt.Date == date.Date)
            .Include(o => o.OrderProducts)
            .ToListAsync();

        var invoiceCount = await dbContext.Invoices
            .CountAsync(i => i.IssuedAt.Date == date.Date);

        var statisticsDto = new DaySummaryStatisticsDto
        {
            Date = date,
            TotalOrders = orders.Count,
            TotalRevenue = orders.Sum(o => o.TotalGrossPrice),
            TotalInvoicesIssued = invoiceCount,
            TotalProductsSold = orders.Sum(o => o.OrderProducts!.Sum(op => op.Quantity)),
            AverageOrderValue = orders.Count > 0 ? orders.Average(o => o.TotalGrossPrice) : 0,
            AverageProductsPerOrder = orders.Count > 0 ? (int)orders.Average(o => o.OrderProducts!.Sum(op => op.Quantity)) : 0
        };

        return TypedResults.Ok(statisticsDto);
    }
}