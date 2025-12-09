using AutoMapper;

namespace MasApi.Mappings;

public class CompanyProfile : Profile
{
    public CompanyProfile()
    {
        CreateMap<Models.Dtos.CompanyCreateDto, Models.Company>().ReverseMap();
        CreateMap<Models.Dtos.CompanyDetailsDto, Models.Company>().ReverseMap();
        CreateMap<Models.Dtos.CompanyListDto, Models.Company>().ReverseMap();
    }
}