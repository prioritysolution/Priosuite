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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
    const typeLower = type?.toLowerCase() || "";
    if (typeLower.includes("receipt")) return "success";
    if (typeLower.includes("payment")) return "destructive";
    return "secondary";
  };

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <div className="relative w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block w-72" />
          <h2 className="text-2xl font-semibold text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            {t("depositApproval.depositApproval")}
          </h2>

          <div className="relative w-full sm:w-72 shadow-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handlePageChange(1);
              }}
              className="pl-10 bg-white border-gray-200 focus:border-primary focus:ring-primary h-10"
              placeholder={t("depositApproval.searchPlaceholder")}
            />
          </div>
        </div>

        <div className="w-full flex-1 min-h-0 flex flex-col border border-primary rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto custom-scrollbar flex-1">
            <Table>
              <TableHeader className="bg-background z-10">
                <TableRow className="bg-gray-100">
                  <TableHead className="w-[50px] font-semibold">
                    {t("common.sl")}
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    {t("depositApproval.transDate")}
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    {t("depositApproval.queueNo")}
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    {t("depositApproval.appAccNo")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("depositApproval.particulars")}
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    {t("depositApproval.type")}
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    {t("depositApproval.enteredBy")}
                  </TableHead>
                  <TableHead className="font-semibold whitespace-nowrap">
                    {t("depositApproval.enteredOn")}
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    {t("common.action")}
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
                  depositList.map((item, index) => {
                    const serialNo =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <TableRow
                        key={`${item.Id || "deposit"}-${index}`}
                        className="hover:bg-gray-50/50"
                      >
                        <TableCell>{serialNo}</TableCell>

                        <TableCell className="whitespace-nowrap">
                          {formatDate(item.Trans_Date)}
                        </TableCell>

                        <TableCell>
                          {item.Queue_No || "—"}
                        </TableCell>

                        <TableCell className="font-medium">
                          {item.Appl_No || item.Account_No || t("common.notAvailable")}
                        </TableCell>

                        <TableCell className="max-w-[250px]">
                          <div
                            className="truncate"
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
                            {item.Vouch_Type || t("depositApproval.unknown")}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {item.Entred_By || "—"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap">
                          {item.Entred_On || "—"}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => handleView(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-32 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 text-gray-300" />
                        <p>{t("depositApproval.noPendingApprovals")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && totalPages > 0 && (
            <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50/50">
              <div className="text-sm text-gray-500">
                {t("common.showing")}{" "}
                {depositList.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                {t("common.to")}{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                {t("common.of")} {totalItems} {t("common.entries")}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 border-gray-300"
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
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs font-medium ${
                          currentPage === pageNum
                            ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                            : "text-gray-600 border-gray-300 hover:bg-gray-100"
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
                  className="h-8 w-8 p-0 border-gray-300"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

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
    </div>
  );
};

export default DepositApproval;
