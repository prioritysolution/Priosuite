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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Ban, AlertTriangle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import Spinner from "@/common/loader/Spinner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const firstValue = (data, keys) => {
  if (!data) return "";
  for (const key of keys) {
    const value = data[key];
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return "";
};

const parseList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const collectTransfers = (data) => {
  const fromField = [
    "Share_Trf_Details",
    "share_trf_details",
    "Trf_Details",
    "Destination_Details",
    "Dest_Share_Details",
  ].flatMap((key) => parseList(data?.[key]));

  if (fromField.length) return fromField;

  const rows = Array.isArray(data?._detailRows) ? data._detailRows : [];
  if (rows.length > 1) {
    const destinations = rows.filter(
      (row) =>
        row?.trf_amount != null ||
        row?.Trf_Amount != null ||
        row?.Dest_Name ||
        row?.To_Name ||
        row?.Dest_Ac_No ||
        row?.To_Ac_No,
    );
    if (destinations.length) return destinations;
  }
  return [];
};

const moneyText = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const dateText = (value) => {
  if (!value) return "—";
  const formatted = formatDate(value);
  return formatted && formatted !== "-" ? formatted : String(value);
};

const dateTimeText = (value) => {
  if (!value) return "—";
  const text = String(value).trim();
  const match = text.match(
    /^(\d{4}-\d{2}-\d{2}|\d{2}[-/]\d{2}[-/]\d{4})(?:[T\s]+(.+))?$/,
  );
  if (!match) return text;
  const date = dateText(match[1]);
  const time = match[2] ? match[2].replace(/\.\d+Z?$/, "").slice(0, 8) : "";
  return time ? `${date} ${time}` : date;
};

