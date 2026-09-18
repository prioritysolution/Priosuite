import React, { useState } from "react";
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
import {
  XCircle,
  CheckCircle2,
  Ban,
  AlertTriangle,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import Spinner from "@/common/loader/Spinner";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const DepositActionModal = ({
  isOpen,
  onClose,
  data,
  onApprove,
  handleRejectSubmit,
  actionLoading,
  detailsLoading,
  loading,
}) => {
  const { t } = useTranslation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const appData = Array.isArray(data) ? data[0] : data;
  const isPayment = appData?.Vouch_Type === "Payment";

  const parseJSON = (jsonString) => {
    try {
      if (!jsonString) return null;
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch (e) {
      return null;
    }
  };

  const jointHolders = parseJSON(appData?.Joint_Details);
  const nomineeDetails = parseJSON(appData?.Nom_Details);

  const getMemberName = () => {
    if (appData?.Member_Name) return appData.Member_Name;
    if (appData?.Full_Name) return appData.Full_Name;
    if (Array.isArray(jointHolders) && jointHolders.length > 0) {
      return jointHolders[0].Full_Name;
    }
    return t("depositApproval.unknownMember");
  };

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error(t("depositApproval.pleaseEnterRejectionRemarks"));
      return;
    }
    handleRejectSubmit({ remarks: rejectRemarks });
    setShowRejectModal(false);
    setRejectRemarks("");
  };

  const isFalsyOrZero = (val) => {
    if (val === null || val === undefined || val === "") return true;
    if (val === 0 || val === "0" || val === "0.00") return true;
    return false;
  };

  const renderSmartField = (
    label,
    value,
    isCurrency = false,
    isDate = false,
    fullWidth = false,
    appendSymbol = ""
  ) => {
    if (isFalsyOrZero(value)) return null;

    let displayValue = value;

    if (isCurrency) {
      const numVal = parseFloat(value);
      displayValue = !isNaN(numVal)
        ? `₹ ${numVal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
        : value;
    } else if (isDate) {
      try {
        displayValue = format(parseISO(value), "dd-MM-yyyy");
      } catch (e) {
        displayValue = value;
      }
    }

    if (appendSymbol) {
      displayValue = `${displayValue}${appendSymbol}`;
    }

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "col-span-full")}>
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </Label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 h-10 flex items-center overflow-hidden font-medium whitespace-nowrap shadow-sm">
          {displayValue}
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title }) => (
    <div className="col-span-full pb-2 border-b border-gray-100 mt-4 mb-2 flex items-center gap-2">
      <div className="h-4 w-1 bg-primary rounded-full"></div>
      <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
        {title}
      </h4>
    </div>
  );

  const renderAmountFields = () => {
    const hasInst = !isFalsyOrZero(appData?.Installment_Amount);
    const hasMand = !isFalsyOrZero(appData?.Mandatory_Amount);

    if (hasInst) {
      return renderSmartField(t("depositApproval.installmentAmt"), appData?.Installment_Amount, true);
    }
    if (hasMand) {
      return renderSmartField(t("depositApproval.mandatoryAmt"), appData?.Mandatory_Amount, true);
    }
    return null;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[95vw] lg:max-w-7xl h-[min(92dvh,900px)] sm:h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-[#F8FAFC]">
          <DialogHeader className="p-3 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0 sticky top-0 z-50">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
                {t("depositApproval.approvalPortal")}
              </DialogTitle>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                  {t("depositApproval.appAccNoLabel")}{" "}
                  {appData?.Appl_No || appData?.Account_No || t("common.notAvailable")}
                </span>
                <span className="h-4 w-px bg-gray-300" />
                <span className="font-semibold text-primary flex items-center gap-1">
                  <User className="w-4 h-4" /> {getMemberName()}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-500 hover:bg-gray-100 h-9"
              onClick={() => onClose(false)}
              disabled={loading || detailsLoading || actionLoading}
            >
              <XCircle className="w-4 h-4 mr-2" /> {t("depositApproval.close")}
            </Button>
          </DialogHeader>

          <ScrollArea className="flex-1 bg-[#F8FAFC]">
            {loading || detailsLoading ? (
              <div className="flex justify-center items-center h-[60vh] w-full">
                <Spinner />
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-5 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
                  
                  {isPayment && (
                    <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t("depositApproval.transactionAmount")}</span>
                        <span className="text-3xl font-black text-gray-800">
                          ₹ {Number(appData?.Amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      {!isFalsyOrZero(appData?.Avail_Balance) && (
                        <div className="flex flex-col gap-1 md:items-end">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{t("depositApproval.availableBalance")}</span>
                          <span className="text-2xl font-bold text-gray-700">
                            ₹ {Number(appData?.Avail_Balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <SectionHeader title={t("depositApproval.applicationDetails")} />
                  {renderSmartField(t("depositApproval.transactionDate"), appData?.Trans_Date, false, true)}
                  {renderSmartField(t("depositApproval.queueNo"), appData?.Queue_No)}
                  {renderSmartField(t("depositApproval.voucherType"), appData?.Vouch_Type)}
                  {renderSmartField(t("depositApproval.enteredBy"), appData?.Entred_By)}
                  {renderSmartField(t("depositApproval.enteredOn"), appData?.Entred_On)}

                  <SectionHeader title={t("depositApproval.accountInformation")} />
                  {renderSmartField(t("depositApproval.referenceAcNo"), appData?.Ref_Ac_No)}
                  {renderSmartField(t("depositApproval.ledgerFolio"), appData?.Ledg_Folio)}
                  {renderSmartField(t("depositApproval.operationMode"), appData?.Oper_Mode)}
                  {renderSmartField(t("depositApproval.cbsAccountNo"), appData?.CBS_Ac_No)}

                  <SectionHeader title={t("depositApproval.productFinancials")} />
                  {renderSmartField(t("depositApproval.productName"), appData?.Prod_Name || appData?.Particular, false, false, true)}
                  {renderSmartField(t("depositApproval.productType"), appData?.Product_Type)}
                  {renderSmartField(t("depositApproval.chequeNo"), appData?.Cheque_No)}
                  {!isPayment && renderSmartField(t("depositApproval.amount"), appData?.Amount, true)}
                  {renderSmartField(t("depositApproval.interestRateRoi"), appData?.ROI, false, false, false, "%")}
                  {renderAmountFields()}

                  {(!isFalsyOrZero(appData?.Duration) || !isFalsyOrZero(appData?.Maturity_Date)) && (
                    <>
                      <SectionHeader title={t("depositApproval.termMaturityDetails")} />
                      {renderSmartField(
                        t("depositApproval.duration"),
                        !isFalsyOrZero(appData?.Duration)
                          ? `${appData?.Duration} ${appData?.Dur_unit || ""}`
                          : null
                      )}
                      {renderSmartField(t("depositApproval.maturityDate"), appData?.Maturity_Date, false, true)}
                      {renderSmartField(t("depositApproval.maturityAmount"), appData?.Maturity_Amount, true)}
                    </>
                  )}

                  {(!isFalsyOrZero(appData?.Ecs_Mode) || !isFalsyOrZero(appData?.Payout_Mode)) && (
                    <>
                      <SectionHeader title={t("depositApproval.paymentConfiguration")} />
                      {renderSmartField(t("depositApproval.ecsMode"), appData?.Ecs_Mode)}
                      {renderSmartField(t("depositApproval.payoutMode"), appData?.Payout_Mode)}
                    </>
                  )}

                  {renderSmartField(t("depositApproval.particulars"), appData?.Particular, false, false, true)}

                  {jointHolders && jointHolders.length > 0 && (
                    <>
                      <SectionHeader title={t("depositApproval.jointAccountHolders")} />
                      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        {jointHolders.map((holder, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{holder.Full_Name}</p>
                              <p className="text-xs text-gray-500">{t("depositApproval.relation")}{" "}
                              {holder.Relation || t("common.notAvailable")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {nomineeDetails && nomineeDetails.length > 0 && (
                    <>
                      <SectionHeader title={t("depositApproval.nomineeInformation")} />
                      <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {nomineeDetails.map((nom, idx) => (
                          <div key={idx} className="p-4 bg-orange-50/30 rounded-lg border border-orange-100 flex items-start gap-4">
                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold mt-1">
                              {idx + 1}
                            </div>
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {renderSmartField(t("depositApproval.nomineeName"), nom.Nom_Name || nom.Nominee_Name)}
                              {renderSmartField(t("depositApproval.relationLabel"), nom.Nom_Rel || nom.Relation)}
                              {renderSmartField(t("depositApproval.ageDob"), nom.Nom_Age || nom.DOB)}
                              {renderSmartField(t("depositApproval.sharePercentage"), nom.Nom_Perc || nom.Percentage, false, false, false, "%")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="p-3 sm:p-6 border-t bg-white flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-50">
            <div className="text-xs text-gray-400 font-medium">
              {t("depositApproval.reviewBeforeApprove")}
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-8 font-bold min-w-[120px] h-10 transition-all shadow-sm w-full sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={actionLoading || loading || detailsLoading}
              >
                <Ban className="w-4 h-4 mr-2" /> {t("depositApproval.reject")}
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8 font-bold min-w-[120px] h-10 transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
                onClick={onApprove}
                disabled={actionLoading || loading || detailsLoading}
              >
                {actionLoading ? (
                  <ClipLoader size={20} color="#ffffff" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" /> {t("depositApproval.approve")}
                  </>
                )}
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
              {t("depositApproval.rejectApplication")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="remarks" className="mb-2 block text-sm font-medium text-gray-700">
              {t("depositApproval.rejectionRemarks")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks"
              placeholder={t("depositApproval.enterRejectionReason")}
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="min-h-[100px] focus-visible:ring-red-500 bg-red-50/20"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
              {t("common.cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleRejectConfirm}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ClipLoader size={18} color="#ffffff" />
              ) : (
                t("depositApproval.confirmRejection")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepositActionModal;