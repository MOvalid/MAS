import { Carrier } from '@/types/domain/carrier';
import { CarrierDto } from '@/types/dto/carrier';

export const mapCarrierDtoToDomain = (dto: CarrierDto): Carrier => {
    return {
        id: dto.id,
        name: dto.name,
    };
};

export const mapCarrierToDto = (domain: Carrier): CarrierDto => {
    return {
        id: domain.id,
        name: domain.name,
    };
};
