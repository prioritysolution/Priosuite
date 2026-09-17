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

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const MemberSearchTable = ({
  loading,
  data,
  handleSelectData,
  currentMemberPage,
  setCurrentMemberPage,
  lastMemberPage,
}) => {
  console.log("MemberSearchTable data=", data);
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
      accessorKey: "Cust_No",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Member No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left px-5">{row.getValue("Cust_No")}</div>
      ),
    },
    {
      accessorKey: "CIF_No",
      header: () => <div className="text-left">CIF No.</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("CIF_No")}</div>
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
      accessorKey: "Relation_Name",
      header: () => <div className="text-left">Relation Name</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Relation_Name")}</div>
      ),
    },
    {
      accessorKey: "Address",
      header: () => <div className="text-left">Address</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Address")}</div>
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

  // Dynamic pagination logic (only 5 pages at a time)
  const visiblePages = 5;
  const startPage = Math.max(
    1,
    Math.min(
      currentMemberPage - Math.floor(visiblePages / 2),
      lastMemberPage - visiblePages + 1,
    ),
  );
  const endPage = Math.min(startPage + visiblePages - 1, lastMemberPage);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full flex flex-col items-stretch pt-2 sm:pt-4 gap-2">
      <ScrollArea className="rounded-md border w-full max-w-full">
        <div className="min-w-[640px]">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TableCell key={i}>
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
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-2 whitespace-nowrap text-xs sm:text-sm"
                      >
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
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {data?.length > 0 && (
        <div className="flex items-center justify-center sm:justify-end overflow-x-auto py-2 sm:py-4">
          <Pagination className="w-auto mx-0">
            <PaginationContent className="flex-wrap justify-center gap-1">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMemberPage((prev) => prev - 1)}
                  disabled={currentMemberPage === 1}
                >
                  Previous
                </Button>
              </PaginationItem>

              {/* First Page + Ellipsis */}
              {startPage > 1 && (
                <>
                  <PaginationItem onClick={() => setCurrentMemberPage(1)}>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && (
                    <PaginationItem>
                      <PaginationLink href="#">...</PaginationLink>
                    </PaginationItem>
                  )}
                </>
              )}

              {/* Dynamic Page Range */}
              {pages.map((page) => (
                <PaginationItem
                  key={page}
                  onClick={() => setCurrentMemberPage(page)}
                >
                  <PaginationLink
                    href="#"
                    isActive={page === currentMemberPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {/* Last Page + Ellipsis */}
              {endPage < lastMemberPage && (
                <>
                  {endPage < lastMemberPage - 1 && (
                    <PaginationItem>
                      <PaginationLink href="#">...</PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem
                    onClick={() => setCurrentMemberPage(lastMemberPage)}
                  >
                    <PaginationLink href="#">{lastMemberPage}</PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMemberPage((prev) => prev + 1)}
                  disabled={currentMemberPage === lastMemberPage}
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default MemberSearchTable;
