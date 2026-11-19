"use client";

import React from "react";
import { formatDate } from "@/utils/formatDate";
import { useMembershipApproval } from "./Hooks";
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
import { Input } from "@/components/ui/input";
import MembershipActionModal from "@/components/approval/membership/MembershipActionModal";
import Spinner from "@/common/loader/Spinner";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { useTranslation } from "react-i18next"; 

const MembershipApproval = () => {
  const { t } = useTranslation();

  const {
    membershipList,
    loading,
    openModal,
    setOpenModal,
    handleView,
    selectedApplication,
    detailsLoading,
    onApproveReject,
    searchTerm,
    setSearchTerm,
    currentPage,
    paginate,
    totalPages,
    totalItems,
    itemsPerPage,
   
    showSuccessModal,
    successMessageText,
    handleCloseSuccessMessage,
  } = useMembershipApproval();


  const getVoucherTypeStyle = (type) => {
    const lowerType = type?.toLowerCase() || "";

    if (lowerType.includes("payment")) {
      return "text-red-600 bg-red-100 border-red-200";
    } else if (lowerType.includes("receipt")) {
      return "text-green-600 bg-green-100 border-green-200";
    } else if (lowerType.includes("transfer")) {
      return "text-blue-600 bg-blue-100 border-blue-200";
    }
    return "text-gray-600 bg-gray-100 border-gray-200";
  };

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        {/* Header & Search */}
        <div className="relative w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="hidden sm:block w-64" />
          <h2 className="text-2xl font-semibold text-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            {t("membershipApproval.membershipApproval")}
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
              placeholder={t("membershipApproval.searchPlaceholder")}
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
                    {t("membershipApproval.transactionDate")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("membershipApproval.transactionType")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("membershipApproval.queueNo")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("membershipApproval.particulars")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("membershipApproval.voucherType")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("membershipApproval.enteredBy")}
                  </TableHead>
                  <TableHead className="font-semibold">
                    {t("membershipApproval.enteredOn")}
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
                ) : membershipList && membershipList.length > 0 ? (
                  membershipList.map((item, index) => {
                    const serialNo = (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <TableRow
                        key={index}
                        className="hover:bg-gray-50/50"
                      >
                        <TableCell className="font-medium">{serialNo}</TableCell>
                        <TableCell>
                          {formatDate(item.Trans_Date)}
                        </TableCell>
                        <TableCell>{item.Trans_Type || t("common.notAvailable")}</TableCell>
                        <TableCell>{item.Queue_No || t("common.notAvailable")}</TableCell>
                        <TableCell>
                          {item.Particular || t("common.notAvailable")}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${getVoucherTypeStyle(
                              item.Vouch_Type,
                            )}`}
                          >
                            {item.Vouch_Type || t("common.notAvailable")}
                          </span>
                        </TableCell>

                        <TableCell>{item.Entred_By || t("common.notAvailable")}</TableCell>
                        <TableCell className="text-xs text-gray-500">
                          {formatDate(item.Entred_On)}
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
                        <p>{t("membershipApproval.noPendingApprovals")}</p>
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
                {membershipList.length > 0
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
        </div>

        {/* Action Modal */}
        {openModal && (
          <MembershipActionModal
            open={openModal}
            setOpen={setOpenModal}
            selectedApplication={selectedApplication}
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

export default MembershipApproval;