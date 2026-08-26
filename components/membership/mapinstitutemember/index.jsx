"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { FormProvider } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import {
  UserPlus,
  Users,
  UserCheck,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";
import DropdownField from "@/common/formFields/DropdownField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import KYCDropdownField from "../../../common/formFields/KYCDropdownField";
import { useDispatch } from "react-redux";
import {
  getGrpDesigData,
  getEcsAccountData,
} from "../../../container/membership/mapinstitutemember/mapinstitutememberReduces";
import { getMemberDataByIdAPI } from "../../../container/membership/issueMembership/IssueMembershipApis";

const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`w-full bg-white border border-primary/20 rounded-xl shadow-sm overflow-hidden ${className}`}
  >
    {title && (
      <div className="flex items-center gap-2 px-4 py-3 bg-primary/5 border-b border-primary/10">
        {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
        <h3 className="text-xs font-bold text-primary uppercase tracking-wider truncate">
          {title}
        </h3>
      </div>
    )}
    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

/** Static display field (no input) */
const ReadOnlyField = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
      {label}
    </span>
    <div className="h-9 px-3 flex items-center rounded-lg bg-muted/40 border border-border text-sm text-foreground truncate">
      {value || (
        <span className="text-muted-foreground/50 italic text-xs">—</span>
      )}
    </div>
  </div>
);

/** Animated loading placeholder grid */
const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20 bg-muted" />
        <Skeleton
          className={`w-full bg-muted rounded-lg ${i === 4 ? "h-16" : "h-9"}`}
        />
      </div>
    ))}
  </div>
);

