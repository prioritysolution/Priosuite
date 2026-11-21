"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, X } from "lucide-react";
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

const DepositAgentTable = ({
  data = [],
  handleEditData,
  loading = false,
  currentPage = 1,
  setCurrentPage,
  lastPage = 1,
  pageLimit = 25,
  onSearch,
  initialSearchValue = "",
}) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [searchValue, setSearchValue] = useState(initialSearchValue);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onSearchRef.current?.(searchValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleClearSearch = () => {
    setSearchValue("");
    onSearchRef.current?.("");
  };

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
      accessorKey: "CIF_No",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          CIF / Member No
          <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium text-primary">
          {row.original.CIF_No || row.original.Cust_No || row.original.Agent_Code || "-"}
        </div>
      ),
    },
    {
      accessorKey: "Full_Name",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          className="p-0 hover:bg-transparent font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Agent Name
          <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left font-medium text-slate-800">
          {row.original.Full_Name ?? row.original.Agent_Name ?? row.original.agent_name ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Cust_Mob",
      header: () => <div className="text-left font-semibold">Mobile</div>,
      cell: ({ row }) => (
        <div className="text-left text-slate-600">
          {row.original.Cust_Mob || row.original.Mobile || "-"}
        </div>
      ),
    },
    {
      accessorKey: "Agent_Deposit",
      header: () => <div className="text-right font-semibold">Security Amt</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium text-slate-700">
          {row.original.Agent_Deposit ?? row.original.Deposit_Amt ?? row.original.deposit_amt ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Agent_Max_Amount",
      header: () => <div className="text-right font-semibold">Max Coll Amt</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono font-medium text-slate-700">
          {row.original.Agent_Max_Amount ?? row.original.Max_Amt ?? row.original.max_amt ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Agent_Allow_Days",
      header: () => <div className="text-center font-semibold">Max Days</div>,
      cell: ({ row }) => (
        <div className="text-center font-medium text-slate-700">
          {row.original.Agent_Allow_Days ?? row.original.Max_Days ?? row.original.max_days ?? "-"}
        </div>
      ),
    },
    {
      accessorKey: "Allow_Deposit",
      header: () => <div className="text-center font-semibold">Deposit Coll</div>,
      cell: ({ row }) => {
        const val = row.original.Allow_Deposit ?? row.original.Allow_dep ?? row.original.allow_dep;
        const isAllowed = Number(val) === 1 || val === true || val === "1";
        return (
          <div className="text-center">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isAllowed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isAllowed ? "Yes" : "No"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Allow_Loan",
      header: () => <div className="text-center font-semibold">Loan Coll</div>,
      cell: ({ row }) => {
        const val = row.original.Allow_Loan ?? row.original.Allow_ln ?? row.original.allow_ln;
        const isAllowed = Number(val) === 1 || val === true || val === "1";
        return (
          <div className="text-center">
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isAllowed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isAllowed ? "Yes" : "No"}
            </span>
          </div>
        );
      },
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
      {/* Search Input Bar */}
      <div className="w-full flex items-center justify-between gap-3 px-1 pb-1">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search agent by name / CIF / mobile..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs rounded-md bg-white border-slate-200 focus:border-primary shadow-xs"
          />
          {searchValue && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {loading && (
          <span className="text-xs text-slate-400 animate-pulse hidden sm:inline-block">
            Searching...
          </span>
        )}
      </div>

      <ScrollArea className="w-full flex-1 rounded-md border border-slate-200">
        <Table>
          <TableHeader className="bg-slate-100 sticky top-0 z-10 shadow-xs">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-slate-800 font-bold whitespace-nowrap py-3">
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
                  No agents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination Bar - always visible when data exists */}
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

            {/* First Page + Ellipsis */}
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

            {/* Dynamic Pages */}
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

            {/* Last Page + Ellipsis */}
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

export default DepositAgentTable;
