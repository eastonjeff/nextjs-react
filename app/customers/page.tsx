"use client"

import { DataTable } from "@/components/ui/DataTable";
import { Customer } from "@/lib/api/models/customer.dto";
import { GetCustomersQuery, GetCustomersResponse } from "@/lib/api/models/customer.query";
import { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getCustomers } from "@/lib/api/entities/customers.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function Customers() {

  const [customerData, setCustomerData] = useState<GetCustomersResponse>({ customers: [], total: 0 });
  const [paginationData, setPaginationData] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [idFilter, setIdFilter] = useState("");
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [loading, setLoading] = useState(true);

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
    },
    {
      "header": "Action",
      "accessorKey": "actions",
      "cell": ({ row }) => {
        return (<div>
          <Button
            className="cursor-pointer"
            size={"icon"}
            variant={"ghost"}
            onClick={() => console.log(row.original.id + " edit")}>
            <Pencil></Pencil>
          </Button>
          <Button
            className="cursor-pointer"
            size={"icon"}
            variant={"ghost"}
            onClick={() => console.log(row.original.id + " delete")}>
            <Trash2></Trash2>
          </Button>
        </div>)
      }
    }
  ]

  async function loadCustomers(): Promise<void> {
    setLoading(true);
    //API call min 1 seconds so I can see the loading indicator
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const query = getCustomerQuery();
    const response = await getCustomers(query);
    setCustomerData(response);
    setLoading(false);
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    setPaginationData((prev) => {
      const nextPagination = typeof updater === "function" ? updater(prev) : updater;
      return nextPagination;
    });
  };

  function getCustomerQuery(): GetCustomersQuery {
    let id: number | undefined = parseInt(idFilter);
    id = isNaN(id) ? undefined : id;
    return {
      id: id,
      firstName: firstNameFilter,
      lastName: lastNameFilter,
      pageNumber: paginationData.pageIndex + 1, //api is not zero based
      pageSize: paginationData.pageSize
    }
  }

  useEffect(() => {
    loadCustomers();
  }, [paginationData.pageIndex, paginationData.pageSize]);

  return (
    <div className="container mx-auto py-10">

      <h1 className="text-2xl font-semibold mb-2">Search Customers</h1>
      <Link href="/" className="text-sm mb-4 inline-block">
        ← Back to home
      </Link>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-5">

        <Input
          type="number"
          placeholder="Id"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}></Input>

        <Input
          type="text"
          placeholder="First Name"
          value={firstNameFilter}
          onChange={(e) => setFirstNameFilter(e.target.value)}></Input>

        <Input
          type="text"
          placeholder="Last Name"
          value={lastNameFilter}
          onChange={(e) => setLastNameFilter(e.target.value)}></Input>

      </div>

      <Button
        size="sm"
        className="mb-5"
        onClick={() => loadCustomers()}
      >
        Search
      </Button>

      <DataTable
        onPaginationChanged={handlePaginationChange}
        pagination={paginationData}
        columns={columns}
        loading={loading}
        total={customerData?.total || 0}
        data={customerData?.customers || []} />

    </div >
  );
}
