"use client";

import React, { useState, useEffect } from "react";
import { formatDate } from "@/utils/formatDate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  User,
  Shield,
  Info,
  Landmark,
  Layers,
  Eye,
  Ban,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import Spinner from "@/common/loader/Spinner";

import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import InputField from "@/common/formFields/InputField";
import DropdownField from "@/common/formFields/DropdownField";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const LoanActionModal = ({
  open,
  setOpen,
  selectedApplication,
  onApproveReject,
  getDeductionListForApproval,
  loading,

  // Transaction Block Props
  form,
  transMode,
  savings,
  savingsBalance,
  bankAccountData,
  ecsAccountData,
  cashDenomData,
  inDenominators,
  outDenominators,
  cashInTransactionTotal,
  cashOutTransactionTotal,
  cashInTransactionGrandTotal,
  cashOutTransactionGrandTotal,
  handleInDenominatorChange,
  handleOutDenominatorChange,
  insufficientBalanceDisable,
  approveDate,
  setApproveDate,
  approvedAmount,
  setApprovedAmount,
}) => {
  // console.log("bankAccountData=", form.getValues("savings"));

  const [guarantorOpen, setGuarantorOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [securityOpen, setSecurityOpen] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");

  // Approval flow states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [deductions, setDeductions] = useState([]);
  const [showDeductionsModal, setShowDeductionsModal] = useState(false);
  const [deductionsLoading, setDeductionsLoading] = useState(false);

  const deductionsGrandTotal = deductions.reduce(
    (sum, item) => sum + parseFloat(item.Final_Charge || 0),
    0,
  );

  const [isActiveDenom, setIsActiveDenom] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  useEffect(() => {
    if (selectedApplication) {
      console.log("selectedApplication details:", selectedApplication);
      setApprovedAmount("");
      const rawBegDate = getCookieData("beg_date") || getCookieData("begDate");
      if (rawBegDate) {
        const cleanStr = rawBegDate.split(" ")[0];
        const parts = cleanStr.split(/[-/]/);
        let dateObj;
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          } else {
            dateObj = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
          }
        } else {
          dateObj = new Date(rawBegDate);
        }
        setApproveDate(isNaN(dateObj.getTime()) ? new Date() : dateObj);
      } else {
        setApproveDate(new Date());
      }
    }
  }, [selectedApplication, setApprovedAmount, setApproveDate]);

  const savingsValue = form.getValues("savings");
  const bankValue = form.getValues("bank");

  if (!selectedApplication) return null;

  const renderField = (label, value) => {
    let displayValue = value;
    if (label && label.toLowerCase().includes("date")) {
      displayValue = formatDate(value);
    }
    return (
      <div className="flex flex-col gap-1 w-full">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900 min-h-10 flex items-center font-medium">
          {displayValue !== null &&
          displayValue !== undefined &&
          displayValue !== ""
            ? String(displayValue)
            : "—"}
        </div>
      </div>
    );
  };

  // Group security details by type
  const securities = selectedApplication.Security_Details || [];
  const type1Sec = securities.filter((s) => s.type_id === 1);
  const type2Sec = securities.filter((s) => s.type_id === 2);
  const type3Sec = securities.filter((s) => s.type_id === 3);
  const type4Sec = securities.filter((s) => s.type_id === 4);

  return (
    <>
      {/* Main Loan Details Modal */}
      <Dialog open={open}>
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] max-w-[95vw] lg:max-w-6xl max-h-[90dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
        >
          <DialogHeader className="p-3 sm:p-6 border-b bg-white flex flex-row items-center justify-between space-y-0">
            <div className="flex flex-col gap-0.5">
              <DialogTitle className="text-2xl font-bold text-gray-800 tracking-tight">
                Loan Application Details
              </DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">
                  App No: {selectedApplication.Appl_No || "—"}
                </span>
                <span className="h-4 w-px bg-gray-300" />
                <span className="font-semibold text-primary">
                  Case No: {selectedApplication.Loan_CaseNo || "—"}
                </span>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 bg-gray-50/50 p-6 overflow-y-auto max-h-[75vh]">
            {loading ? (
              <div className="flex justify-center items-center h-96 w-full bg-white rounded-xl border border-gray-200 shadow-sm">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Basic Info */}
                <Card className="p-5 border border-gray-200 bg-white shadow-sm rounded-xl space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2 text-primary font-semibold">
                    <Info className="h-5 w-5" />
                    <span>Application Info</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {renderField(
                      "Application Date",
                      formatDate(selectedApplication.Appl_Date),
                    )}
                    {renderField("Product Name", selectedApplication.Prod_Name)}
                    {renderField("Applicant Name", selectedApplication.Full_Name)}
                    {renderField(
                      "Applicant Amount",
                      selectedApplication.Appl_Amount,
                    )}
                    {renderField("ROI (%)", selectedApplication.Roi)}
                    {renderField(
                      "Duration",
                      `${selectedApplication.Duration || "—"} ${selectedApplication.Dur_Unit || ""}`,
                    )}
                    {renderField(
                      "Repayment Mode",
                      selectedApplication.Repay_Mode,
                    )}
                    {renderField(
                      "Final Repayment Date",
                      formatDate(selectedApplication.Repay_Within),
                    )}
                    {renderField("ECS Mode", selectedApplication.Ecs_Mode)}
                    {renderField("Applied By", selectedApplication.Appl_By)}
                    {renderField(
                      "Created On",
                      formatDate(selectedApplication.Created_On),
                    )}
                    {renderField("Loan Purpose", selectedApplication.Loan_Purp)}
                  </div>
                </Card>

                {/* 2. Joint Holder Details */}
                {(selectedApplication.JtHoldr_ID ||
                  selectedApplication.JtHoldr_ID1) && (
                  <Card className="p-5 border border-gray-200 bg-white shadow-sm rounded-xl space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2 text-primary font-semibold">
                      <User className="h-5 w-5" />
                      <span>Joint Holder Details</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderField(
                        "Joint Holder 1",
                        selectedApplication.JtHoldr_ID,
                      )}
                      {renderField(
                        "Joint Holder 2",
                        selectedApplication.JtHoldr_ID1,
                      )}
                    </div>
                  </Card>
                )}

                {/* Action Buttons to View Sub-modals */}
                <Card className="p-5 border border-gray-200 bg-white shadow-sm rounded-xl space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2 text-primary font-semibold">
                    <Layers className="h-5 w-5" />
                    <span>Loan Based On</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedApplication.Gurantor_Details &&
                    selectedApplication.Gurantor_Details.length > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setGuarantorOpen(true)}
                        className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5 h-12 text-sm font-semibold rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                        View Guarantor Details
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled
                        variant="outline"
                        className="h-12 text-sm font-semibold rounded-lg"
                      >
                        No Guarantor Details
                      </Button>
                    )}

                    {selectedApplication.Project_Details &&
                    selectedApplication.Project_Details.length > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setProjectOpen(true)}
                        className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5 h-12 text-sm font-semibold rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                        View Project Details
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled
                        variant="outline"
                        className="h-12 text-sm font-semibold rounded-lg"
                      >
                        No Project Details
                      </Button>
                    )}

                    {securities.length > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSecurityOpen(true)}
                        className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary/5 h-12 text-sm font-semibold rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                        View Security Details
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled
                        variant="outline"
                        className="h-12 text-sm font-semibold rounded-lg"
                      >
                        No Security Details
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </ScrollArea>
          <div className="p-3 sm:p-6 border-t bg-gray-50 flex justify-between items-center">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              variant="outline"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                className="bg-[#991B1B] hover:bg-[#7F1D1D] text-white px-6 font-bold w-full sm:w-auto"
                onClick={() => setShowRejectModal(true)}
                disabled={loading}
              >
                <Ban className="w-4 h-4 mr-2" /> Reject
              </Button>
              <Button
                type="button"
                className="bg-primary hover:bg-primary/90 text-white px-6 font-bold w-full sm:w-auto"
                onClick={() => setShowApproveModal(true)}
                disabled={loading}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Guarantor Details Modal */}
      <Dialog open={guarantorOpen}>
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] max-w-[90vw] md:max-w-2xl max-h-[80dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
        >
          <DialogHeader className="p-3 sm:p-6 border-b bg-white">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Guarantor Details
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6 bg-gray-50/30 overflow-y-auto">
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[80px]">Sl</TableHead>
                    <TableHead>Guarantor Name</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedApplication.Gurantor_Details?.map((g, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{g.Name || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
          <div className="p-3 sm:p-6 border-t bg-gray-50 flex justify-end">
            <Button
              type="button"
              onClick={() => setGuarantorOpen(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Project Details Modal */}
      <Dialog open={projectOpen}>
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] max-w-[90vw] lg:max-w-4xl max-h-[80dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
        >
          <DialogHeader className="p-3 sm:p-6 border-b bg-white">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Project Details
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6 bg-gray-50/30 overflow-y-auto">
            <div className="space-y-6 bg-white p-5 border border-gray-200 shadow-sm rounded-xl">
              {selectedApplication.Project_Details?.map((proj, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {renderField("Project Name", proj.Project_Name)}
                  {renderField("Project Cost", proj.Project_Cost)}
                  {renderField("Own Contribution", proj.Own_CB)}
                  {renderField("Mouza", proj.proj_mouza)}
                  {renderField("Plot No", proj.proj_plotno)}
                  {renderField("Land Area", proj.Land_Area)}
                  {renderField("Hypothecated Value", proj.Hypo_Value)}
                  {renderField("Income Gen Amount", proj.Income_Gen)}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-3 sm:p-6 border-t bg-gray-50 flex justify-end">
            <Button
              type="button"
              onClick={() => setProjectOpen(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Security Details Modal */}
      <Dialog open={securityOpen}>
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] max-w-[95vw] lg:max-w-6xl max-h-[85dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
        >
          <DialogHeader className="p-3 sm:p-6 border-b bg-white">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Details
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6 bg-gray-50/30 overflow-y-auto">
            <div className="space-y-6">
              {/* Type 1 - Deposit/Certificate */}
              {type1Sec.length > 0 && (
                <div className="space-y-2 bg-white p-5 border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Deposit / Certificate Securities
                  </h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Cert Type</TableHead>
                          <TableHead>Cert No</TableHead>
                          <TableHead>Issue Date</TableHead>
                          <TableHead>Deposit Amt</TableHead>
                          <TableHead>ROI (%)</TableHead>
                          <TableHead>Maturity Date</TableHead>
                          <TableHead>Maturity Amt</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {type1Sec.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell>{s.Cert_Type || "—"}</TableCell>
                            <TableCell>{s.Cert_No || "—"}</TableCell>
                            <TableCell>{formatDate(s.Issue_Dtae)}</TableCell>
                            <TableCell>{s.Deposit_Amt || "—"}</TableCell>
                            <TableCell>{s.Roi || "—"}</TableCell>
                            <TableCell>{formatDate(s.Maturity_Date)}</TableCell>
                            <TableCell>{s.Maturity_Value || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Type 2 - Property */}
              {type2Sec.length > 0 && (
                <div className="space-y-2 bg-white p-5 border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Property Securities
                  </h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Type Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Co-Owner</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Latitude</TableHead>
                          <TableHead>Longitude</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {type2Sec.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell>{s.Cert_Type || "—"}</TableCell>
                            <TableCell>{s.Poperty_Location || "—"}</TableCell>
                            <TableCell>{s.Poperty_Area || "—"}</TableCell>
                            <TableCell>{s.Owner_Name || "—"}</TableCell>
                            <TableCell>{s.Co_Owner || "—"}</TableCell>
                            <TableCell>{s.Sec_Details || "—"}</TableCell>
                            <TableCell>{s.Lat || "—"}</TableCell>
                            <TableCell>{s.Long || "—"}</TableCell>
                            <TableCell>{s.Deposit_Amt || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Type 3 - Hypothecation */}
              {type3Sec.length > 0 && (
                <div className="space-y-2 bg-white p-5 border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Hypothecation
                  </h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Item Name</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Co-Owner</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Own Cont.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {type3Sec.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell>{s.Item_Name || "—"}</TableCell>
                            <TableCell>{s.Sec_Details || "—"}</TableCell>
                            <TableCell>{s.Brand_Name || "—"}</TableCell>
                            <TableCell>{s.Owner_Name || "—"}</TableCell>
                            <TableCell>{s.Co_Owner || "—"}</TableCell>
                            <TableCell>{s.Item_Cost || "—"}</TableCell>
                            <TableCell>{s.Own_Cont || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Type 4 - Others */}
              {type4Sec.length > 0 && (
                <div className="space-y-2 bg-white p-5 border border-gray-200 shadow-sm rounded-xl">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Other Securities
                  </h4>
                  <div className="overflow-x-auto border rounded-lg">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead>Type Name</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {type4Sec.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell>{s.Cert_Type || "—"}</TableCell>
                            <TableCell>{s.Sec_Details || "—"}</TableCell>
                            <TableCell>{s.Deposit_Amt || "—"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-3 sm:p-6 border-t bg-gray-50 flex justify-end">
            <Button
              type="button"
              onClick={() => setSecurityOpen(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Remarks Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[500px] z-[9999]" hideClose>
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Reject Loan Application
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label htmlFor="remarks" className="text-sm font-semibold">
              Rejection Remarks <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="remarks"
              placeholder="Enter reason for rejection..."
              value={rejectRemarks}
              onChange={(e) => setRejectRemarks(e.target.value)}
              className="w-full min-h-[100px] border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-3">
            <Button variant="outline" onClick={() => setShowRejectModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-bold w-full sm:w-auto"
              onClick={() => {
                if (!rejectRemarks.trim()) {
                  toast.error("Please enter remarks for rejection.");
                  return;
                }
                onApproveReject(2, rejectRemarks);
                setShowRejectModal(false);
                setRejectRemarks("");
              }}
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval Confirmation Modal */}
      <Dialog open={showApproveModal}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[450px] z-[9999]" hideClose>
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Approve Loan Application
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <div className="py-4 space-y-4">
              <DatePickerField
                control={form.control}
                name="approveDate"
                label="Sanction Date"
                isRequired
                disabled={true}
              />

              <InputField
                control={form.control}
                name="appliedAmount"
                label="Applied Amount"
                disabled
                readOnly
                displayValue={selectedApplication.Appl_Amount || "—"}
              />

              <InputField
                control={form.control}
                name="approvedAmount"
                label="Sanction Amount"
                type="number"
                isRequired
                placeholder="Enter Sanction amount"
              />
            </div>
          </Form>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-3">
            <Button
              variant="outline"
              onClick={() => setShowApproveModal(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white font-bold w-full sm:w-auto"
              disabled={deductionsLoading}
              onClick={async () => {
                const currentApproveDate = form.getValues("approveDate");
                const currentApprovedAmount = form.getValues("approvedAmount");
                
                let hasError = false;
                form.clearErrors(["approveDate", "approvedAmount"]);

                if (!currentApproveDate) {
                  form.setError("approveDate", {
                    type: "manual",
                    message: "Please select an approval date.",
                  });
                  toast.error("Please select an approval date.");
                  hasError = true;
                }
                if (!currentApprovedAmount || Number(currentApprovedAmount) <= 0) {
                  form.setError("approvedAmount", {
                    type: "manual",
                    message: "Please enter a valid approved amount.",
                  });
                  toast.error("Please enter a valid approved amount.");
                  hasError = true;
                }
                if (
                  Number(currentApprovedAmount) >
                  Number(selectedApplication.Appl_Amount)
                ) {
                  form.setError("approvedAmount", {
                    type: "manual",
                    message: `Approved amount cannot be greater than applied amount (${selectedApplication.Appl_Amount}).`,
                  });
                  toast.error(
                    `Approved amount cannot be greater than applied amount (${selectedApplication.Appl_Amount}).`,
                  );
                  hasError = true;
                }

                if (hasError) return;

                setDeductionsLoading(true);
                try {
                  const res = await getDeductionListForApproval(
                    selectedApplication.Prod_Id || 0,
                    currentApprovedAmount,
                  );
                  if (res?.message === "Data Found") {
                    const updatedDetails = (res.details || []).map((item) => {
                      const finalCharge = parseFloat(item.Charge_Amt || 0);
                      return {
                        ...item,
                        Final_Charge: finalCharge.toFixed(2),
                      };
                    });
                    setDeductions(updatedDetails);
                    setShowApproveModal(false);
                    setShowDeductionsModal(true);
                  } else {
                    // No deductions, proceed with approval directly
                    onApproveReject(1, {
                      apprv_date: currentApproveDate,
                      apprv_amount: currentApprovedAmount,
                      charge_data: [],
                    });
                    setShowApproveModal(false);
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Error loading deduction charges list.");
                } finally {
                  setDeductionsLoading(false);
                }
              }}
            >
              {deductionsLoading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deductions List Modal */}
      <Dialog open={showDeductionsModal}>
        <DialogContent
          className="w-[calc(100vw-1rem)] max-w-[95vw] lg:max-w-4xl max-h-[85dvh] flex flex-col p-0 overflow-hidden border-none shadow-2xl"
          hideClose
        >
          <DialogHeader className="p-3 sm:p-6 border-b bg-white">
            <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Deduction Charges List
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 p-6 bg-gray-50/30 overflow-y-auto">
            <div className="border rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[80px]">#</TableHead>
                    <TableHead>Charge Name</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deductions.map((d, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{d.Deduction_Name || "—"}</TableCell>
                      <TableCell className="text-right tabular-nums font-semibold">
                        {parseFloat(d.Final_Charge || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={2}>Grand Total</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {deductions
                        .reduce(
                          (sum, item) =>
                            sum + parseFloat(item.Final_Charge || 0),
                          0,
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* ── Transaction block ── */}
            <div className="w-full flex flex-col border border-primary rounded-lg p-2 sm:px-5 gap-2 my-5">
              <h3 className="w-full text-center text-xl font-semibold">
                Transaction Block
              </h3>
              <Form {...form}>
                <div className="w-full flex flex-col gap-2">
                  <FormField
                    control={form.control}
                    name="transMode"
                    render={({ field }) => (
                      <FormItem className="flex border border-input rounded-md pl-3 py-3 w-full">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-5 sm:space-y-0 gap-x-2 w-full"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cash" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Cash
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Bank
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="savings" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Savings
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InputField
                    control={form.control}
                    name="refVouchNo"
                    placeholder="Enter ref. vouch no."
                  />
                  {transMode === "cash" ? (
                    isActiveDenom ? (
                      <DoubleCashDenomTable
                        notes={cashDenomData}
                        inDenominators={inDenominators}
                        outDenominators={outDenominators}
                        totalInAmount={cashInTransactionTotal}
                        totalOutAmount={cashOutTransactionTotal}
                        cashInTransactionGrandTotal={
                          cashInTransactionGrandTotal
                        }
                        cashOutTransactionGrandTotal={
                          cashOutTransactionGrandTotal
                        }
                        handleInDenominatorChange={handleInDenominatorChange}
                        handleOutDenominatorChange={handleOutDenominatorChange}
                      />
                    ) : null
                  ) : transMode === "bank" ? (
                    <DropdownField
                      control={form.control}
                      name="bank"
                      label="Bank"
                      options={bankAccountData}
                      optionLabelKey="Bank_Name"
                      placeholder="Select bank"
                      searchPlaceholder="Search bank..."
                    />
                  ) : (
                    <>
                      <DropdownField
                        control={form.control}
                        name="savings"
                        label="Savings"
                        options={ecsAccountData}
                        optionLabelKey="Account_No"
                        placeholder="Select savings"
                        searchPlaceholder="Search savings..."
                      />
                      <InputField
                        control={form.control}
                        name="savingsName"
                        label="Account Holder Name"
                        placeholder="Enter name"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="savingsBalance"
                        label="Available Balance"
                        placeholder="Enter balance"
                        readOnly
                      />
                    </>
                  )}
                </div>
              </Form>
            </div>
          </ScrollArea>
          <div className="p-3 sm:p-6 border-t bg-gray-50 flex justify-end gap-3">
            <Button
              type="button"
              onClick={() => {
                setShowDeductionsModal(false);
                setShowApproveModal(true);
              }}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Back
            </Button>
            <Button
              type="button"
              className="bg-primary hover:bg-primary/90 text-white font-bold w-full sm:w-auto"
              disabled={
                (transMode === "cash" &&
                  isActiveDenom &&
                  Number(cashInTransactionGrandTotal) -
                    Number(cashOutTransactionGrandTotal) !==
                    Number(deductionsGrandTotal)) ||
                (transMode === "savings" &&
                  Number(savingsBalance) < Number(deductionsGrandTotal)) ||
                (transMode === "bank" && !bankValue) ||
                (transMode === "savings" && !savingsValue)
              }
              onClick={() => {
                const currentApproveDate = form.getValues("approveDate");
                const currentApprovedAmount = form.getValues("approvedAmount");
                onApproveReject(1, {
                  apprv_date: currentApproveDate,
                  apprv_amount: currentApprovedAmount,
                  charge_data: deductions.map((d) => ({
                    ledg_id: d.Deduct_Gl,
                    ded_amt: d.Final_Charge,
                    ded_id: d.Id,
                    ded_perc: d.Charg_Perc,
                  })),
                });
                setShowDeductionsModal(false);
              }}
            >
              Approve
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoanActionModal;
