// @/hooks/useOrderActions.ts
import { useSnackbar } from '@/context/SnackbarContext';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@/types/common';
import { Address } from '@/types/domain';
import { useCreatePayment, useUpdatePayment } from '@/composables/payment/usePayments';
import { useCreateDelivery, useUpdateDelivery } from '@/composables/delivery/useDeliveries';
import { mapAddressToDto } from '@/mappers/address.mapper';
import { PaymentDto } from '@/types/dto';
import { useCreateInvoice } from '@/composables/invoice/useInvoices';
import { useUpdateOrder } from '@/composables/orders/useOrders';

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

    const { update: updateOrder, loading: isUpdatingOrder } = useUpdateOrder(
        () => {
            showSnackbar('Zamówienie zostało zaktualizowane.', 'success');
            refresh();
        },
        (err) => showSnackbar(`Błąd podczas aktualizacji zamówienia: ${err}`, 'error')
    );

    const handleSavePayment = async (
        amount: number,
        currency: string,
        method: PaymentMethod,
        paymentId?: string
    ) => {
        if (paymentId) {
            const currentPayment = currentPayments.find((p) => p.id === paymentId);
            if (
                currentPayment?.status === PaymentStatus.COMPLETED ||
                currentPayment?.status === PaymentStatus.FAILED
            ) {
                showSnackbar('Nie można edytować zakończonej płatności', 'error');
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
            showSnackbar('Nie można anulować zatwierdzonej płatności', 'error');
            return;
        }
        await updatePayment(paymentId, { status: PaymentStatus.FAILED });
    };

    const handleSaveDelivery = async (
        address: Address,
        carrierId: string,
        tracking: string,
        deliveryDate: string,
        deliveryId?: string
    ) => {
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

    const handleCancelOrder = async () => {
        await updateOrder(orderId, { status: OrderStatus.CANCELLED });
    };

    const handleReturnOrder = async () => {
        await updateOrder(orderId, { status: OrderStatus.RETURNED });
    };

    return {
        handleSavePayment,
        handleCancelPayment,
        handleSaveDelivery,
        handleCreateInvoice,
        handleCancelOrder,
        handleReturnOrder,
        isLoading:
            isCreatingPayment ||
            isUpdatingPayment ||
            isUpdatingDelivery ||
            isCreatingDelivery ||
            isCreatingInvoice ||
            isUpdatingOrder ||
            false,
    };
};
