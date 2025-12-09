using AutoMapper;

namespace MasApi.Mappings;

public class InvoiceProfile : Profile
{
    public InvoiceProfile()
    {
        DestinationMemberNamingConvention = new ExactMatchNamingConvention();

        CreateMap<Models.Dtos.InvoiceCreateDto, Models.Invoice>().ReverseMap();
        CreateMap<Models.Dtos.InvoiceDetailsDto, Models.Invoice>().ReverseMap();

        CreateMap<Models.Dtos.InvoiceListDto, Models.Invoice>().ReverseMap();
    }
}