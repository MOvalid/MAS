import { Delivery } from '@/types/domain/delivery';
import { API_DELIVERIES } from '@/constants/Endpoints';
import { useCreate } from '../common/useCreate';
import { useUpdate } from '../common/useUpdate';
import { DeliveryDto } from '@/types/dto';
import { useDelete } from '../common/useDelete';
import { mapDeliveryDtoToDomain } from '@/mappers/delivery.mapper';
import { useGet } from '../common/useGet';

export type CreateDeliveryPayload = Omit<Delivery, 'id'>;
export type UpdateDeliveryPayload = Omit<Delivery, 'id'>;

export const useCreateDelivery = (
    onSuccess?: (delivery: Delivery) => void,
    onError?: (error: string) => void
) => {
    return useCreate<CreateDeliveryPayload, Delivery, DeliveryDto>({
        endpoint: API_DELIVERIES,
        onSuccess,
        onError,
        transformResponse: mapDeliveryDtoToDomain,
    });
};

export const useUpdateDelivery = (
    onSuccess?: (delivery: Delivery) => void,
    onError?: (error: string) => void
) => {
    return useUpdate<Delivery, UpdateDeliveryPayload, Delivery, DeliveryDto>({
        endpoint: API_DELIVERIES,
        onSuccess,
        onError,
        transformResponse: mapDeliveryDtoToDomain,
    });
};

export const useDeleteDelivery = (onSuccess?: () => void, onError?: (error: string) => void) => {
    return useDelete({
        endpoint: API_DELIVERIES,
        onSuccess: () => onSuccess?.(),
        onError,
    });
};

export const useDelivery = (id?: string) => {
    return useGet<Delivery, DeliveryDto>({
        endpoint: API_DELIVERIES,
        id,
        transformResponse: mapDeliveryDtoToDomain,
    });
};
