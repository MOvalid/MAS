using AutoMapper;

namespace MasApi.Mappings;

public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        DestinationMemberNamingConvention = new ExactMatchNamingConvention();

        CreateMap<Models.Dtos.PaymentCreateDto, Models.Payment>().ReverseMap();

        CreateMap<Models.Dtos.PaymentDetailsDto, Models.Payment>()
            .ReverseMap()
            .ForMember(dest => dest.InvoiceId, opt => opt.MapFrom(src => src.Order!.Invoice != null ? src.Order.Invoice.Id : (Guid?)null));

        CreateMap<Models.Dtos.PaymentListDto, Models.Payment>()
            .ReverseMap()
            .ForMember(dest => dest.InvoiceId, opt => opt.MapFrom(src => src.Order!.Invoice != null ? src.Order.Invoice.Id : (Guid?)null));
    }
}