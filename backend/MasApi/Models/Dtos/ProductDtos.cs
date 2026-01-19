namespace MasApi.Models.Dtos;

public class ProductCreateDto
{

    public required string Name { get; set; }
    public required string Sku { get; set; }
    public required Guid ManufacturerId { get; set; }
    public required decimal NetPrice { get; set; }
    public required int VatRate { get; set; }
    public required int StockQuantity { get; set; }
    public required DimensionsDto Dimensions { get; set; }
    public string? Description { get; set; }
    public Guid? CategoryId { get; set; }
}

public class ProductDetailsDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Sku { get; set; }
    public required CompanyListDto Manufacturer { get; set; }
    public required decimal NetPrice { get; set; }
    public required int VatRate { get; set; }
    public required int StockQuantity { get; set; }
    public required string StockLevel { get; set; }
    public string? Description { get; set; }
    public required DimensionsDto Dimensions { get; set; }
    public DateTime? LastRestockedAt { get; set; }
    public CategoryListDto? Category { get; set; }
}

public class ProductListDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Sku { get; set; }
    public required CompanyListDto Manufacturer { get; set; }
    public required decimal NetPrice { get; set; }
    public required int VatRate { get; set; }
    public required int StockQuantity { get; set; }
    public required string StockLevel { get; set; }
    public DateTime? LastRestockedAt { get; set; }
    public Guid? CategoryId { get; set; }
}

public class DimensionsDto
{
    public required decimal Length { get; set; }
    public required decimal Width { get; set; }
    public required decimal Height { get; set; }
}