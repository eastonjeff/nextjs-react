import { GetCustomersQuery, GetCustomersResponse } from "../models/customer.query";
import { apiClient } from "@/lib/api/api.client";

export async function getCustomers(query:GetCustomersQuery): Promise<GetCustomersResponse> {

    const customers = await apiClient<GetCustomersResponse>("customers", {
        method: "GET",
        params: query 
    })

    return customers;
}