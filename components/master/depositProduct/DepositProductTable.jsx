"use client";

import { useTranslation } from "react-i18next";

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

const DepositProductTable = ({
  data,
  handleEditData,
  loading,
  currentPage = 1,
  setCurrentPage,
  lastPage = 1,
  pageLimit = 10,
}) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = [
    {
      accessorKey: "serialNo",
      header: () => <div className="text-left">{t("common.serialNo")}</div>,
      cell: ({ row }) => (
        <div className="text-left">
          {(Number(currentPage) - 1) * Number(pageLimit) + Number(row.id) + 1}
        </div>
      ),
    },
    {
      accessorKey: "Product_Name",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("master.depositProduct.table.productName")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-left px-5">{row.getValue("Product_Name")}</div>
      ),
    },
    {
      accessorKey: "Prd_SH_Name",
      header: () => <div className="text-left">{t("master.depositProduct.table.shortName")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Prd_SH_Name")}</div>
      ),
    },
    {
      accessorKey: "Prd_Type_Name",
      header: () => <div className="text-left">{t("master.depositProduct.table.productType")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Prd_Type_Name")}</div>
      ),
    },
    {
      accessorKey: "Dep_Type_Name",
      header: () => <div className="text-left">{t("master.depositProduct.table.depositType")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Dep_Type_Name")}</div>
      ),
    },
    {
      accessorKey: "Interest_Type_Name",
      header: () => <div className="text-left">{t("master.depositProduct.table.interestType")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Interest_Type_Name")}</div>
      ),
    },
    {
      accessorKey: "Min_Amount",
      header: () => <div className="text-left">{t("master.depositProduct.table.minAmt")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Min_Amount")}</div>
      ),
    },
    {
      accessorKey: "Max_Amount",
      header: () => <div className="text-left">{t("master.depositProduct.table.maxAmt")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Max_Amount")}</div>
      ),
    },
    {
      accessorKey: "ROI",
      header: () => <div className="text-left">{t("master.depositProduct.table.roi")}</div>,
      cell: ({ row }) => <div className="text-left">{row.getValue("ROI")}</div>,
    },
    {
      accessorKey: "Status",
      header: () => <div className="text-left">{t("master.depositProduct.table.status")}</div>,
      cell: ({ row }) => (
        <div className="text-left">{row.getValue("Status")}</div>
      ),
    },
    {
      accessorKey: "Id",
      header: () => <div className="text-center">{t("common.action")}</div>,
      cell: ({ row }) => (
        <div className="w-full flex justify-center text-center">
          <Button
            type="button"
            className="flex text-center items-center justify-center gap-3"
            onClick={() => handleEditData(data[row.id])}
          >
            {t("common.buttons.edit")}
            <FaRegEdit />
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
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const totalPages = Math.max(Number(lastPage) || 0, 0);

  return (
    <div className="w-full flex flex-col items-center sm:items-end pt-4">
      <ScrollArea className="rounded-md border w-full">
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
              <>
                {[...Array(6)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell
                      colSpan={columns.length}
                      className="h-14 text-center"
                    >
                      <Skeleton className="w-full h-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  {t("forms.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {totalPages > 0 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Pagination className="space-x-2">
            <PaginationContent>
              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  {t("forms.previous")}
                </Button>
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i} onClick={() => setCurrentPage(i + 1)}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => e.preventDefault()}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage === totalPages || loading || totalPages === 0}
                >
                  {t("forms.next")}
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default DepositProductTable;
