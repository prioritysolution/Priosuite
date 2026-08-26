"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "@/utils/formatDate";
import { useForm, Controller } from "react-hook-form";
import DropdownField from "@/common/formFields/DropdownField";
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

const BankingActionModal = ({
  open,
  setOpen,
  selectedApplication,
  onApproveReject,
  onUpdate,
  orgId,
  branchId,
  getBankAccountTypeApiCall,
  getBankGlApiCall,
  bankAccountTypeData,
  bankGlData,
  loading,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const { register, handleSubmit, reset, watch, control } = useForm({
    defaultValues: {
      opening_date: "",
      bank_name: "",
      branch_name: "",
      ifsc_code: "",
      account_no: "",
      account_type: "",
      under_gl: "",
    },
  });

  const watchedAccountType = watch("account_type");

  useEffect(() => {
    if (open) {
      getBankAccountTypeApiCall();
    }
  }, [open, getBankAccountTypeApiCall]);

  useEffect(() => {
    if (open && selectedApplication && orgId) {
      const initialType =
        selectedApplication.Account_Type || selectedApplication.accountType;
      if (initialType) {
        getBankGlApiCall(orgId, initialType);
      }
    }
  }, [open, selectedApplication, orgId, getBankGlApiCall]);

  useEffect(() => {
    if (watchedAccountType && orgId) {
      getBankGlApiCall(orgId, watchedAccountType);
    }
  }, [watchedAccountType, orgId, getBankGlApiCall]);

  useEffect(() => {
    if (selectedApplication) {
      reset({
        opening_date:
          selectedApplication.Opening_Date ||
          selectedApplication.openingDate ||
          selectedApplication.Trans_Date ||
          "",
        bank_name:
          selectedApplication.Bank_Name || selectedApplication.bankName || "",
        branch_name:
          selectedApplication.Bank_Branch ||
          selectedApplication.bankBranch ||
          "",
        ifsc_code:
          selectedApplication.Bank_IFSC ||
          selectedApplication.IFSC_Code ||
          selectedApplication.ifscCode ||
          "",
        account_no:
          selectedApplication.Account_No || selectedApplication.accountNo || "",
        account_type:
          selectedApplication.Account_Type ||
          selectedApplication.accountType ||
          "",
        under_gl:
          selectedApplication.Under_Gl ||
          selectedApplication.Bank_GL ||
          selectedApplication.bankGl ||
          "",
      });
    }
  }, [selectedApplication, reset]);

  if (!selectedApplication) return null;

  const isNewAccount =
    selectedApplication.Type === 0 || String(selectedApplication.Type) === "0";

  const handleRejectConfirm = () => {
    if (!rejectRemarks.trim()) {
      toast.error("Please enter remarks for rejection.");
      return;
    }
    onApproveReject(2, rejectRemarks);
    setShowRejectModal(false);
    setRejectRemarks("");
  };

  const onSubmit = async (data) => {
    const payload = {
      bank_id: selectedApplication.Id,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      ifsc_code: data.ifsc_code,
      account_no: data.account_no,
      account_type: data.account_type,
      under_gl: data.under_gl,
      opening_date: data.opening_date,
      branch_id: branchId,
      org_id: orgId,
    };

    console.log(payload, "payload");

    const success = await onUpdate(payload);
    if (success) {
      setIsEditMode(false);
    }
  };

  const getMappedName = (id, list, labelKey) => {
    if (!id || !list) return id || "N/A";
    const found = list.find(
      (item) =>
        String(item.Id) === String(id) || String(item.value) === String(id),
    );
    return found ? found[labelKey] || found.label || id : id;
  };

  const renderField = (
    label,
    name,
    value,
    isEditable = false,
    fieldType = "text",
  ) => {
    if (isEditMode && isEditable && isNewAccount) {
      if (fieldType === "account_type") {
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <DropdownField
                  label={label}
                  value={field.value}
                  onChange={field.onChange}
                  options={bankAccountTypeData}
                  optionLabelKey="Option_Value"
                  placeholder="Select Account Type"
                  searchPlaceholder="Search account type..."
                />
              )}
            />
          </div>
        );
      }

      if (fieldType === "under_gl") {
        return (
          <div className="flex flex-col gap-1.5 w-full">
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <DropdownField
                  label={label}
                  value={field.value}
                  onChange={field.onChange}
                  options={bankGlData}
                  optionLabelKey="Ledger_Name"
                  placeholder="Select Bank GL"
                  searchPlaceholder="Search bank gl..."
                />
              )}
            />
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1.5 w-full">
          <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </Label>
          <input
            {...register(name)}
            className="px-3 py-2 bg-white border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-md text-sm text-gray-900 h-10 flex items-center font-medium outline-none transition-all"
          />
        </div>
      );
    }

    let displayValue = value;
    if (label && label.toLowerCase().includes("date")) {
      displayValue = formatDate(value);
    } else if (fieldType === "account_type") {
      displayValue = getMappedName(value, bankAccountTypeData, "Option_Value");
    } else if (fieldType === "under_gl") {
      displayValue = getMappedName(value, bankGlData, "Ledger_Name");
      if (displayValue === value && selectedApplication.Under_Gl_Name) {
        displayValue = selectedApplication.Under_Gl_Name;
      }
    }

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </Label>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 h-10 flex items-center overflow-hidden font-medium">
          {displayValue !== null &&
          displayValue !== undefined &&
          displayValue !== ""
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
            setIsEditMode(false);
          }
        }}
      >
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[90vw] lg:max-w-4xl h-auto max-h-[85dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-3 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Banking Approval Portal
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">
                  Queue No: {selectedApplication.Queue_No}
                </span>
                <span className="h-4 w-px bg-gray-300" />
                <span className="font-semibold text-primary">
                  {selectedApplication.Type_Name ||
                    selectedApplication.Trans_Type}
                </span>
              </div>
            </div>

            {isNewAccount && (
              <div className="flex items-center gap-3">
                {!isEditMode ? (
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-all h-9 mt-6 mr-5"
                    onClick={() => setIsEditMode(true)}
                  >
                    Edit Details
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-red-400 mt-4 mr-3 text-red-500 hover:bg-red-50 h-9"
                    onClick={() => {
                      setIsEditMode(false);
                      reset();
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            )}
          </DialogHeader>

          <ScrollArea className="flex-1 bg-gray-50/50 p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64 w-full bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Spinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                {isNewAccount ? (
                  <>
                    {renderField(
                      "Opening Date",
                      "opening_date",
                      selectedApplication.Opening_Date ||
                        selectedApplication.openingDate ||
                        selectedApplication.Trans_Date,
                      true,
                    )}
                    {renderField(
                      "Bank Name",
                      "bank_name",
                      selectedApplication.Bank_Name ||
                        selectedApplication.bankName,
                      true,
                    )}
                    {renderField(
                      "Bank Branch",
                      "branch_name",
                      selectedApplication.Bank_Branch ||
                        selectedApplication.bankBranch,
                      true,
                    )}
                    {renderField(
                      "IFSC Code",
                      "ifsc_code",
                      selectedApplication.Bank_IFSC ||
                        selectedApplication.IFSC_Code ||
                        selectedApplication.ifscCode,
                      true,
                    )}
                    {renderField(
                      "Account No",
                      "account_no",
                      selectedApplication.Account_No ||
                        selectedApplication.accountNo,
                      true,
                    )}
                    {renderField(
                      "Account Type",
                      "account_type",
                      selectedApplication.Account_Type ||
                        selectedApplication.accountType ||
                        selectedApplication.Type_Name,
                      true,
                      "account_type",
                    )}
                    {renderField(
                      "Bank GL",
                      "under_gl",
                      selectedApplication.Under_Gl ||
                        selectedApplication.Bank_GL ||
                        selectedApplication.bankGl,
                      true,
                      "under_gl",
                    )}
                  </>
                ) : (
                  <>
                    {renderField(
                      "Transaction Date",
                      "trans_date",
                      selectedApplication.Trans_Date,
                    )}
                    {renderField(
                      "Queue No",
                      "queue_no",
                      selectedApplication.Queue_No,
                    )}
                    {renderField(
                      "Transaction Type",
                      "trans_type",
                      selectedApplication.Trans_Type ||
                        selectedApplication.Type_Name,
                    )}
                    {renderField(
                      "Bank Name",
                      "bank_name",
                      selectedApplication.Bank_Name,
                    )}
                    {renderField(
                      "Account No",
                      "account_no",
                      selectedApplication.Account_No ||
                        selectedApplication.accountNo,
                    )}
                    {renderField("Amount", "amount", selectedApplication.Amount)}
                  </>
                )}
              </div>
            )}
          </ScrollArea>

          <div className="p-3 sm:p-6 border-t bg-white flex justify-between items-center shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <div>
              {isEditMode && (
                <Button
                  onClick={handleSubmit(onSubmit)}
                  className="bg-primary hover:bg-primary/90 text-white px-6 font-semibold w-full sm:w-auto"
                  disabled={loading}
                >
                  Save & Update
                </Button>
              )}
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <Button
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-8 font-bold min-w-[120px] transition-all w-full sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={isEditMode || loading}
              >
                <Ban className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90 text-white px-8 font-bold min-w-[120px] transition-all w-full sm:w-auto"
                onClick={() => onApproveReject(1)}
                disabled={isEditMode || loading}
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

export default BankingActionModal;
