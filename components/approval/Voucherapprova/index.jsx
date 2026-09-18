"use client";

import React from "react";
import { formatDate } from "@/utils/formatDate";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "@/common/loader/Spinner";
import VoucherActionModal from "./VoucherActionModal";
import { Input } from "@/components/ui/input";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { useTranslation } from "react-i18next";

const VoucherapprovaComponent = ({
  kycList,
  loading,
  openModal,
  setOpenModal,
  handleView,
  selectedApplication,
  selectedDetails,
  detailsLoading,
  onApproveReject,
  searchTerm,
  setSearchTerm,
  currentPage,
  totalPages,
  paginate,
  totalItems,
  itemsPerPage,
  successMessageText,
  handleCloseSuccessMessage,
  showSuccessModal,
  orgId,
  branchId,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 space-y-6 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">
          {t("voucherApproval.voucherApproval")}
        </h2>
        <div className="relative w-full sm:w-auto flex items-center">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              paginate(1);
            }}
            className="w-full sm:w-64 pl-10 bg-white border-gray-300 focus:border-primary"
            placeholder={t("voucherApproval.searchPlaceholder")}
          />
        </div>
      </div>

      <Card className="rounded-lg shadow-sm border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-background z-10">
              <TableRow className="bg-gray-100">
                <TableHead className="w-[50px] font-semibold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("voucherApproval.queueNo")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("voucherApproval.transactionDate")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("voucherApproval.type")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.particulars")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("common.amount")}
                </TableHead>
                <TableHead className="text-right font-semibold">
                  {t("common.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex justify-center items-center h-full w-full">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : kycList && kycList.length > 0 ? (
                kycList.map((item, index) => {
                  const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <TableRow key={index} className="hover:bg-gray-50/50">
                      <TableCell>{serialNo}</TableCell>
                      <TableCell className="font-medium">
                        {item.Queue_No || "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(item.Trans_Date)}</TableCell>
                      <TableCell>{item.Type || "N/A"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {item.Particular || "N/A"}
                      </TableCell>
                      <TableCell>{item.Amount || "0.00"}</TableCell>
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
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-gray-300" />
                      <p>{t("voucherApproval.noPendingApprovals")}</p>
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
              {kycList.length > 0
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
                onClick={() => paginate(currentPage - 1)}
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
                      className={`h-8 w-8 p-0 text-xs font-medium ${
                        currentPage === pageNum
                          ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                          : "text-gray-600 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => paginate(pageNum)}
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
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {openModal && (
        <VoucherActionModal
          open={openModal}
          setOpen={setOpenModal}
          selectedApplication={selectedApplication}
          selectedDetails={selectedDetails}
          detailsLoading={detailsLoading}
          onApproveReject={onApproveReject}
          loading={loading}
        />
      )}
      <SuccessMessage
        showSuccessMessage={showSuccessModal}
        successMessage={successMessageText}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};

export default VoucherapprovaComponent;
