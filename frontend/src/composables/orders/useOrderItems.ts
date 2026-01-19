import { mapOrderItemToTableData } from "@/mappers/order.mapper";
import { OrderItem, OrderItemTableData } from "@/types/domain";
import { useMemo } from "react";

export const useOrderItemTableData = (
    orderItems: OrderItem[],
    page: number = 1,
    limit: number = 10
): OrderItemTableData[] => {
    return useMemo(() => {
        return orderItems.map((dto, index) => mapOrderItemToTableData(dto, (index + 1).toString()));
        return orderItems.map((dto, index) => mapOrderItemToTableData(dto, (index + 1).toString()));
    }, [orderItems, page, limit]);
};
