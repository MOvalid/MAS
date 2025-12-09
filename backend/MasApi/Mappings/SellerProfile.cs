using AutoMapper;

namespace MasApi.Mappings;

public class SellerProfile : Profile
{
    public SellerProfile()
    {
        CreateMap<Models.Dtos.SellerCreateDto, Models.Seller>().ReverseMap();
        CreateMap<Models.Dtos.SellerDetailsDto, Models.Seller>().ReverseMap();
        CreateMap<Models.Dtos.SellerListDto, Models.Seller>().ReverseMap();
    }
}