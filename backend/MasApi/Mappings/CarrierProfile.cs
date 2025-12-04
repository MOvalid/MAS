using AutoMapper;

namespace MasApi.Mappings;

public class CarrierProfile : Profile
{
    public CarrierProfile()
    {
        CreateMap<Models.Dtos.CarrierCreateDto, Models.Carrier>().ReverseMap();

        
    }
}