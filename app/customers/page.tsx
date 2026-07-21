import { DataTable } from "@/components/ui/data-table";
import { Customer } from "@/lib/api/models/customer.dto";
import { GetCustomersQuery } from "@/lib/api/models/customer.query";
import { ColumnDef } from "@tanstack/react-table";

async function GetCustomers(query:GetCustomersQuery): Promise<Customer[]> {
  //TODO: replace with call to API service
  return [
    {
      id: 1,
      firstName: "Jeff",
      lastName: "Easton"
    }
  ]
}

const columns:ColumnDef<Customer>[] = [
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

export default async function Customers() {
  
  const data = await GetCustomers({ pageNumber: 1, pageSize: 10 });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
