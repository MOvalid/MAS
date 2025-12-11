export interface ClientRow {
    id: string;
    icon: string;
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    isCompany: boolean;
}
