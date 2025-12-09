using AutoMapper;

namespace MasApi.Mappings;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        DestinationMemberNamingConvention = new ExactMatchNamingConvention();

        CreateMap<Models.Dtos.OrderCreateDto, Models.Order>().ReverseMap();
        CreateMap<Models.Dtos.OrderDetailsDto, Models.Order>().ReverseMap();
        CreateMap<Models.Dtos.OrderListDto, Models.Order>().ReverseMap();

        CreateMap<Models.Dtos.OrderItemCreateDto, Models.OrderItem>().ReverseMap();
        CreateMap<Models.Dtos.OrderItemDetailsDto, Models.OrderItem>()
            .ReverseMap()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => (int)(src.VatRate * 100)));
    }
}