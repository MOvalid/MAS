using AutoMapper;

namespace MasApi.Mappings;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        DestinationMemberNamingConvention = new ExactMatchNamingConvention();

        CreateMap<Models.Dtos.ProductCreateDto, Models.Product>()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => src.VatRate / 100m))
            .ReverseMap()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => (int)(src.VatRate * 100)));

        CreateMap<Models.Dtos.ProductDetailsDto, Models.Product>()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => src.VatRate / 100m))
            .ReverseMap()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => (int)(src.VatRate * 100)))
            .ForMember(dest => dest.Category, opt =>
            {
                opt.MapFrom(src => src.Category);
                opt.Condition(src => src.Category != null);
            });

        CreateMap<Models.Dtos.ProductListDto, Models.Product>()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => src.VatRate / 100m))
            .ReverseMap()
            .ForMember(dest => dest.VatRate, opt => opt.MapFrom(src => (int)(src.VatRate * 100)));
    }
}