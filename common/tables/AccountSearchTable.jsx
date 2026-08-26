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
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const AccountSearchTable = ({
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
      accessorKey: "Ledg_Folio",
      header: () => <div className="text-left">Ledger Folio</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Ledg_Folio")}</div>
      ),
    },
    {
      accessorKey: "Mem_Mob",
      header: () => <div className="text-left">Mobile No.</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Mem_Mob")}</div>
      ),
    },
    {
      accessorKey: "Prod_Type",
      header: () => <div className="text-left">Product Type</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Prod_Type")}</div>
      ),
    },
    {
      accessorKey: "Ref_Ac_No",
      header: () => <div className="text-left">Reference Account No.</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Ref_Ac_No")}</div>
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

  const renderPagination = () => {
    const pagesToShow = 5;
    const halfRange = Math.floor(pagesToShow / 2);
    let start = Math.max(1, currentAccountPage - halfRange);
    let end = Math.min(lastAccountPage, start + pagesToShow - 1);

    if (end - start < pagesToShow - 1) {
      start = Math.max(1, end - pagesToShow + 1);
    }

    const pages = [];

    if (start > 1) {
      pages.push(
        <PaginationItem key={1} onClick={() => setCurrentAccountPage(1)}>
          <PaginationLink isActive={1 === currentAccountPage}>1</PaginationLink>
        </PaginationItem>
      );
      if (start > 2) pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i} onClick={() => setCurrentAccountPage(i)}>
          <PaginationLink isActive={i === currentAccountPage}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < lastAccountPage) {
      if (end < lastAccountPage - 1)
        pages.push(<PaginationEllipsis key="end-ellipsis" />);
      pages.push(
        <PaginationItem
          key={lastAccountPage}
          onClick={() => setCurrentAccountPage(lastAccountPage)}
        >
          <PaginationLink isActive={lastAccountPage === currentAccountPage}>
            {lastAccountPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  return (
    <div className="w-full flex flex-col items-center sm:items-end pt-4">
      <ScrollArea className="rounded-md border w-full h-full">
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
                          header.getContext()
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
                  {Array.from({ length: 4 }).map((_, index) => (
                    <TableCell key={index}>
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
                  onClick={() => handleSelectData(data[row.index])}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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

      <Pagination className="py-4">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentAccountPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentAccountPage === 1}
            >
              Previous
            </Button>
          </PaginationItem>

          {renderPagination()}

          <PaginationItem>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentAccountPage((prev) =>
                  Math.min(prev + 1, lastAccountPage)
                )
              }
              disabled={currentAccountPage === lastAccountPage}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AccountSearchTable;
