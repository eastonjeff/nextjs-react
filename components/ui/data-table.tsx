"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    OnChangeFn,
    PaginationState
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    total: number,
    loading: boolean,
    pagination: PaginationState,
    onPaginationChanged: OnChangeFn<PaginationState>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    total,
    pagination,
    loading,
    onPaginationChanged,
}: DataTableProps<TData, TValue>) {
    const pageCount = total > 0 ? Math.ceil(total / pagination.pageSize) : 0;

    //base table model that shadcn wraps
    const table = useReactTable({
        data,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: onPaginationChanged,
        manualPagination: true,
        pageCount,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    })

    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {
                        loading ?
                            <TableBody>
                                <TableRow>
                                    <TableCell><div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div></TableCell>
                                </TableRow>
                            </TableBody>
                            :
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                    }

                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={loading || pagination.pageIndex === 0}
                >
                    Previous
                </Button>
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={loading || pagination.pageIndex + 1 >= pageCount}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}