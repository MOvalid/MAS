namespace MasApi.Models.Dtos;

public record SellerCreateDto(string FirstName, string LastName);
public record SellerListDto(Guid Id, string FirstName, string LastName, string Email);
public record SellerDetailsDto(Guid Id, string FirstName, string LastName, string Email); // TODO add OrderListDto when implemented