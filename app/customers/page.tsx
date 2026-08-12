"use client"

import { DataTable } from "@/components/ui/DataTable";
import { Customer } from "@/lib/api/models/customer.dto";
import { GetCustomersQuery, GetCustomersResponse } from "@/lib/api/models/customer.query";
import { ColumnDef, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getCustomers, postCustomer, putCustomer, deleteCustomer } from "@/lib/api/entities/customers.api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import CustomerDialog from "@/components/customers/CustomerDialog";
import { toast } from "@/components/ui/Toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/AlertDialog";
import { Search, Plus } from "lucide-react";

export default function Customers() {

  const [customerData, setCustomerData] = useState<GetCustomersResponse>({ customers: [], total: 0 });
  const [paginationData, setPaginationData] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [idFilter, setIdFilter] = useState("");
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [loading, setLoading] = useState(true);

  //dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);


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
            onClick={() => {
              setSelectedCustomer(row.original);
              setIsEditMode(true);
              setIsDialogOpen(true);
            }}>
            <Pencil></Pencil>
          </Button>
           <Button
            className="cursor-pointer"
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              setSelectedCustomer(row.original);
              setDeleteAlertOpen(true);
            }}
            >
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

  function showToast(action: string, customer: Customer, success: boolean) {
    const id = toast.add({
      title: `Customer ${customer.id}`,
      description: `Customer ${customer.firstName} ${customer.lastName} was ${action} ` + (success ? "successfully" : "failed"),
      type: success ? "success" : "error",
      actionProps: {
        onClick() {
          toast.close(id)
        }
      },
    })
  }

  async function removeCustomer(customer:Customer): Promise<void> {
    try {
      await deleteCustomer(customer.id);
      setDeleteAlertOpen(false);
      showToast("deleted", customer, true);
      //remove the customer from the table without reloading the whole table
      setCustomerData(prev => ({
        ...prev,
        customers: prev.customers.filter(row => row.id !== customer.id),
        total: prev.total - 1,
      }));
    }
    catch (error) {
      console.error("Error deleting customer: ", error);
      showToast("deleted", customer, false);
    }
  }

  async function saveCustomer(customer: Customer): Promise<void> {
    //console.log("Saving customer: ", customer);
    if (isEditMode) {
      await updateCustomer(customer);
    }
    else {
      await createCustomer(customer);
    }
  }

  async function updateCustomer(customer: Customer) {
    try {
      var customer = await putCustomer(customer);
      setIsDialogOpen(false);
      showToast("saved", customer, true);
      //update the selected customer in the table without reloading the whole table
      if (selectedCustomer == null) {
        console.error("Selected customer is null, cannot update the table");
        return;
      }
      setSelectedCustomer(customer);
      //replace the customer in the table with the updated customer
      setCustomerData(prev => ({
        ...prev,
        customers: prev.customers.map(row =>
          row.id === customer.id ? customer : row
        ),
      }));
    }
    catch (error) {
      console.error("Error saving customer: ", error);
      showToast("saved", customer, false);
    }
  }

  async function createCustomer(customer: Customer) {
    try {
      var customer = await postCustomer(customer);
      setIsDialogOpen(false);
      showToast("created", customer, true);
      //add the customer to the table without reloading the whole table
      setCustomerData(prev => ({
        ...prev,
        customers: [customer, ...prev.customers],
        total: prev.total + 1,
      }));
    }
    catch (error) {
      console.error("Error creating customer: ", error);
      showToast("created", customer, false);
    }
  }

  function handleDialogOpenChange(open: boolean) {
    setIsDialogOpen(open);
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
        <Search className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        className="mb-5"
        onClick={() => {
          setSelectedCustomer({ id: 0, firstName: "", lastName: ""} as Customer);
          setIsEditMode(false);
          setIsDialogOpen(true);
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <DataTable
        onPaginationChanged={handlePaginationChange}
        pagination={paginationData}
        columns={columns}
        loading={loading}
        total={customerData?.total || 0}
        data={customerData?.customers || []} />

      <CustomerDialog
        customer={selectedCustomer}
        isEditMode={isEditMode}
        visible={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSave={saveCustomer}
      />

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this customer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async () => {
              if(selectedCustomer == null) {
                console.error("Selected customer is null, cannot delete");
                return;
              }
              await removeCustomer(selectedCustomer);
            }}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div >
  );
}

