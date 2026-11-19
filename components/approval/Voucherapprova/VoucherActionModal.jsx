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
import { Ban, CheckCircle2, AlertTriangle, Loader2, XCircle } from "lucide-react";
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
import { cn } from "@/lib/utils";
import {
  premiumFieldShell,
  premiumFieldTrigger,
} from "@/common/formFields/fieldStyles";

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
        <Label className="text-sm font-medium text-foreground">{label}</Label>
        <div
          className={premiumFieldTrigger({
            readOnly: true,
            className: "overflow-hidden truncate",
          })}
        >
          {displayValue !== null &&
          displayValue !== undefined &&
          displayValue !== ""
            ? String(displayValue)
            : "N/A"}
        </div>
      </div>
    );
  };

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

  const voucherDetails = selectedDetails?.voucher_details || [];
  const totalDebit = voucherDetails.reduce(
    (acc, curr) =>
      curr.Trans_Type === "D" ? acc + Number(curr.Amount || 0) : acc,
    0,
  );
  const totalCredit = voucherDetails.reduce(
    (acc, curr) =>
      curr.Trans_Type === "C" ? acc + Number(curr.Amount || 0) : acc,
    0,
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
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] max-w-[90vw] lg:max-w-4xl h-auto max-h-[90dvh] flex flex-col p-0 overflow-hidden rounded-xl border border-[#c8d5e6] shadow-[0_8px_30px_rgba(15,40,80,0.12)]"
        >
          <DialogHeader className="p-4 sm:p-5 border-b border-[#d0dae8] bg-gradient-to-b from-[#f4f7fb] to-white flex flex-row items-center justify-between space-y-0 shrink-0">
            <div className="flex flex-col gap-1 pr-4">
              <DialogTitle className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                {t("voucherApproval.voucherApproval")}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">
                  {t("voucherApproval.queueNoLabel")}{" "}
                  {selectedApplication.Queue_No || "N/A"}
                </span>
                <span className="h-4 w-px bg-[#c8d5e6]" />
                <span className="inline-flex items-center rounded-md bg-[#00264D] px-2.5 py-0.5 text-xs font-semibold text-white">
                  {selectedApplication.Type || "N/A"}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-500 hover:bg-gray-100 h-9"
              onClick={() => setOpen(false)}
              disabled={loading || detailsLoading}
            >
              <XCircle className="w-4 h-4 mr-2" /> {t("common.buttons.close")}
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-[#f7f9fc] p-4 sm:p-5 space-y-4 max-h-[65vh]">
            <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4 bg-white">
              <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                  {t("voucherApproval.voucherApproval")}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
                {renderField(
                  t("voucherApproval.transactionDate"),
                  formatDate(selectedApplication.Trans_Date),
                )}
                {renderField(
                  t("voucherApproval.queueNo"),
                  selectedApplication.Queue_No,
                )}
                {renderField(
                  t("voucherApproval.type"),
                  selectedApplication.Type,
                )}
                {renderField(
                  t("voucherApproval.amount"),
                  selectedApplication.Amount,
                )}
                <div className="sm:col-span-2 md:col-span-3">
                  {renderField(
                    t("voucherApproval.particulars"),
                    selectedApplication.Particular,
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4 bg-white">
              <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                  {t("voucherApproval.voucherDetails")}
                </h3>
              </div>
              {detailsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#00264D]" />
                </div>
              ) : voucherDetails.length > 0 ? (
                <div className="overflow-x-auto border border-primary rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#eef2f7] hover:bg-[#eef2f7]">
                        <TableHead className="w-[50px] font-semibold text-foreground">
                          {t("common.sl")}
                        </TableHead>
                        <TableHead className="font-semibold text-foreground">
                          {t("voucherApproval.ledgerName")}
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-right">
                          {t("voucherApproval.debit")}
                        </TableHead>
                        <TableHead className="font-semibold text-foreground text-right">
                          {t("voucherApproval.credit")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {voucherDetails.map((item, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-[#f4f7fb]/80"
                        >
                          <TableCell className="font-medium text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.Ledger_Name || "N/A"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {item.Trans_Type === "D"
                              ? Number(item.Amount || 0).toFixed(2)
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {item.Trans_Type === "C"
                              ? Number(item.Amount || 0).toFixed(2)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-[#eef2f7]/70 font-bold border-t border-primary/40">
                        <TableCell
                          colSpan={2}
                          className="text-left text-foreground"
                        >
                          {t("voucherApproval.total")}
                        </TableCell>
                        <TableCell className="text-right text-[#00264D]">
                          {totalDebit.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-[#00264D]">
                          {totalCredit.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("voucherApproval.noVoucherDetails")}
                </p>
              )}
            </div>

            {!detailsLoading && Object.keys(groupedSubledgers).length > 0 && (
              <div className="space-y-4">
                {Object.entries(groupedSubledgers).map(([ledgerName, list]) => (
                  <div
                    key={ledgerName}
                    className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4 bg-white"
                  >
                    <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                      <h3 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                        {t("voucherApproval.subledgerList", { name: ledgerName })}
                      </h3>
                    </div>
                    <div className="overflow-x-auto border border-primary rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#eef2f7] hover:bg-[#eef2f7]">
                            <TableHead className="w-[50px] font-semibold text-foreground">
                              {t("common.sl")}
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              {t("voucherApproval.accountNo")}
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              {t("voucherApproval.name")}
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              {t("voucherApproval.type")}
                            </TableHead>
                            <TableHead className="font-semibold text-foreground text-right">
                              {t("common.amount")}
                            </TableHead>
                            <TableHead className="font-semibold text-foreground">
                              {t("voucherApproval.remarks")}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {list.map((subItem, index) => (
                            <TableRow
                              key={index}
                              className="hover:bg-[#f4f7fb]/80"
                            >
                              <TableCell className="font-medium text-muted-foreground">
                                {index + 1}
                              </TableCell>
                              <TableCell className="font-medium">
                                {subItem.CIF_No || "N/A"}
                              </TableCell>
                              <TableCell className="font-medium">
                                {subItem.Full_Name || "N/A"}
                              </TableCell>
                              <TableCell className="text-muted-foreground font-medium">
                                {subItem.Trans_Type || "N/A"}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {Number(subItem.Amount || 0).toFixed(2)}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
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

          <div className="p-4 sm:p-5 border-t border-[#d0dae8] bg-white flex justify-end items-center shrink-0">
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                type="button"
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-8 font-semibold min-w-[120px] w-full sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={loading || detailsLoading}
              >
                <Ban className="w-4 h-4 mr-2" /> {t("voucherApproval.reject")}
              </Button>
              <Button
                type="button"
                className="bg-[#00264D] hover:bg-[#001a38] text-white px-8 font-semibold min-w-[120px] w-full sm:w-auto"
                onClick={() => onApproveReject(1)}
                disabled={loading || detailsLoading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />{" "}
                {t("voucherApproval.approve")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[500px] z-[9999] rounded-xl border border-[#c8d5e6] p-0 overflow-hidden gap-0">
          <DialogHeader className="p-5 border-b border-[#d0dae8] bg-gradient-to-b from-[#f4f7fb] to-white">
            <DialogTitle className="flex items-center gap-2 text-[#991B1B]">
              <AlertTriangle className="h-5 w-5" />
              {t("voucherApproval.rejectVoucher")}
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 bg-[#f7f9fc]">
            <Label
              htmlFor="remarks"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {t("voucherApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks"
              placeholder={t("voucherApproval.enterRejectionReason")}
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className={cn(
                premiumFieldShell({
                  className:
                    "min-h-[100px] px-3.5 py-2.5 text-sm font-medium resize-none focus-visible:outline-none focus-visible:ring-0",
                }),
              )}
            />
          </div>
          <DialogFooter className="p-5 pt-0 bg-[#f7f9fc] gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-[#d0dae8] bg-white hover:bg-[#eef2f7]"
              onClick={() => setShowRejectModal(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white"
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
