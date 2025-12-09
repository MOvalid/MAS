using AutoMapper;

namespace MasApi.Mappings;

public class CustomerProfile : Profile
{
    public CustomerProfile()
    {
        CreateMap<Models.Dtos.CustomerCreateDto, Models.Customer>().ReverseMap();
        CreateMap<Models.Dtos.CustomerDetailsDto, Models.Customer>().ReverseMap();
        CreateMap<Models.Dtos.CustomerListDto, Models.Customer>().ReverseMap();
    }
}