"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
} from "lucide-react";
import Spinner from "@/common/loader/Spinner";
import DepositActionModal from "./DepositActionModal";
import { format, parseISO } from "date-fns";

const Badge = ({ children, variant = "default", className = "" }) => {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200/80",
    destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
    success:
      "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
    outline: "text-foreground border-gray-200",
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <span className={`${baseClasses} ${variantClass} ${className}`}>
      {children}
    </span>
  );
};

const DepositApproval = ({
  loading,
  actionLoading,
  detailsLoading,
  depositList,
  pagination,
  selectedDeposit,
  isDetailsModalOpen,
  handleView,
  handleApprove,
  handleRejectSubmit,
  handlePageChange,
  toggleDetailsModal,
  searchTerm,
  setSearchTerm,
}) => {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "dd-MM-yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const getBadgeVariant = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("receipt")) return "success";
    if (t.includes("payment")) return "destructive";
    return "secondary";
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-800">
              Deposit Approval
            </h2>
          </div>
        </div>

        <div className="relative w-full sm:w-72 shadow-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handlePageChange(1);
            }}
            className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary h-10"
            placeholder="Search by App/Acc No, Queue No..."
          />
        </div>
      </div>

      <Card className="rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-primary hover:bg-primary/90">
              <TableRow className="hover:bg-primary/90">
                <TableHead className="w-[60px] text-white font-semibold h-11">
                  Sl
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Trans Date
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Queue No
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  App / Acc No
                </TableHead>
                <TableHead className="text-white font-semibold h-11">
                  Particulars
                </TableHead>
                <TableHead className="text-white font-semibold h-11 text-center">
                  Type
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Entered By
                </TableHead>
                <TableHead className="text-white font-semibold h-11 whitespace-nowrap">
                  Entered On
                </TableHead>
                <TableHead className="text-center text-white font-semibold h-11">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center">
                    <div className="flex justify-center items-center h-full w-full">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : depositList && depositList.length > 0 ? (
                depositList.map((item, index) => (
                  <TableRow
                    key={`${item.Id || "deposit"}-${index}`}
                    className="hover:bg-blue-50/30 transition-colors duration-200 group"
                  >
                    <TableCell className="font-medium text-gray-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    <TableCell className="text-gray-700 whitespace-nowrap text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(item.Trans_Date)}
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-gray-600">
                      {item.Queue_No || "-"}
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-primary text-sm bg-primary/5 px-2 py-1 rounded border border-primary/10">
                        {item.Appl_No || item.Account_No || "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="max-w-[250px]">
                      <div
                        className="font-medium text-gray-800 text-xs truncate"
                        title={item.Particular || item.Full_Name}
                      >
                        {item.Particular || item.Full_Name}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        variant={getBadgeVariant(item.Vouch_Type)}
                        className="text-[10px] font-bold px-2 py-0.5 shadow-none"
                      >
                        {item.Vouch_Type || "Unknown"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-gray-600 font-medium">
                      {item.Entred_By}
                    </TableCell>

                    <TableCell className="text-xs text-gray-500 whitespace-nowrap">
                      {item.Entred_On}
                    </TableCell>

                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        className="bg-white border-gray-200 text-primary hover:bg-primary hover:text-white hover:border-primary shadow-sm h-8 px-3 transition-all rounded-lg border"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="w-3.5 h-3.5 mr-2" /> View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-40 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">
                        No pending approvals found.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-gray-50/50 gap-4">
            <div className="text-xs text-gray-500 font-medium">
              Showing{" "}
              <span className="text-gray-900 font-bold">
                {depositList.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}
              </span>{" "}
              to{" "}
              <span className="text-gray-900 font-bold">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{" "}
              of <span className="text-gray-900 font-bold">{totalItems}</span>{" "}
              records
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-gray-300 hover:bg-white hover:text-primary disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 text-xs font-bold transition-all rounded-md ${
                        currentPage === pageNum
                          ? "bg-primary text-white hover:bg-primary/90 shadow-md"
                          : "text-gray-600 border-gray-200 hover:bg-white hover:text-primary hover:border-primary"
                      }`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 border-gray-300 hover:bg-white hover:text-primary disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <DepositActionModal
        isOpen={isDetailsModalOpen}
        onClose={() => toggleDetailsModal(false)}
        data={{
          ...depositList?.find((item) => item.Id === selectedDeposit?.Id),
          ...selectedDeposit,
        }}
        onApprove={handleApprove}
        handleRejectSubmit={handleRejectSubmit}
        actionLoading={actionLoading}
        detailsLoading={detailsLoading}
        loading={loading}
      />
    </div>
  );
};

export default DepositApproval;
