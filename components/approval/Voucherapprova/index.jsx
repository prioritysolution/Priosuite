"use client";

import React from "react";
import { formatDate } from "@/utils/formatDate";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { premiumFieldTrigger } from "@/common/formFields/fieldStyles";

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
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <div className="relative w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block w-64" />
          <h2 className="text-2xl font-semibold text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
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

        <div className="w-full flex-1 min-h-0 flex flex-col border border-primary rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto custom-scrollbar flex-1">
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
                    const serialNo =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50/50"
                      >
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
                            type="button"
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
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-primary/30 bg-gray-50">
              <div className="text-sm text-muted-foreground">
                {t("common.showing")}{" "}
                {kycList.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                {t("common.to")}{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                {t("common.of")} {totalItems} {t("common.entries")}
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
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

                    const isActive = currentPage === pageNum;

                    return (
                      <Button
                        type="button"
                        key={pageNum}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 text-xs font-medium",
                          isActive
                            ? "bg-primary text-white hover:bg-primary/90 shadow-sm"
                            : "text-slate-600 bg-white hover:bg-gray-100",
                        )}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

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
    </div>
  );
};

export default VoucherapprovaComponent;
