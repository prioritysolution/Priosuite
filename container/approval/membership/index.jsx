"use client";

import React from "react";
import { formatDate } from "@/utils/formatDate";
import { useMembershipApproval } from "./Hooks";
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
import { Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MembershipActionModal from "@/components/approval/membership/MembershipActionModal";
import Spinner from "@/common/loader/Spinner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
    <div className="space-y-5 p-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-primary pl-3">
          {t("membershipApproval.membershipApproval")}
        </h2>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              paginate(1);
            }}
            className="pl-10 border-primary/20 focus-visible:ring-primary"
            placeholder={t("membershipApproval.searchPlaceholder")}
          />
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow className="hover:bg-primary">
                <TableHead className="w-[50px] text-white font-bold">
                  {t("common.sl")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.transactionDate")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.queueNo")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.particulars")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.voucherType")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.enteredBy")}
                </TableHead>
                <TableHead className="text-white font-bold">
                  {t("membershipApproval.enteredOn")}
                </TableHead>
                <TableHead className="text-right text-white font-bold text-center">
                  {t("common.action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
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
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium">{serialNo}</TableCell>
                      <TableCell>
                        {formatDate(item.Trans_Date)}
                      </TableCell>
                      <TableCell>{item.Queue_No || t("common.notAvailable")}</TableCell>
                      <TableCell
                        className="max-w-[200px] truncate font-medium text-gray-700"
                        title={item.Particular}
                      >
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
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                          onClick={() => handleView(item)}
                        >
                          <Eye className="w-4 h-4 mr-2" /> {t("common.view")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
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

       
        {totalPages > 1 && (
          <div className="p-4 border-t bg-gray-50 flex justify-end">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => paginate(i + 1)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages && paginate(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>

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
  );
};

export default MembershipApproval;