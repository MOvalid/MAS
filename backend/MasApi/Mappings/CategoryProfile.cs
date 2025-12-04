using AutoMapper;

namespace MasApi.Mappings;

public class CategoryProfile : Profile
{
    public CategoryProfile()
    {
        CreateMap<Models.Dtos.CategoryCreateDto, Models.Category>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid()));

        CreateMap<Models.Dtos.CategoryDetailsDto, Models.Category>().ReverseMap();
        CreateMap<Models.Dtos.CategoryListDto, Models.Category>().ReverseMap();

    }
}