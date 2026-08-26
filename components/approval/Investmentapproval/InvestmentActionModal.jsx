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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Ban, CheckCircle2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/common/loader/Spinner";

const InvestmentActionModal = ({
  open,
  setOpen,
  selectedApplication,
  onApproveReject,
  loading,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  if (!selectedApplication) return null;

  const type = Number(selectedApplication.Type); // 0, 1, 2

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error("Please enter remarks for rejection.");
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
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[90vw] lg:max-w-4xl h-auto max-h-[85dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-3 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Investment Approval
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">
                  Queue No: {selectedApplication.Queue_No || "N/A"}
                </span>
                <span className="h-4 w-px bg-gray-300" />
                <span className="font-semibold text-primary">
                  {selectedApplication.Type_Name ||
                    selectedApplication.Trans_Type ||
                    `Type ${type}`}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 max-h-[60vh]">
            {loading ? (
              <div className="flex justify-center items-center h-64 w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                {type === 0 && (
                  <>
                    {renderField(
                      "Investment Type",
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField("Bank Name", selectedApplication.Bank_Name)}
                    {renderField("Account No", selectedApplication.Account_No)}
                    {renderField("Opening Date", selectedApplication.Open_Date)}
                    {renderField(
                      "Investment Amount",
                      selectedApplication.Invest_Amt ||
                        selectedApplication.Amount,
                    )}
                    {renderField(
                      "ROI",
                      selectedApplication.ROI || selectedApplication.Roi,
                    )}
                    {renderField(
                      "Duration (Month)",
                      selectedApplication.Duration ||
                        selectedApplication.Duration_Month,
                    )}
                    {renderField(
                      "Maturity Date",
                      selectedApplication.Mature_Date,
                    )}
                    {renderField(
                      "Maturity Value",
                      selectedApplication.Mature_Val,
                    )}
                    {renderField(
                      "Voucher Date",
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                    )}
                    {renderField(
                      "Transaction Mode",
                      selectedApplication.Trans_Mode,
                    )}
                    {String(selectedApplication.Bank_No) !== "" &&
                      selectedApplication.Bank_No !== null &&
                      renderField(
                        "From Bank Account",
                        selectedApplication.Bank_No,
                      )}
                  </>
                )}

                {type === 1 && (
                  <>
                    {renderField(
                      "Investment Type",
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField("Bank Name", selectedApplication.Bank_Name)}
                    {renderField("Account No", selectedApplication.Account_No)}
                    {renderField(
                      "Opening Date",
                      selectedApplication.Opening_Date,
                    )}
                    {renderField(
                      "Investment Amount",
                      selectedApplication.Invest_Amt ||
                        selectedApplication.Amount,
                    )}
                    {renderField(
                      "ROI",
                      selectedApplication.ROI || selectedApplication.Roi,
                    )}
                    {renderField(
                      "Duration (Month)",
                      selectedApplication.Duration ||
                        selectedApplication.Duration_Month,
                    )}
                    {renderField(
                      "Maturity Date",
                      selectedApplication.Maturity_Date,
                    )}
                    {renderField(
                      "Maturity Value",
                      selectedApplication.Maturity_Val ||
                        selectedApplication.Maturity_Value,
                    )}
                    {renderField(
                      "Voucher Date",
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                    )}
                  </>
                )}

                {type === 2 && (
                  <>
                    {renderField(
                      "Investment Type",
                      selectedApplication.Invest_Type ||
                        selectedApplication.Invest_Type_Name ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField("Bank Name", selectedApplication.Bank_Name)}
                    {renderField("Account No", selectedApplication.Account_No)}
                    {renderField(
                      "Transaction Type",
                      selectedApplication.Trans_Type,
                    )}
                    {renderField(
                      "Amount",
                      selectedApplication.Amount ||
                        selectedApplication.Invest_Amt,
                    )}
                    {renderField(
                      "Voucher Date",
                      selectedApplication.Trans_Date ||
                        selectedApplication.Voucher_Date,
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="p-3 sm:p-6 border-t bg-white flex justify-end items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <div className="flex gap-4 w-full sm:w-auto">
              <Button
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-8 font-bold min-w-[120px] transition-all w-full sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
              >
                <Ban className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8 font-bold min-w-[120px] transition-all w-full sm:w-auto"
                onClick={() => onApproveReject(1)}
                disabled={loading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
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
              Reject Application
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium">
              Rejection Remarks <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks"
              placeholder="Enter reason for rejection..."
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="min-h-[100px] focus-visible:ring-red-500"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRejectConfirm}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvestmentActionModal;
