using AutoMapper;

namespace MasApi.Mappings;

public class DeliveryProfile : Profile
{
    public DeliveryProfile()
    {
        CreateMap<Models.Dtos.DeliveryCreateDto, Models.Delivery>().ReverseMap();
        CreateMap<Models.Dtos.DeliveryUpdateDto, Models.Delivery>();
        CreateMap<Models.Dtos.DeliveryDetailsDto, Models.Delivery>().ReverseMap();
        CreateMap<Models.Dtos.DeliveryListDto, Models.Delivery>().ReverseMap();
    }
}