"use client"

import { DataTable } from "@/components/ui/data-table";
import { Customer } from "@/lib/api/models/customer.dto";
import { GetCustomersQuery } from "@/lib/api/models/customer.query";
import { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

async function GetCustomers(query: GetCustomersQuery): Promise<Customer[]> {
  //TODO: replace with call to API service
  return [
    {
      id: 1,
      firstName: "Jeff",
      lastName: "Easton"
    }
  ]
}

const columns: ColumnDef<Customer>[] = [
  {
    "accessorKey": "id",
    "header": "Id"
  },
  {
    "accessorKey": "firstName",
    "header": "First Name"
  },
  {
    "accessorKey": "lastName",
    "header": "Last Name"
  }
]

const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
  //server side pagination hook
  const nextPagination = updater as PaginationState;
  console.log(nextPagination.pageIndex, nextPagination.pageSize);
};

export default function Customers() {

  const [data, setData] = useState<Customer[]>([]);

  //TODO: add state for filtering & searching parameters
  //TODO: add state for data loading boolean
  //TODO: capture total records from API response to know how many pages are available

  //runs once the component has been rendered (similar to onMounted in Vue
  //last arguement of the useEffect function ([]) can be used like a Vue watcher for multiple fields
  useEffect(() => {
    GetCustomers({ pageNumber: 1, pageSize: 10 }).then(setData);
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable
        onPaginationChanged={handlePaginationChange}
        columns={columns}
        data={data} />
    </div>
  );
}
