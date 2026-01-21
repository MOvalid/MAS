// @/hooks/useOrderActions.ts
import { useSnackbar } from '@/context/SnackbarContext';
import { PaymentMethod, PaymentStatus } from '@/types/common';
import { Address } from '@/types/domain';
import {
    useCreatePayment,
    useUpdatePayment,
    useDeletePayment,
} from '@/composables/payment/usePayments';
import { useCreateDelivery, useUpdateDelivery } from '@/composables/delivery/useDeliveries';
import { mapAddressToDto } from '@/mappers/address.mapper';
import { PaymentDto } from '@/types/dto';
import { useCreateInvoice } from '@/composables/invoice/useInvoices';
import { useDeleteOrder } from '@/composables/orders/useOrders';

export const useOrderActions = (
    orderId: string,
    companyId: string,
    refresh: () => void,
    currentPayments: PaymentDto[] = []
) => {
    const { showSnackbar } = useSnackbar();

    const { create: createPayment, loading: isCreatingPayment } = useCreatePayment(
        () => {
            showSnackbar('Dodano nową płatność', 'success');
            refresh();
        },
        (err) => showSnackbar(`Błąd dodawania płatności: ${err}`, 'error')
    );

    const { create: createInvoice, loading: isCreatingInvoice } = useCreateInvoice(
        () => {
            showSnackbar('Dodano nową fakturę', 'success');
            refresh();
        },
        (err) => showSnackbar(`Błąd dodawania faktury: ${err}`, 'error')
    );

    const { update: updatePayment, loading: isUpdatingPayment } = useUpdatePayment(
        () => {
            showSnackbar('Zaktualizowano status płatności', 'success');
            refresh();
        },
        (err) => showSnackbar(`Błąd aktualizacji płatności: ${err}`, 'error')
    );

    const { remove: deletePayment, loading: isDeletingPayment } = useDeletePayment(
        () => {
            showSnackbar('Płatność została usunięta', 'info');
            refresh();
        },
        (err) => showSnackbar(`Błąd podczas usuwania: ${err}`, 'error')
    );

    const { update: updateDelivery, loading: isUpdatingDelivery } = useUpdateDelivery(
        () => {
            showSnackbar('Dane dostawy zostały zaktualizowane', 'success');
            refresh();
        },
        (err) => showSnackbar(`Błąd aktualizacji dostawy: ${err}`, 'error')
    );

    const { create: createDelivery, loading: isCreatingDelivery } = useCreateDelivery(
        () => {
            showSnackbar('Dodano nową dostawę', 'success');
            refresh();
        },
        (err) => showSnackbar(`Błąd dodawania dostawy: ${err}`, 'error')
    );

    const { remove: deleteOrder, loading: isDeletingOrder } = useDeleteOrder(
        () => {
            showSnackbar('Usunięto zamówienie.', 'success');
        },
        (err) => showSnackbar(`Błąd podczas usuwania dostawy: ${err}`, 'error')
    )

    const handleSavePayment = async (
        amount: number,
        currency: string,
        method: PaymentMethod,
        paymentId?: string
    ) => {
        if (paymentId) {
            const currentPayment = currentPayments.find((p) => p.id === paymentId);
            if (currentPayment?.status === PaymentStatus.COMPLETED) {
                showSnackbar('Nie można edytować zatwierdzonej płatności', 'error');
                return;
            }
            updatePayment(paymentId, { status: PaymentStatus.COMPLETED });
        } else {
            createPayment({
                orderId,
                amount,
                paymentMethod: method,
                currency,
                status: PaymentStatus.PENDING,
            });
        }
    };

    const handleCancelPayment = async (paymentId: string) => {
        const currentPayment = currentPayments.find((p) => p.id === paymentId);
        if (currentPayment?.status === PaymentStatus.COMPLETED) {
            showSnackbar('Nie można usunąć zatwierdzonej płatności', 'error');
            return;
        }
        deletePayment(paymentId);
    };

    const handleSaveDelivery = async (
        address: Address,
        carrierId: string,
        tracking: string,
        deliveryDate: string,
        deliveryId?: string
    ) => {
        const selectedDate = new Date(deliveryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showSnackbar('Nie można zaplanować ani edytować dostawy z datą przeszłą', 'error');
            return;
        }

        const payload = {
            orderId: orderId,
            carrierId: carrierId,
            deliveryDate: deliveryDate,
            address: mapAddressToDto(address),
            trackingNumber: tracking,
        };

        if (deliveryId) {
            updateDelivery(deliveryId, payload);
        } else {
            createDelivery(payload);
        }
    };

    const handleCreateInvoice = async () => {
        await createInvoice({
            orderId: orderId,
        });
    };

    const handleDeleteOrder = async () => {
        await deleteOrder(orderId);
    }

    return {
        handleSavePayment,
        handleCancelPayment,
        handleSaveDelivery,
        handleCreateInvoice,
        handleDeleteOrder,
        isLoading:
            isCreatingPayment ||
            isUpdatingPayment ||
            isDeletingPayment ||
            isUpdatingDelivery ||
            isCreatingDelivery ||
            isCreatingInvoice ||
            isDeletingOrder ||
            false,
    };
};
