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
import { FaRegEdit } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const UnitTable = ({
  data,
  handleEditData,
  loading,
  currentUnitPage,
  setCurrentUnitPage,
  lastUnitPage,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    {
      accessorKey: "serialNo",
      header: () => {
        return <div className="text-left">Serial No</div>;
      },
      cell: ({ row }) => {
        return <div className="text-left">{Number(row.id) + 1}</div>;
      },
    },
    {
      accessorKey: "Unit_Name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unit Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-left px-5">{row.getValue("Unit_Name")}</div>
        );
      },
    },
    {
      accessorKey: "Unit_No",
      header: () => <div className="text-left ">Unit No.</div>,
      cell: ({ row }) => {
        return <div className="text-left">{row.getValue("Unit_No")}</div>;
      },
    },
    {
      accessorKey: "Id",
      header: () => <div className="text-center ">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="w-full flex justify-center  text-center">
            <Button
              className="flex text-center items-center justify-center gap-3"
              onClick={() => handleEditData(data[row.id])}
            >
              Edit
              <FaRegEdit />
            </Button>
          </div>
        );
      },
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
    <div className="w-full  flex flex-col items-center sm:items-end pt-4">
      <ScrollArea className="rounded-md border w-[300px] sm:w-full h-full">
        <ScrollArea className=" w-[300px] sm:w-full  h-full">
          <Table>
            <TableHeader>
              {loading ? (
                <>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full " />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full " />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full " />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full " />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full " />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full " />
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={`py-2`}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div> */}
        <Pagination className={`space-x-2`}>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentUnitPage((prev) => prev - 1)}
                disabled={currentUnitPage === 1}
              >
                Previous
              </Button>
            </PaginationItem>

            {Array.from({ length: lastUnitPage }).map((_, i) => (
              <PaginationItem key={i} onClick={() => setCurrentUnitPage(i + 1)}>
                <PaginationLink href="#">{i + 1}</PaginationLink>
              </PaginationItem>
            ))}

            {/* <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem> */}
            <PaginationItem>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentUnitPage((prev) => prev + 1)}
                disabled={currentUnitPage === lastUnitPage}
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

export default UnitTable;
