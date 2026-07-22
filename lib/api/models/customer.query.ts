import { Customer } from "./customer.dto";

export type GetCustomersQuery = {
    id?: number;
    firstName?: string;
    lastName?: string;
    pageSize: number;
    pageNumber: number;
}

export type GetCustomersResponse = {
    total: number,
    customers: Customer[]
}