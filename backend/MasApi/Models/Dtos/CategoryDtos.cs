namespace MasApi.Models.Dtos;

public class CategoryCreateDto
{
    public required string Name { get; set; }
    public string? Description { get; set; }
}

public class CategoryListDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
}

public class CategoryDetailsDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }
    // TODO add Products DTOs list
}