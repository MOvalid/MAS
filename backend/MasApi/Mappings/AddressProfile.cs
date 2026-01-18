using AutoMapper;

namespace MasApi.Mappings;

public class AddressProfile : Profile
{
    public AddressProfile()
    {
        CreateMap<Models.Dtos.AddressDto, Models.Address>().ReverseMap();
    }
}