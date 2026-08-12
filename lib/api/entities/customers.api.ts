import { Customer } from "../models/customer.dto";
import { GetCustomersQuery, GetCustomersResponse } from "../models/customer.query";
import { apiClient } from "@/lib/api/api.client";

export async function getCustomers(query:GetCustomersQuery): Promise<GetCustomersResponse> {

    const customers = await apiClient<GetCustomersResponse>("customers", {
        method: "GET",
        params: query 
    })

    return customers;
}

export async function deleteCustomer(id: number): Promise<void> {
    await apiClient<void>(`customer/${id}`, {
        method: "DELETE"
    })
}

export async function postCustomer(customer: Customer): Promise<Customer> {
    
    const res = await apiClient<Customer>("customer", {
        method: "POST",
        body: JSON.stringify(customer)
    });

    return res;
}

export async function putCustomer(customer: Customer): Promise<Customer> {

    const res = await apiClient<Customer>(`customer`, {
        method: "PUT",
        body: JSON.stringify(customer)
    });

    return res;
}