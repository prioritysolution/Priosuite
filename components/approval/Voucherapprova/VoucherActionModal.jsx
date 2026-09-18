"use client";

import React, { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Ban, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const VoucherActionModal = ({
  open,
  setOpen,
  selectedApplication,
  selectedDetails,
  detailsLoading,
  onApproveReject,
  loading,
}) => {
  const { t } = useTranslation();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  if (!selectedApplication) return null;

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error(t("voucherApproval.pleaseEnterRejectionRemarks"));
      return;
    }
    onApproveReject(2, rejectRemarks);
    setShowRejectModal(false);
    setRejectRemarks("");
  };

  const renderField = (label, value) => {
    let displayValue = value;
    if (label && label.toLowerCase().includes("date")) {
      displayValue = formatDate(value);
    }
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </Label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 h-10 flex items-center overflow-hidden font-medium">
          {displayValue !== null && displayValue !== undefined && displayValue !== ""
            ? String(displayValue)
            : "N/A"}
        </div>
      </div>
    );
  };

  // Group subledger details by Ledger_Id / Ledger_Name
  const getGroupedSubledgers = () => {
    if (!selectedDetails?.subledger_details) return {};
    const grouped = {};
    selectedDetails.subledger_details.forEach((item) => {
      const ledgerName =
        item.Ledger_Name ||
        t("voucherApproval.ledgerId", { id: item.Ledger_Id });
      if (!grouped[ledgerName]) {
        grouped[ledgerName] = [];
      }
      grouped[ledgerName].push(item);
    });
    return grouped;
  };

  const groupedSubledgers = getGroupedSubledgers();

  // Calculate voucher details totals
  const voucherDetails = selectedDetails?.voucher_details || [];
  const totalDebit = voucherDetails.reduce(
    (acc, curr) =>
      curr.Trans_Type === "D" ? acc + Number(curr.Amount || 0) : acc,
    0
  );
  const totalCredit = voucherDetails.reduce(
    (acc, curr) =>
      curr.Trans_Type === "C" ? acc + Number(curr.Amount || 0) : acc,
    0
  );

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            setRejectRemarks("");
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[90vw] lg:max-w-4xl h-auto max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-3 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                {t("voucherApproval.voucherApproval")}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">
                  {t("voucherApproval.queueNoLabel")}{" "}
                  {selectedApplication.Queue_No || "N/A"}
                </span>
                <span className="h-4 w-px bg-gray-300" />
                <span className="font-semibold text-primary">
                  {selectedApplication.Type || "N/A"}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 space-y-6 max-h-[65vh]">
            {/* Voucher Header Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-5 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
              {renderField(t("voucherApproval.transactionDate"), formatDate(selectedApplication.Trans_Date))}
              {renderField(t("voucherApproval.queueNo"), selectedApplication.Queue_No)}
              {renderField(t("voucherApproval.type"), selectedApplication.Type)}
              {renderField(t("voucherApproval.amount"), selectedApplication.Amount)}
              <div className="sm:col-span-2 md:col-span-3">
                {renderField(t("voucherApproval.particulars"), selectedApplication.Particular)}
              </div>
            </div>

            {/* Voucher Details Section */}
            <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                {t("voucherApproval.voucherDetails")}
              </h3>
              {detailsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : voucherDetails.length > 0 ? (
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="w-[50px] font-semibold text-gray-700">{t("common.sl")}</TableHead>
                        <TableHead className="font-semibold text-gray-700">{t("voucherApproval.ledgerName")}</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">{t("voucherApproval.debit")}</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right">{t("voucherApproval.credit")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {voucherDetails.map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                          <TableCell className="font-medium text-gray-800">
                            {item.Ledger_Name || "N/A"}
                          </TableCell>
                          <TableCell className="text-right text-gray-800 font-medium">
                            {item.Trans_Type === "D"
                              ? Number(item.Amount || 0).toFixed(2)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right text-gray-800 font-medium">
                            {item.Trans_Type === "C"
                              ? Number(item.Amount || 0).toFixed(2)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Total Row */}
                      <TableRow className="bg-gray-50/50 font-bold border-t-2">
                        <TableCell colSpan={2} className="text-left text-gray-800">
                          {t("voucherApproval.total")}
                        </TableCell>
                        <TableCell className="text-right text-primary">
                          {totalDebit.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-primary">
                          {totalCredit.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  {t("voucherApproval.noVoucherDetails")}
                </p>
              )}
            </div>

            {/* Subledger Details Section */}
            {!detailsLoading && Object.keys(groupedSubledgers).length > 0 && (
              <div className="space-y-6">
                {Object.entries(groupedSubledgers).map(([ledgerName, list]) => (
                  <div
                    key={ledgerName}
                    className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm space-y-4"
                  >
                    <h3 className="text-md font-bold text-gray-800 border-b pb-2">
                      {t("voucherApproval.subledgerList", { name: ledgerName })}
                    </h3>
                    <div className="overflow-x-auto border rounded-lg">
                      <Table>
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="w-[50px] font-semibold text-gray-700">{t("common.sl")}</TableHead>
                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.accountNo")}</TableHead>
                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.name")}</TableHead>
                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.type")}</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-right">{t("common.amount")}</TableHead>
                            <TableHead className="font-semibold text-gray-700">{t("voucherApproval.remarks")}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {list.map((subItem, index) => (
                            <TableRow key={index} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
                              <TableCell className="font-medium text-gray-800">
                                {subItem.CIF_No || "N/A"}
                              </TableCell>
                              <TableCell className="text-gray-800 font-medium">
                                {subItem.Full_Name || "N/A"}
                              </TableCell>
                              <TableCell className="text-gray-600 font-medium">
                                {subItem.Trans_Type || "N/A"}
                              </TableCell>
                              <TableCell className="text-right text-gray-800 font-medium">
                                {Number(subItem.Amount || 0).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-gray-500 text-sm">
                                {subItem.Remarks || "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 sm:p-6 border-t bg-white flex justify-end items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <div className="flex gap-4 w-full sm:w-auto">
              <Button
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-8 font-bold min-w-[120px] transition-all w-full sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={loading || detailsLoading}
              >
                <Ban className="w-4 h-4 mr-2" /> {t("voucherApproval.reject")}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8 font-bold min-w-[120px] transition-all w-full sm:w-auto"
                onClick={() => onApproveReject(1)}
                disabled={loading || detailsLoading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> {t("voucherApproval.approve")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[500px] z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {t("voucherApproval.rejectVoucher")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              {t("voucherApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks"
              placeholder={t("voucherApproval.enterRejectionReason")}
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="min-h-[100px] focus-visible:ring-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRejectConfirm}
            >
              {t("voucherApproval.confirmRejection")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherActionModal;
