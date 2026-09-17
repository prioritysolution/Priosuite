"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const LoanAccountSearchTable = ({
  loading,
  data,
  handleSelectData,
  currentAccountPage,
  setCurrentAccountPage,
  lastAccountPage,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    {
      accessorKey: "serialNo",
      header: () => <div className="text-left">Serial No</div>,
      cell: ({ row }) => <div className="text-left">{Number(row.id) + 1}</div>,
    },
    {
      accessorKey: "Account_No",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left px-5">{row.getValue("Account_No")}</div>
      ),
    },
    {
      accessorKey: "Full_Name",
      header: () => <div className="text-left">Full Name</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Full_Name")}</div>
      ),
    },
    {
      accessorKey: "Ref_Ac_No",
      header: () => <div className="text-left">Reference Account No.</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Ref_Ac_No")}</div>
      ),
    },
    {
      accessorKey: "Prod_Name",
      header: () => <div className="text-left">Product Name</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Prod_Name")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full flex flex-col items-center sm:items-end pt-4">
      <ScrollArea className="rounded-md border w-[300px] sm:w-full h-full">
        <ScrollArea className="w-[300px] sm:w-full h-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <TableCell key={idx}>
                        <Skeleton className="w-full h-5 bg-secondary" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleSelectData(data[row.id])}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ScrollArea>

      {/* PAGINATION */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Pagination className="space-x-2">
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentAccountPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentAccountPage === 1 || loading}
              >
                Previous
              </Button>
            </PaginationItem>

            {/* Show beginning with ellipsis if needed */}
            {currentAccountPage > 3 && (
              <>
                <PaginationItem onClick={() => setCurrentAccountPage(1)}>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                {currentAccountPage > 4 && (
                  <PaginationItem>
                    <PaginationLink href="#">...</PaginationLink>
                  </PaginationItem>
                )}
              </>
            )}

            {/* Show current window of 5 pages */}
            {Array.from({ length: 5 }, (_, i) => {
              const page = currentAccountPage - 2 + i;
              if (page > 0 && page <= lastAccountPage) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentAccountPage}
                      onClick={() => setCurrentAccountPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              return null;
            })}

            {/* Show ending with ellipsis if needed */}
            {currentAccountPage < lastAccountPage - 2 && (
              <>
                {currentAccountPage < lastAccountPage - 3 && (
                  <PaginationItem>
                    <PaginationLink href="#">...</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem
                  onClick={() => setCurrentAccountPage(lastAccountPage)}
                >
                  <PaginationLink href="#">{lastAccountPage}</PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentAccountPage((prev) =>
                    Math.min(lastAccountPage, prev + 1),
                  )
                }
                disabled={currentAccountPage === lastAccountPage || loading}
              >
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default LoanAccountSearchTable;