const displayText = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

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

  const data = selectedApplication || {};
  const source = Number(firstValue(data, ["Trans_Source", "trans_source", "TransSource"]));
  const transfers = collectTransfers(data);

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error(t("membershipApproval.pleaseEnterRejectionRemarks"));
      return;
    }
    onApproveReject(2, rejectRemarks);
    setShowRejectModal(false);
    setRejectRemarks("");
  };

  const modeKey = (() => {
    const raw = String(
      firstValue(data, ["Pay_Mode", "Payment_Mode", "Trans_Mode", "Mode", "Vouch_Mode"]),
    ).toLowerCase();
    if (raw.includes("sav")) return "savings";
    if (raw.includes("bank")) return "bank";
    if (raw.includes("cash")) return "cash";
    if (raw.includes("trf") || raw.includes("transfer")) return "transfer";
    if (transfers.length) return "transfer";
    if (firstValue(data, ["Sb_Id", "Sb_Ac_No", "Savings_Ac_No", "Sb_Account_No"])) {
      return "savings";
    }
    if (firstValue(data, ["Bank_Id", "Bank_Ac_No", "Bank_Account_No"])) return "bank";
    return "cash";
  })();

  const shareCount = firstValue(data, ["No_Share", "No_Of_Share", "no_of_share"]);
  const shareRate = firstValue(data, ["Share_Rate", "Rate_Per_Share"]);
  const shareAmount =
    firstValue(data, ["Share_Amt", "Share_Amount"]) ||
    (shareCount !== "" && shareRate !== ""
      ? Number(shareCount) * Number(shareRate)
      : "");
  const paymentAmount = firstValue(data, [
    "Pay_Amt",
    "Payment_Amount",
    "Payment_Amt",
    "Tot_Amt",
    "Amount",
  ]);

  const Section = ({ title, children }) => (
    <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4 bg-white shadow-sm">
      <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
        <h4 className="w-full text-center text-sm sm:text-base font-bold text-[#00264d] tracking-wide">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, value, money = false, children }) => (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children || (
        <div
          className={cn(
            "min-h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm font-medium flex items-center break-words",
            money ? "text-green-600 font-semibold" : "text-slate-900",
          )}
        >
          {money ? moneyText(value) : displayText(value)}
        </div>
      )}
    </div>
  );

  const ModeBadge = ({ mode }) => {
    const styles = {
      cash: "bg-slate-100 text-slate-700",
      bank: "bg-blue-100 text-blue-700",
      savings: "bg-green-100 text-green-700",
      transfer: "bg-indigo-100 text-indigo-700",
    };
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
          styles[mode] || styles.cash,
        )}
      >
        {t(`membershipApproval.${mode}`)}
      </span>
    );
  };

  const overview = (
    <Section title={t("membershipApproval.transactionOverview")}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label={t("membershipApproval.particulars")}
          value={firstValue(data, ["Particular", "Particulars"])}
        />
        <Field
          label={t("membershipApproval.transactionType")}
          value={firstValue(data, ["Trans_Type", "Transaction_Type"])}
        />
        <Field
          label={t("membershipApproval.transactionDate")}
          value={dateText(firstValue(data, ["Trans_Date", "Transaction_Date"]))}
        />
      </div>
    </Section>
  );

  const member = (
    <Section title={t("membershipApproval.memberInformation")}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field
          label={t("membershipApproval.fullName")}
          value={firstValue(data, ["Full_Name", "Member_Name"])}
        />
        <Field
          label={t("membershipApproval.admissionNo")}
          value={firstValue(data, ["Adm_No", "Admission_No", "Member_No"])}
        />
        <Field
          label={t("membershipApproval.relationName")}
          value={firstValue(data, ["Relation_Name", "Guardian_Name"])}
        />
      </div>
    </Section>
  );

  const share = (
    <Section title={t("membershipApproval.shareDetails")}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label={t("membershipApproval.noOfShares")} value={shareCount} />
        <Field label={t("membershipApproval.shareRate")} value={shareRate} money />
        <Field label={t("membershipApproval.shareAmount")} value={shareAmount} money />
      </div>
    </Section>
  );

  const payment = (
    <Section title={t("membershipApproval.paymentDetails")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field label={t("membershipApproval.paymentMode")}>
          <div className="min-h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 flex items-center">
            <ModeBadge mode={modeKey === "transfer" ? "cash" : modeKey} />
          </div>
        </Field>
        {modeKey === "bank" && (
          <>
            <Field
              label={t("membershipApproval.accountName")}
              value={firstValue(data, ["Bank_Name", "Account_Name", "Ac_Name"])}
            />
            <Field
              label={t("membershipApproval.accountNo")}
              value={firstValue(data, ["Bank_Ac_No", "Account_No", "Ac_No", "Bank_Account_No"])}
            />
            <Field
              label={t("membershipApproval.accountHolder")}
              value={firstValue(data, ["Ac_Holder", "Account_Holder", "Holder_Name", "Full_Name"])}
            />
          </>
        )}
        {modeKey === "savings" && (
          <>
            <Field
              label={t("membershipApproval.accountNo")}
              value={firstValue(data, ["Sb_Ac_No", "Savings_Ac_No", "Sb_Account_No", "Account_No"])}
            />
            <Field
              label={t("membershipApproval.accountHolder")}
              value={firstValue(data, ["Ac_Holder", "Account_Holder", "Holder_Name", "Sb_Holder", "Full_Name"])}
            />
            <Field
              label={t("membershipApproval.closingBalance")}
              value={firstValue(data, ["Closing_Bal", "Close_Bal", "Avail_Balance", "Sb_Balance"])}
              money
            />
          </>
        )}
        <Field
          label={t("membershipApproval.paymentAmount")}
          value={paymentAmount}
          money
        />
      </div>
    </Section>
  );

  const system = (
    <Section title={t("membershipApproval.systemInformation")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label={t("membershipApproval.enteredBy")}
          value={firstValue(data, ["Entred_By", "Entered_By"])}
        />
        <Field
          label={t("membershipApproval.enteredOn")}
          value={dateTimeText(firstValue(data, ["Entred_On", "Entered_On"]))}
        />
      </div>
    </Section>
  );

  const newMembership = (
    <>
      {overview}
      {member}
      <Section title={t("membershipApproval.admissionDetails")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t("membershipApproval.admissionDate")}
            value={dateText(firstValue(data, ["Adm_Date", "Admission_Date", "Adm_Dt", "Trans_Date"]))}
          />
          <Field
            label={t("membershipApproval.admissionFee")}
            value={firstValue(data, ["Adm_Fees", "Admission_Fee", "Admission_Fees"])}
            money
          />
        </div>
      </Section>
      <Section title={t("membershipApproval.nomineeDetails")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field
            label={t("membershipApproval.nomineeName")}
            value={firstValue(data, ["Nom_Name", "Nominee_Name"])}
          />
          <Field
            label={t("membershipApproval.relation")}
            value={firstValue(data, ["Nom_Rel", "Nom_Relation", "Nominee_Relation"])}
          />
          <Field
            label={t("membershipApproval.age")}
            value={firstValue(data, ["Nom_Age", "Nominee_Age"])}
          />
          <Field
            label={t("membershipApproval.address")}
            value={firstValue(data, ["Nom_Add", "Nom_Address", "Nominee_Address"])}
          />
        </div>
      </Section>
      {share}
      {system}
    </>
  );

  const shareIssue = (
    <>
      {overview}
      {member}
      {share}
      {payment}
      {system}
    </>
  );

  const shareRefund = (
    <>
      {overview}
      {member}
      {payment}
      {share}
      {system}
    </>
  );

  const withdrawalTransfer = (
    <>
      {overview}
      <Section title={t("membershipApproval.sourceShareAccount")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={t("membershipApproval.accountNo")}
            value={firstValue(data, ["Sh_Ac_No", "Share_Ac_No", "Share_No", "Account_No"])}
          />
          <Field
            label={t("membershipApproval.availableShares")}
            value={firstValue(data, ["Avail_Share", "Available_Share", "Share_Bal", "No_Share"])}
          />
        </div>
      </Section>
      <Section title={t("membershipApproval.destinationShareAccounts")}>
        <Table className="border border-primary">
          <TableHeader className="bg-primary">
            <TableRow className="hover:bg-primary">
              <TableHead className="text-white">#</TableHead>
              <TableHead className="text-white">{t("membershipApproval.noOfShares")}</TableHead>
              <TableHead className="text-white">{t("membershipApproval.totalAmount")}</TableHead>
              <TableHead className="text-white">{t("membershipApproval.accountName")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.length ? (
              transfers.map((row, index) => {
                const amount = firstValue(row, [
                  "trf_amount",
                  "Trf_Amount",
                  "Amount",
                  "Share_Amt",
                ]);
                const shares = firstValue(row, ["No_Share", "No_Of_Share", "no_share"]);
                return (
                  <TableRow key={`${index}-${firstValue(row, ["sh_acct_id", "Share_Id"])}`}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{displayText(shares)}</TableCell>
                    <TableCell className="text-green-600 font-semibold">
                      {moneyText(amount)}
                    </TableCell>
                    <TableCell>
                      {displayText(
                        firstValue(row, [
                          "Ac_Name",
                          "Account_Name",
                          "Full_Name",
                          "Member_Name",
                          "memberName",
                          "Dest_Name",
                          "To_Name",
                        ]),
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500">
                  —
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Section>
      {system}
    </>
  );

  const withdrawalPayment = (
    <>
      {overview}
      {member}
      {payment}
      {share}
      {system}
    </>
  );

  const fallback = (
    <>
      {overview}
      {member}
      {share}
      {system}
    </>
  );

  let body = fallback;
  if (source === 1) body = newMembership;
  else if (source === 2) body = shareIssue;
  else if (source === 19) body = shareRefund;
  else if (source === 3) {
    body = modeKey === "transfer" ? withdrawalTransfer : withdrawalPayment;
  }

  const voucherType = String(firstValue(data, ["Vouch_Type"]) || "");
  const voucherStyle = voucherType.toLowerCase().includes("payment")
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setRejectRemarks("");
        }}
      >
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] max-w-4xl h-[min(92dvh,900px)] sm:h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
        >
          <DialogHeader className="p-4 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-2">
              <DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">
                {t("membershipApproval.transactionApproval")}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="font-medium">{t("membershipApproval.queue")}</span>
                <span className="font-semibold text-primary">
                  {displayText(firstValue(data, ["Queue_No"]))}
                </span>
                <span className="h-4 w-px bg-slate-300 mx-1" />
                <span className="font-medium">{t("membershipApproval.type")}</span>
                <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold", voucherStyle)}>
                  {displayText(voucherType)}
                </span>
                <span className="h-4 w-px bg-slate-300 mx-1" />
                <span className="font-medium">{t("membershipApproval.transaction")}:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                  {displayText(firstValue(data, ["Trans_Type", "Particular"]))}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-gray-300 text-gray-500 hover:bg-gray-100 h-9"
              onClick={() => setOpen(false)}
              disabled={detailsLoading || loading}
            >
              <XCircle className="w-4 h-4 mr-2" /> {t("common.buttons.close")}
            </Button>
          </DialogHeader>

          <ScrollArea className="flex-1 bg-[#F8FAFC]">
            {detailsLoading || loading ? (
              <div className="h-full flex items-center justify-center py-16">
                <Spinner />
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-4">{body}</div>
            )}
          </ScrollArea>

          <div className="p-3 sm:p-5 border-t bg-white flex justify-end items-center gap-3">
            <Button
              className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-6 font-bold min-w-[120px] w-full sm:w-auto"
              onClick={() => setShowRejectModal(true)}
              disabled={detailsLoading || loading}
            >
              <Ban className="w-4 h-4 mr-2" /> {t("membershipApproval.reject")}
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-6 font-bold min-w-[120px] w-full sm:w-auto"
              onClick={() => onApproveReject(1)}
              disabled={detailsLoading || loading}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> {t("membershipApproval.approve")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
