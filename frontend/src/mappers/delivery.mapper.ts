import { Delivery } from "@/types/domain";
import { DeliveryDto } from "@/types/dto";
import { mapAddressDtoToDomain } from "./address.mapper";

export const mapDeliveryDtoToDomain = (dto: DeliveryDto): Delivery => {
    return {
        id: dto.id,
        orderId: dto.orderId,
        carrierId: dto.carrierId ?? null,
        deliveryDate: dto.deliveryDate ?? null,
        trackingNumber: dto.trackingNumber ?? null,
        address: mapAddressDtoToDomain(dto.address),
    };
};
