namespace MasApi.Models.Dtos;

public class DaySummaryStatisticsDto
{
    public DateTime Date { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalInvoicesIssued { get; set; }
    public int TotalProductsSold { get; set; }
    public decimal AverageOrderValue { get; set; }
    public int AverageProductsPerOrder { get; set; }
}