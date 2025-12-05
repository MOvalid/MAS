namespace MasApi.Models.Dtos;

public class SellerCreateDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

public class SellerListDto
{
    public required Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
}
    
public class SellerDetailsDto
{
    public required Guid Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
    public ICollection<OrderListDto>? Orders { get; set; }
} 