/** Live / Inactive pill badge */
const StatusBadge = ({ status }) => {
  const live = status === "Live" || status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border whitespace-nowrap
      ${
        live
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-100 text-gray-500 border-gray-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${live ? "bg-emerald-500" : "bg-gray-400"}`}
      />
      {status || "N/A"}
    </span>
  );
};

const ResponsiveTable = ({
  headers,
  rows,
  emptyIcon: EmptyIcon = Users,
  emptyText = "No data found.",
}) => {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <EmptyIcon className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  const dataHeaders = headers.filter(
    (h) => h.key !== "actions" && h.key !== "sl",
  );

  return (
    <>
      {/* ── Mobile stacked cards ( < md ) ────────────────────────── */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="rounded-xl border border-border bg-white shadow-sm overflow-hidden"
          >
            {/* card header: index + actions */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wide shrink-0">
                # {ri + 1}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {row.actions}
              </div>
            </div>
            {/* card body: label + value grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3">
              {dataHeaders.map((h) => (
                <div key={h.key} className={h.fullWidth ? "col-span-2" : ""}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                    {h.label}
                  </p>
                  <div className="text-sm font-medium text-foreground break-words">
                    {row[h.key]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ( md+ ) ─────────────────────────────────── */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {headers.map((h) => (
                  <TableHead
                    key={h.key}
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap px-3 py-3"
                  >
                    {h.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, ri) => (
                <TableRow
                  key={ri}
                  className="hover:bg-muted/20 transition-colors"
                >
                  {headers.map((h) => (
                    <TableCell key={h.key} className="px-3 py-2.5 text-sm">
                      {row[h.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

const MapInstituteMember = ({
  form,
  handleMemberFormSubmit,
  handleMapGroupSubmit,
  getGroupLoading,
  getMemberDataLoading,
  visibleBlock,
  handleAddMember,
  handleRemoveMember,
  handleUpdateMember,
  addedMembers,
  resetTrigger,
  isAddMemberDisabled,
  designationData,
  ecsAccountData,
  mapGroupMemberLoading,
  handleMapSubmit,
  successMessage,
  showSuccessMessage,
  setShowSuccessMessage,
  setSuccessMessage,
  selectedOption,
  setSelectedOption,
  handelDeleteMember,
}) => {
  const branchId = getCookieData("userBranchId");
  const beg_date = getCookieData("beg_date");
  const [radioLocked, setRadioLocked] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const dispatch = useDispatch();

  /* ── fetch fresh member data → open edit dialog ── */
  const fetchMemberDataAndOpenDialog = async (member) => {
    setEditingMember(member);
    const orgId = getCookieData("orgId");
    if (member.Member_CIF && orgId) {
      try {
        const res = await getMemberDataByIdAPI(orgId, member.Member_CIF);
        if (res.message === "Data Found") {
          const d = res.details[0];
          form.setValue("mapId", member.Map_Id || "");
          form.setValue("mmemberNo", d.Cust_No || "");
          form.setValue("joinongdate", member.Joinong_Date);
          form.setValue("mmemberId", d.Id || "");
          form.setValue("mcifNo", d.CIF_No || "");
          form.setValue("mmemberName", d.Full_Name || "");
          form.setValue("mgurdianName", d.Relation_Name || "");
          form.setValue("maddress", d.Address || "");
          form.setValue("mmobile", d.Cust_Mob || "");
          form.setValue("BranchName", d.Branch_Name || "");
          form.setValue("BranchId", d.Branch_Id || "");
          if (member.Deg_Id)
            form.setValue("designation", String(member.Deg_Id));
          form.trigger();
          if (d.Id && orgId) {
            dispatch(getGrpDesigData());
            // No need to fetch ECS account data since defaultsavings field is removed
          }
        }
        setDialogOpen(true);
      } catch {
        setDialogOpen(true);
      }
    } else {
      setDialogOpen(true);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage("");
  };

  /* ── Table column definitions ── */
  const existingHeaders = [
    { key: "sl", label: "#" },
    { key: "name", label: "Member Name" },
    { key: "cif", label: "CIF No." },
    { key: "designation", label: "Designation" },
    { key: "relation", label: "Relation" },
    { key: "joinDate", label: "Joining Date" },
    // { key: "savings", label: "Savings A/C", fullWidth: true },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const addedHeaders = [
    { key: "sl", label: "#" },
    { key: "cif", label: "Member CIF" },
    { key: "name", label: "Member Name" },
    { key: "relation", label: "Relation" },
    // { key: "savings", label: "Savings A/C", fullWidth: true },
    { key: "designation", label: "Designation" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Action" },
  ];

  console.log("ecsAccountData=", ecsAccountData);

  /* ── Row data builders ── */
  const existingRows = (form.getValues("member_info") || []).map((m, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    name: (
      <span className="font-medium whitespace-nowrap">
        {m.Member_Name || "N/A"}
      </span>
    ),
    cif: (
      <span className="text-muted-foreground whitespace-nowrap">
        {m.Member_CIF || "N/A"}
      </span>
    ),
    designation: Array.isArray(designationData)
      ? designationData.find((d) => String(d.Id) === String(m.Deg_Id))
          ?.Option_Value ||
        m.Designation ||
        "N/A"
      : m.Designation || "N/A",
    relation: m.Relation_Name || "N/A",
    joinDate: (
      <span className="text-muted-foreground whitespace-nowrap">
        {m.Joinong_Date || "N/A"}
      </span>
    ),
    savings: m.Savings_Account_No || m.Savings_Account || "N/A",
    status: <StatusBadge status={m.Status} />,
    actions: (
      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          onClick={() => fetchMemberDataAndOpenDialog(m)}
          className="h-7 px-2.5 text-xs border-primary/30 text-primary hover:bg-primary hover:text-white gap-1 shrink-0"
        >
          <Pencil className="w-3 h-3" /> Edit
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handelDeleteMember(m.Map_Id)}
          className="h-7 px-2.5 text-xs gap-1 shrink-0"
        >
          <Trash2 className="w-3 h-3" /> Remove
        </Button>
      </div>
    ),
  }));

  const addedRows = addedMembers.map((m, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    cif: <span className="font-medium whitespace-nowrap">{m.mcifNo}</span>,
    name: <span className="whitespace-nowrap">{m.mmemberName}</span>,
    relation: m.mgurdianName || "N/A",
    savings: m.ecsAccountDisplay || "N/A",
    designation: m.designationDisplay || "N/A",
    status: <StatusBadge status="Active" />,
    actions: (
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={() => handleRemoveMember(m.id)}
        className="h-7 px-2.5 text-xs gap-1 shrink-0"
      >
        <Trash2 className="w-3 h-3" /> Remove
      </Button>
    ),
  }));

  return (
    <div className="w-full h-full min-w-0">
      <div className="w-full h-full flex flex-col border-2 border-primary rounded-xl overflow-hidden bg-white  min-w-0">
        <ScrollArea className="w-full h-full">
          <div className="p-3 sm:p-4 lg:p-5 flex flex-col gap-4 min-w-0 max-w-full">
            <FormProvider {...form}>
              {/* 1 ── Group search */}
              <MemberSearchForm
                handleSubmit={handleMapGroupSubmit}
                loading={getGroupLoading}
                formLabel="Map Institute Member"
                showDateFix
                disableNextButton={
                  addedMembers.length > 0 && selectedOption === "new"
                }
              />

              {/* 2 ── Group basic info */}
              {visibleBlock && (
                <SectionCard title="Group Basic Info" icon={Users}>
                  {getGroupLoading ? (
                    <SkeletonGrid />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {/* Simple read-only inputs */}
                        {[
                          { name: "gmemberNo", label: "Group No." },
                          { name: "gcifNo", label: "Group CIF" },
                          { name: "gmemberName", label: "Group Name" },
                          { name: "gmobile", label: "Mobile No." },
                          { name: "gBenefNo", label: "No. of Members" },
                        ].map(({ name, label }) => (
                          <InputField
                            key={name}
                            control={form.control}
                            name={name}
                            label={label}
                            readOnly
                            className="h-9 bg-muted/40 border-border text-sm"
                            formLabelClassName="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                          />
                        ))}

                        {/* Address – wider on sm */}
                        <InputField
                          control={form.control}
                          name="gaddress"
                          label="Address"
                          readOnly
                          rows={2}
                          className="resize-none bg-muted/40 border-border text-sm"
                          formItemClassName="sm:col-span-2 lg:col-span-1"
                          formLabelClassName="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                        />

                        <DatePickerField
                          control={form.control}
                          name="gCustDOB"
                          label="Formation Date"
                          placeholder="Select date"
                          onPopover
                        />
                        {/* <DatePickerField
                          control={form.control}
                          name="date"
                          label="Join Date"
                          placeholder="Select date"
                        /> */}
                      </div>

                      {/* View / Add radio */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <RadioGroup
                          value={selectedOption}
                          className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                          onValueChange={(val) => {
                            if (!radioLocked) setRadioLocked(true);
                            setSelectedOption(val);
                          }}
                        >
                          {[
                            {
                              value: "existing",
                              label: "View Existing Members",
                              disabled:
                                addedMembers.length > 0 &&
                                selectedOption === "new",
                            },
                            {
                              value: "new",
                              label: "Add New Member",
                              disabled: false,
                            },
                          ].map(({ value, label, disabled }) => (
                            <label
                              key={value}
                              htmlFor={value}
                              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border cursor-pointer select-none
                                transition-colors text-sm w-full sm:w-auto
                                ${
                                  selectedOption === value
                                    ? "border-primary bg-primary/5 text-primary font-semibold"
                                    : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30"
                                }
                                ${disabled ? "opacity-40 pointer-events-none" : ""}`}
                            >
                              <RadioGroupItem
                                value={value}
                                id={value}
                                disabled={disabled}
                              />
                              {label}
                            </label>
                          ))}
                        </RadioGroup>
                      </div>
                    </>
                  )}
                </SectionCard>
              )}

              {/* 3 ── Existing members */}
              {visibleBlock && selectedOption === "existing" && (
                <SectionCard title="Existing Group Members" icon={UserCheck}>
                  <ResponsiveTable
                    headers={existingHeaders}
                    rows={existingRows}
                    emptyIcon={Users}
                    emptyText="No existing members found for this group."
                  />
                </SectionCard>
              )}

              {/* 4 ── Add new member flow */}
              {visibleBlock && selectedOption === "new" && (
                <>
                  {/* Member search */}
                  <MemberSearchForm
                    handleSubmit={handleMemberFormSubmit}
                    loading={getMemberDataLoading}
                    resetTrigger={resetTrigger}
                    formLabel="Map Group Member"
                    showDateFix
                    anableRadio="1"
                  />

                  {/* Member info form */}
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleMapGroupSubmit)}
                      autoComplete="off"
                    >
                      <SectionCard title="Member Info" icon={UserPlus}>
                        {getGroupLoading ? (
                          <SkeletonGrid />
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                              {[
                                { name: "mmemberNo", label: "Member No." },
                                { name: "mcifNo", label: "CIF No." },
                                { name: "mmemberName", label: "Member Name" },
                                {
                                  name: "mgurdianName",
                                  label: "Guardian Name",
                                },
                                { name: "mmobile", label: "Mobile No." },
                              ].map(({ name, label }) => (
                                <InputField
                                  key={name}
                                  control={form.control}
                                  name={name}
                                  label={label}
                                  readOnly
                                  className="h-9 bg-muted/40 border-border text-sm"
                                  formLabelClassName="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                                />
                              ))}

                              {/* Address */}
                              <InputField
                                control={form.control}
                                name="maddress"
                                label="Address"
                                readOnly
                                rows={2}
                                className="resize-none bg-muted/40 border-border text-sm"
                                formItemClassName="sm:col-span-2 lg:col-span-1"
                                formLabelClassName="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                              />

                              {/* Branch Name */}
                              <InputField
                                control={form.control}
                                name="BranchName"
                                label="Branch Name"
                                readOnly
                                className={`h-9 border-border text-sm
                                ${
                                  branchId === form.getValues("BranchId")
                                    ? "bg-muted/40"
                                    : "bg-red-50 border-red-300 text-red-600"
                                }`}
                                formLabelClassName="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                              />

                              {/* Designation */}
                              <DropdownField
                                control={form.control}
                                name="designation"
                                label="Designation"
                                options={
                                  Array.isArray(designationData)
                                    ? designationData
                                    : []
                                }
                                optionLabelKey="Option_Value"
                                placeholder="Select designation"
                                searchPlaceholder="Search..."
                                className="h-9"
                                loading={mapGroupMemberLoading?.grpDesig}
                                isRequired={true}
                              />

                              <DatePickerField
                                control={form.control}
                                name="date"
                                label="Join Date"
                                placeholder="Select date"
                                defaultValue={new Date(beg_date)}
                                disabled={true}
                              />
                            </div>

                            {/* Add Member CTA */}
                            <div className="flex justify-end mt-4 pt-4 border-t border-border">
                              <Button
                                type="button"
                                onClick={handleAddMember}
                                disabled={isAddMemberDisabled}
                                className="flex items-center gap-2 px-5 font-semibold group disabled:opacity-50"
                              >
                                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Add Member
                              </Button>
                            </div>
                          </>
                        )}
                      </SectionCard>
                    </form>
                  </Form>

                  {/* Added members list */}
                  <SectionCard title="Added Members" icon={Users}>
                    <ResponsiveTable
                      headers={addedHeaders}
                      rows={addedRows}
                      emptyIcon={UserPlus}
                      emptyText="No members added yet. Use the form above to add members."
                    />
                  </SectionCard>

                  {/* Final submit */}
                  <div className="flex justify-end pb-2">
                    <Button
                      onClick={handleMapSubmit}
                      disabled={addedMembers.length === 0}
                      className="px-8 font-semibold disabled:opacity-50"
                    >
                      Map Institute Member
                    </Button>
                  </div>
                </>
              )}
            </FormProvider>
          </div>
        </ScrollArea>
      </div>

      {/* ── Success notification ── */}
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      {/* ── Edit Member Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-2xl max-h-[90dvh] overflow-y-auto rounded-xl p-0 gap-0">
          {/* Dialog header */}
          <DialogHeader className="px-5 py-4 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Pencil className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm font-semibold truncate">
                  Edit Member Information
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Update the details below, then click Save to confirm.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Dialog body */}
          <FormProvider {...form}>
            <div className="px-5 py-4 flex flex-col gap-4">
              {/* Read-only info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ReadOnlyField
                  label="Member No."
                  value={form.getValues("mmemberNo")}
                />
                <ReadOnlyField
                  label="CIF No."
                  value={form.getValues("mcifNo")}
                />
                <ReadOnlyField
                  label="Member Name"
                  value={form.getValues("mmemberName")}
                />
                <ReadOnlyField
                  label="Guardian Name"
                  value={form.getValues("mgurdianName")}
                />
                <ReadOnlyField
                  label="Mobile No."
                  value={form.getValues("mmobile")}
                />
                <ReadOnlyField
                  label="Branch Name"
                  value={form.getValues("BranchName")}
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Address
                </span>
                <Textarea
                  value={form.getValues("maddress") || ""}
                  readOnly
                  rows={2}
                  className="resize-none bg-muted/40 border-border text-sm"
                />
              </div>

              {/* Editable dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border">
                <FormField
                  control={form.control}
                  name="designation"
                  render={({ field }) => (
                    <FormControl>
                      <KYCDropdownField
                        label="Designation"
                        value={field.value}
                        onChange={field.onChange}
                        options={
                          Array.isArray(designationData) ? designationData : []
                        }
                        optionLabelKey="Option_Value"
                        placeholder="Select designation"
                        searchPlaceholder="Search..."
                        className="h-9"
                        loading={mapGroupMemberLoading?.grpDesig}
                      />
                    </FormControl>
                  )}
                />
              </div>

              {/* Withdrawn date + Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DatePickerField
                  name="withdrawnDate"
                  label="Withdrawn Date"
                  placeholder="Select date"
                  className="h-9"
                />
                <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Remarks
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter remarks"
                          className="h-9 text-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DatePickerField
                control={form.control}
                name="joinongdate"
                label="Join Date"
                placeholder="Select date"
                defaultValue={new Date(beg_date)}
                disabled={true}
              />
            </div>
          </FormProvider>

          {/* Dialog footer */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 px-5 py-3 border-t border-border bg-muted/20 shrink-0">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="gap-2 h-9"
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button
              className="gap-2 h-9"
              onClick={() => {
                if (editingMember) {
                  handleUpdateMember(editingMember.id, {
                    mapId: form.getValues("mapId"),
                    mmemberNo: form.getValues("mmemberNo"),
                    mmemberId: form.getValues("mmemberId"),
                    mcifNo: form.getValues("mcifNo"),
                    mmemberName: form.getValues("mmemberName"),
                    mgurdianName: form.getValues("mgurdianName"),
                    maddress: form.getValues("maddress"),
                    mmobile: form.getValues("mmobile"),
                    BranchName: form.getValues("BranchName"),
                    BranchId: form.getValues("BranchId"),
                    designation: form.getValues("designation"),
                    withdrawnDate: form.getValues("withdrawnDate"),
                    remarks: form.getValues("remarks"),
                    joinongdate: form.getValues("joinongdate"),
                    designationDisplay:
                      designationData?.find(
                        (d) => d.Id === form.getValues("designation"),
                      )?.Option_Value || "N/A",
                  });
                }
                setDialogOpen(false);
                setEditingMember(null);
              }}
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapInstituteMember;
