namespace MasApi.Models.Dtos;

public class CarrierCreateDto
{
    public required string Name { get; set; }
}

public class CarrierListDto
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
}
