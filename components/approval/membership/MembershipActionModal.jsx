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
import { CheckCircle2, Ban, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/common/loader/Spinner";
import { useTranslation } from "react-i18next";

const MembershipActionModal = ({
  open,
  setOpen,
  selectedApplication,
  onApproveReject,
  detailsLoading,
  loading,
}) => {
  const { t } = useTranslation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error(t("membershipApproval.pleaseEnterRejectionRemarks"));
      return;
    }
    onApproveReject(2, rejectRemarks);
    setShowRejectModal(false);
    setRejectRemarks("");
  };

  // Helper function to check if value is valid (not null/undefined/empty)
  const isValid = (val) => val !== null && val !== undefined && val !== "";

  // Helper function to check if value is effectively zero
  const isZero = (val) => {
    if (!isValid(val)) return true;
    return Number(val) === 0;
  };

  const DetailRow = ({ label, value, isCurrency = false }) => {
    if (!isValid(value)) return null;

    return (
      <div className="flex flex-col gap-1 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <span
          className={`text-sm font-medium ${
            isCurrency ? "text-green-600 font-bold" : "text-gray-900"
          } break-words`}
        >
          {value}
        </span>
      </div>
    );
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setRejectRemarks("");
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] max-w-5xl h-[min(92dvh,900px)] sm:h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-3 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-xl font-bold text-gray-800 tracking-tight">
                {t("membershipApproval.transactionApproval")}
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {selectedApplication?.Queue_No && (
                  <>
                    <span className="font-medium">{t("membershipApproval.queue")}</span>
                    <span className="font-semibold text-primary">
                      {selectedApplication.Queue_No}
                    </span>
                  </>
                )}

                {selectedApplication?.Queue_No &&
                  selectedApplication?.Vouch_Type && (
                    <span className="h-4 w-px bg-gray-300 mx-2" />
                  )}

                {selectedApplication?.Vouch_Type && (
                  <>
                    <span className="font-medium">{t("membershipApproval.type")}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedApplication.Vouch_Type}
                    </span>
                  </>
                )}
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 bg-[#F8FAFC]">
            {detailsLoading || loading ? (
              <div className="h-full flex items-center justify-center py-16 gap-2 text-primary/80">
                <Spinner />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* 1. Member Information (Now on Top) */}
                {(selectedApplication?.Full_Name ||
                  selectedApplication?.Adm_No ||
                  selectedApplication?.Relation_Name) && (
                  <div className="border-b pb-4 last:border-0">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-primary pl-2">
                      {t("membershipApproval.memberInformation")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DetailRow
                        label={t("membershipApproval.fullName")}
                        value={selectedApplication?.Full_Name}
                      />
                      <DetailRow
                        label={t("membershipApproval.admissionNo")}
                        value={selectedApplication?.Adm_No}
                      />
                      <DetailRow
                        label={t("membershipApproval.relationName")}
                        value={selectedApplication?.Relation_Name}
                      />
                    </div>
                  </div>
                )}

                {/* 2. Transaction Overview (Moved to 2nd position) */}
                <div className="border-b pb-4 last:border-0">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-blue-500 pl-2">
                    {t("membershipApproval.transactionOverview")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailRow
                      label={t("membershipApproval.particulars")}
                      value={selectedApplication?.Particular}
                    />
                    <DetailRow
                      label={t("membershipApproval.transactionType")}
                      value={selectedApplication?.Trans_Type}
                    />
                    <DetailRow
                      label={t("membershipApproval.transactionDate")}
                      value={formatDate(selectedApplication?.Trans_Date)}
                    />
                    {/* Amount placed right after Transaction Date */}
                    <DetailRow
                      label={t("membershipApproval.totalAmount")}
                      value={
                        selectedApplication?.Tot_Amt ||
                        selectedApplication?.Amount
                      }
                      isCurrency={true}
                    />
                    <DetailRow
                      label={t("membershipApproval.transferOn")}
                      value={selectedApplication?.Trf_On}
                    />
                  </div>
                </div>

                {/* 3. Share & Fees Details (Conditionally Rendered) */}
                {/* Only render section if at least one non-zero item exists */}
                {(!isZero(selectedApplication?.No_Share) ||
                  !isZero(selectedApplication?.Share_Rate) ||
                  !isZero(selectedApplication?.Adm_Fees)) && (
                  <div className="border-b pb-4 last:border-0">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-green-500 pl-2">
                      {t("membershipApproval.shareFinancialDetails")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {!isZero(selectedApplication?.No_Share) && (
                        <DetailRow
                          label={t("membershipApproval.noOfShares")}
                          value={selectedApplication?.No_Share}
                        />
                      )}
                      {!isZero(selectedApplication?.Share_Rate) && (
                        <DetailRow
                          label={t("membershipApproval.shareRate")}
                          value={selectedApplication?.Share_Rate}
                          isCurrency={true}
                        />
                      )}
                      {!isZero(selectedApplication?.Adm_Fees) && (
                        <DetailRow
                          label={t("membershipApproval.admissionFees")}
                          value={selectedApplication?.Adm_Fees}
                          isCurrency={true}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* 4. System Info */}
                <div className="pb-2">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 border-l-4 border-gray-400 pl-2">
                    {t("membershipApproval.systemInformation")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailRow
                      label={t("membershipApproval.enteredBy")}
                      value={selectedApplication?.Entred_By}
                    />
                    <DetailRow
                      label={t("membershipApproval.enteredOn")}
                      value={selectedApplication?.Entred_On}
                    />
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="p-3 sm:p-6 border-t bg-white flex justify-end items-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <Button
              className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-6 font-bold transition-all min-w-[120px] w-full sm:w-auto"
              onClick={() => setShowRejectModal(true)}
              disabled={detailsLoading || loading}
            >
              <Ban className="w-4 h-4 mr-2" /> {t("membershipApproval.reject")}
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-6 font-bold transition-all min-w-[120px] w-full sm:w-auto"
              onClick={() => onApproveReject(1)}
              disabled={detailsLoading || loading}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> {t("membershipApproval.approve")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-md border-red-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              {t("membershipApproval.confirmRejection")}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <p className="text-sm text-gray-600">
              {t("membershipApproval.rejectConfirmMessage")}
            </p>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                {t("membershipApproval.rejectionRemarks")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder={t("membershipApproval.enterRejectionReason")}
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                className="min-h-[100px] resize-none focus:ring-red-500"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRejectConfirm}
            >
              {t("membershipApproval.confirmReject")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembershipActionModal;
