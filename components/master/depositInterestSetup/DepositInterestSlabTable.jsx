"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";

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

const DepositInterestSlabTable = ({
  data = [],
  handleEditData,
  loading = false,
  currentPage = 1,
  setCurrentPage,
  lastPage = 1,
  pageLimit = 25,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = [
    {
      accessorKey: "serialNo",
      header: () => <div className="text-center font-semibold w-12">Sl.</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-500">
          {(Number(currentPage) - 1) * Number(pageLimit) + Number(row.index) + 1}
        </div>
      ),
    },
    {
      accessorKey: "Prod_Name",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
          <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium text-primary">
          {row.original.Prod_Name ||
            row.original.Prd_SH_Name ||
            row.original.Product_Name ||
            row.original.productName ||
            "-"}
        </div>
      ),
    },
    {
      accessorKey: "Effect_Frm",
      header: () => <div className="text-center font-semibold">Effect From</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.Effect_Frm ||
            row.original.effect_frm ||
            row.original.Effect_From ||
            row.original.Effect_frm ||
            "-"}
        </div>
      ),
    },
    {
      accessorKey: "Min_Dur",
      header: () => <div className="text-center font-semibold">Min Dur</div>,
      cell: ({ row }) => (
        <div className="text-center font-mono">
          {row.original.Min_Dur ?? row.original.min_dur ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Max_Dur",
      header: () => <div className="text-center font-semibold">Max Dur</div>,
      cell: ({ row }) => (
        <div className="text-center font-mono">
          {row.original.Max_Dur ?? row.original.max_dur ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Dur_Unit",
      header: () => <div className="text-center font-semibold">Unit</div>,
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.Unit_Name ||
            row.original.unit_name ||
            row.original.Dur_Unit_Name ||
            row.original.dur_unit_name ||
            row.original.Dur_Unit ||
            row.original.dur_unit ||
            "-"}
        </div>
      ),
    },
    {
      accessorKey: "Roi",
      header: () => <div className="text-right font-semibold">General ROI (%)</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium text-emerald-700">
          {row.original.Roi ?? row.original.roi ?? row.original.general_roi ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Sr_Citign_Roi",
      header: () => <div className="text-right font-semibold">Sr Citizen ROI (%)</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium text-emerald-700">
          {row.original.Sr_Citign_Roi ??
            row.original.sr_citign_roi ??
            row.original.Sr_Ctz_Roi ??
            row.original.sr_ctz_roi ??
            row.original.sr_citizen_roi ??
            "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center font-semibold">Action</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Button
            type="button"
            size="sm"
            className="h-8 px-3 bg-primary text-white hover:bg-primary/90 gap-1.5 shadow-xs"
            onClick={() => handleEditData?.(row.original)}
          >
            <FaRegEdit className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Update</span>
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const maxVisiblePages = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);
  const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

  const pages = [];
  for (let i = adjustedStartPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="w-full h-full flex flex-col justify-between gap-3 min-h-0">
      <ScrollArea className="w-full flex-1 rounded-md border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-slate-800 font-bold whitespace-nowrap py-3 text-center"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="py-3">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50/80 transition-colors border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap py-2.5 px-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-slate-500">
                  No interest slabs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 px-1 pt-1 shrink-0 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          Showing page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
          <span className="font-semibold text-slate-800">{Math.max(lastPage, 1)}</span>
        </div>

        <Pagination className="w-auto mx-0">
          <PaginationContent className="flex-wrap justify-center gap-1">
            <PaginationItem>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage?.(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="h-8 text-xs"
              >
                Previous
              </Button>
            </PaginationItem>

            {adjustedStartPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage?.(1);
                    }}
                    className="h-8 w-8 text-xs cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {adjustedStartPage > 2 && (
                  <PaginationItem>
                    <span className="px-1 text-slate-400 text-xs">...</span>
                  </PaginationItem>
                )}
              </>
            )}

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage?.(page);
                  }}
                  className="h-8 w-8 text-xs cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < lastPage && (
              <>
                {endPage < lastPage - 1 && (
                  <PaginationItem>
                    <span className="px-1 text-slate-400 text-xs">...</span>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage?.(lastPage);
                    }}
                    className="h-8 w-8 text-xs cursor-pointer"
                  >
                    {lastPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage?.(currentPage + 1)}
                disabled={currentPage >= lastPage || loading}
                className="h-8 text-xs"
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

export default DepositInterestSlabTable;
