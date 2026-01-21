using AutoMapper;

namespace MasApi.Mappings;

public class InvoiceProfile : Profile
{
    public InvoiceProfile()
    {
        DestinationMemberNamingConvention = new ExactMatchNamingConvention();

        CreateMap<Models.Dtos.InvoiceCreateDto, Models.Invoice>().ReverseMap();
        CreateMap<Models.Dtos.InvoiceDetailsDto, Models.Invoice>().ReverseMap();

        CreateMap<Models.Dtos.InvoiceUpdateDto, Models.Invoice>();

        CreateMap<Models.Dtos.InvoiceListDto, Models.Invoice>()
            .ReverseMap()
            .ForMember(dest => dest.TotalNetPrice, opt => opt.MapFrom(src => src.Order!.TotalNetPrice))
            .ForMember(dest => dest.TotalVatAmount, opt => opt.MapFrom(src => src.Order!.TotalVatAmount))
            .ForMember(dest => dest.TotalGrossPrice, opt => opt.MapFrom(src => src.Order!.TotalGrossPrice));
    }
}