using AutoMapper;

namespace MasApi.Mappings;

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        DestinationMemberNamingConvention = new ExactMatchNamingConvention();

        CreateMap<Models.Dtos.OrderCreateDto, Models.Order>().ReverseMap();
        CreateMap<Models.Dtos.OrderDetailsDto, Models.Order>().ReverseMap();

        CreateMap<Models.Dtos.OrderUpdateDto, Models.Order>();

        CreateMap<Models.Dtos.OrderListDto, Models.Order>()
            .ReverseMap()
            .ForMember(dest => dest.Customer, opt => opt.MapFrom(src => src.Customer!.FirstName + " " + src.Customer.LastName))
            .ForMember(dest => dest.Company, opt => opt.MapFrom(src => src.Invoice!.Company != null ? src.Invoice.Company.Name : null))
            .ForMember(dest => dest.CompanyId, opt => opt.MapFrom(src => src.Invoice!.Company != null ? src.Invoice.Company.Id : (Guid?)null))
            .ForMember(dest => dest.Seller, opt => opt.MapFrom(src => src.Seller!.FirstName + " " + src.Seller.LastName))
            .ForMember(dest => dest.DeliveryId, opt => opt.MapFrom(src => src.Delivery != null ? src.Delivery.Id : (Guid?)null))
            .ForMember(dest => dest.InvoiceNumber, opt => opt.MapFrom(src => src.Invoice != null ? src.Invoice.InvoiceNumber : null));

        CreateMap<Models.Dtos.OrderItemCreateDto, Models.OrderItem>().ReverseMap();
        CreateMap<Models.Dtos.OrderItemDetailsDto, Models.OrderItem>()
            .ReverseMap()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => (int)(src.VatRate * 100)));
    }
}