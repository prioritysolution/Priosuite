"use client";
import { useCallback, useEffect, useState } from "react";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import RadioField from "@/common/formFields/RadioField";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import MemberSearchForm from "@/common/forms/MemberSearchForm";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { addDays, addMonths } from "date-fns";
import { MdDeleteForever } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MemberSearchTable from "@/common/tables/MemberSearchTable";
import { Label } from "@/components/ui/label";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useNewApplication } from "@/container/loan/newApplication/Hooks";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";
import {
  AlertTriangle,
  Users,
  UserCheck,
  UserPlus,
  UserPlusIcon,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import {
  getLoanProductData,
  setCurrentProduct,
  setCurrentProductType,
  setEcsAccountNo,
  resetDeductionList,
} from "@/container/loan/newApplication/NewApplicationReducer";
import CustomRadioField from "@/common/formFields/CustomRadioField";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import DoubleCashDenomTable from "@/common/tables/DoubleCashDenomTable";
import KYCDropdownField from "@/common/formFields/KYCDropdownField";
import { ClipLoader } from "react-spinners";

const ResponsiveTable = ({
  headers, // Array<{ key, label, fullWidth? }>
  rows, // Array<Record<string, ReactNode>>
  footer, // optional ReactNode rendered below desktop table
  emptyIcon: EmptyIcon = Users,
  emptyText = "No records found.",
}) => {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-dashed border-primary/40 rounded-xl bg-muted/20">
        <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
          <EmptyIcon className="w-5 h-5 text-muted-foreground/50" />
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
      {/* ── Mobile cards (< md) ── */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="rounded-xl border border-border bg-white shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-primary/5 border-b border-border gap-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wide">
                # {ri + 1}
              </span>
              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                {row.actions}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3">
              {dataHeaders.map((h) => (
                <div key={h.key} className={h.fullWidth ? "col-span-2" : ""}>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">
                    {h.label}
                  </p>
                  <div className="text-sm font-medium text-foreground break-words">
                    {row[h.key] ?? "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {footer && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-semibold">
            {footer}
          </div>
        )}
      </div>

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-primary hover:bg-primary">
                {headers.map((h) => (
                  <TableHead
                    key={h.key}
                    className="text-white text-[10px] font-bold uppercase tracking-wider whitespace-nowrap px-3 py-3 border-r border-white/20 last:border-r-0"
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
                    <TableCell
                      key={h.key}
                      className="px-3 py-2.5 text-sm border-r border-border/40 last:border-r-0"
                    >
                      {row[h.key] ?? "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
            {footer && (
              <TableFooter>
                <TableRow className="bg-muted/30">{footer}</TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </div>
    </>
  );
};

/* ── Delete button helper ── */
const DeleteBtn = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all"
  >
    <MdDeleteForever className="text-lg" />
  </button>
);

const SectionCard = ({ title, children, headerAction, className = "" }) => (
  <div
    className={`w-full flex flex-col border border-primary rounded-xl p-1 sm:p-2 gap-2 ${className}`}
  >
    {title && (
      <div className="w-full flex items-center justify-between">
        <div className="w-10 h-10 hidden sm:block shrink-0" />
        <h3 className="flex-1 text-center text-base sm:text-lg font-semibold text-foreground">
          {title}
        </h3>
        {headerAction ? (
          <div className="shrink-0 flex items-center justify-end w-10 h-10">
            {headerAction}
          </div>
        ) : (
          <div className="w-10 h-10 hidden sm:block shrink-0" />
        )}
      </div>
    )}
    {children}
  </div>
);

const NewApplication = ({
  loading,
  postNewLoanLoading,
  form,
  externalSecurityTypes,
  handleSubmit,
  handleMemberFormSubmit,
  visibleBlock,
  successMessage,
  setSuccessMessage,
  getProdTypeDataApiCall,
  securityTable,
  disableSecurityType,
  handleAddSecurityTable,
  handleAddExternalSecurityTable,
  handleDeleteSecurityTable,
  handleGuaranteeMemberSearch,
  handleAddGuaranteeTable,
  resetGuaranteeMember,
  guaranteeTable,
  handleDeleteGuaranteeTable,
  guaranteeMemberDetails,
  handleJointAccountAdd,
  handleJointAccountDelete,
  selectedOption,
  setSelectedOption,
  resetTrigger,
  showSuccessMessage,
  handleCloseSuccessMessage,
  amountErrorMessage,
  showEmi,
  loanEligible,
  // CustomerType,
  getGroupDataByIdApiCall,
  getGroupLoading,
  groupData,
  getLoanProductDataApiCall,
  setLoading,
  getCheckLoanEligibleApiCall,
  getCheckLoanSecurityApiCall,
  // isAvailEcs,
  ecsAccount,
  ecsAccountData,

  // transMode,

  savings,
  savingsBalance,

  cashInTransactionTotal,
  cashOutTransactionTotal,
  cashInTransactionGrandTotal,
  cashOutTransactionGrandTotal,

  // operationMode,
  jointHolderDetails,

  // Transaction related
  cashDenomData,
  inDenominators,
  outDenominators,
  handleInDenominatorChange,
  handleOutDenominatorChange,
  bankAccountData,
  insufficientBalanceDisable,
  getNoteDenomApiCall,
  postCheckLoanAmountApiCall,
  getCheckLoanDurationUnitDataApiCall,
  getCheckBalanceApiCall,
  getDeductionListApiCall,
  deductionList,
  FormhandleSubmit,
  cashInDenomArray,
  cashOutDenomArray,
}) => {
  const dispatch = useDispatch();
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");
  const [showBasicInfo, setShowBasicInfo] = useState(true);

  const CustomerType = form.getValues("CustomerType");
  const transMode = form.watch("transMode");

  const productData = useSelector((s) => {
    return s?.newApplication?.loanProductData;
  });

  const loanPurposeData = useSelector((s) => {
    return s?.newApplication?.loanPurpose;
  });

  // console.log("loanPurposeData", loanPurposeData);

  const durationUnitData = useSelector(
    (s) => s?.newApplication?.durationUnitData,
  );
  const repaymentModeData = useSelector(
    (s) => s?.newApplication?.repaymentModeData,
  );
  const securityData = useSelector((s) => s?.newApplication?.securityData);
  const prodTypeData = useSelector((s) => s?.newApplication?.prodTypeData);
  // const ecsAccountData = useSelector((s) => s?.newApplication?.ecsAccountData);
  const ecsAccountNo = useSelector((s) => s?.newApplication?.ecsAccountNo);

  console.log("ecsAccountNo", ecsAccountNo);

  useEffect(() => {
    if (ecsAccountNo && ecsAccountData && ecsAccountData.length > 0) {
      const selectedAccount = ecsAccountData.find(
        (item) => item.Id === ecsAccountNo,
      );

      // console.log("selectedAccount=", selectedAccount);

      if (selectedAccount) {
        form.setValue("savingsName", selectedAccount.Full_Name || "");
        // form.setValue("savingsBalance", selectedAccount.Balance || "");
      }
    }
  }, [ecsAccountNo, ecsAccountData, form]);

  // Close openDialog on successful form submission
  useEffect(() => {
    if (successMessage) {
      setOpenDialog(false);
    }
  }, [successMessage]);

  // Watch form field changes and dispatch to Redux
  const productTypeId = form.watch("productTypeId");
  const productId = form.watch("productId");
  const memberId = form.watch("memberId");
  const isAvailEcs = form.watch("isAvailEcs");
  const applicationAmount = form.watch("applicationAmount");
  const durationUnit = form.watch("durationUnit");
  const duration = form.watch("duration");
  const securityOption = form.watch("securityOption");
  const externalSecurityType = form.watch("externalSecurityType");
  const applicationDate = form.watch("applicationDate");
  const sanctionDate = form.watch("sanctionDate");

  // Reset deduction list when product, amount, or org changes
  useEffect(() => {
    dispatch(resetDeductionList());
  }, [orgId, productId, applicationAmount, dispatch]);

  const memberDataByName = useSelector(
    (s) => s?.issueMembership?.memberDataByName,
  ).filter((item) => item.Cust_No !== form.getValues("memberNo"));

  const currentProductType = useSelector(
    (s) => s?.newApplication?.currentProductType,
  );

  const currentProduct = useSelector((s) => {
    console.log("Full Redux state:", s);
    console.log("newApplication state:", s?.newApplication);
    console.log(
      "currentProduct from Redux:",
      s?.newApplication?.currentProduct,
    );
    return s?.newApplication?.currentProduct;
  });

  console.log("currentProductType=", currentProductType);

  const currentProductData = useSelector((s) => {
    return s?.newApplication?.loanProductData.find(
      (item) => item.Id === currentProduct,
    );
  });



  // Debug finalRepaymentDate value
  const finalRepaymentDate = form.watch("finalRepaymentDate");
  

  const  savingsValue=form.watch("savings")

  useEffect(() => {
    if (savingsValue) {
      getCheckBalanceApiCall(savingsValue, applicationDate, orgId);
    }
  }, [savingsValue, applicationDate, orgId, getCheckBalanceApiCall]);



  console.log("savings", savings);
  

  useEffect(() => {
    if (productId && duration && durationUnit && orgId) {
      getCheckLoanDurationUnitDataApiCall(
        orgId,
        productId,
        duration,
        durationUnit,
      );
    }
  }, [
    productId,
    duration,
    durationUnit,
    orgId,
    getCheckLoanDurationUnitDataApiCall,
  ]);

  useEffect(() => {
    if (productId && applicationAmount && orgId) {
      postCheckLoanAmountApiCall(orgId);
    }
  }, [productId, applicationAmount, orgId, postCheckLoanAmountApiCall]);

  useEffect(() => {
    dispatch(setCurrentProductType(productTypeId));
  }, [productTypeId, dispatch]);

  useEffect(() => {
    console.log("Dispatching setCurrentProduct with:", productId);
    dispatch(setCurrentProduct(productId));
  }, [productId, dispatch]);

  //useState

  const RadioData = [{ label: "Individual Customer", value: "1" }];

  const [jointMemberDialougeOpen, setJointMemberDialougeOpen] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("1");
  const [deleteJointMemberDialougeOpen, setDeleteJointMemberDialougeOpen] =
    useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);

  // useEffect

  useEffect(() => {
    console.log("useEffect triggered - calling getNoteDenomApiCall");
    getNoteDenomApiCall();
  }, [getNoteDenomApiCall]);

  useEffect(() => {
    if (!jointMemberDialougeOpen) {
      form.setValue("dialougeMemberName", "");
      dispatch(getMemberDataByName([]));
    }
  }, [jointMemberDialougeOpen, form, dispatch]);

  useEffect(() => {
    if (currentProductType) {
      getLoanProductDataApiCall(orgId, currentProductType);
    }
  }, [currentProductType, orgId, getLoanProductDataApiCall]);

  useEffect(() => {
    if (currentProduct && memberId) {
      const currentProductData = productData.find(
        (item) => item.Id === currentProduct,
      );
      if (currentProductData) {
        form.setValue("rateOfInterest", currentProductData?.Roi);
      }
      getCheckLoanEligibleApiCall(orgId, currentProduct, memberId);
      getCheckLoanSecurityApiCall(orgId, currentProduct, memberId);
    }
  }, [
    currentProduct,
    memberId,
    productData,
    form,
    orgId,
    getCheckLoanEligibleApiCall,
    getCheckLoanSecurityApiCall,
  ]);

  const {
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

  const handleSearchMember = () => {
    if (form.getValues("dialougeMemberName"))
      getMemberDataByNameApiCall(
        orgId,
        currentMemberPage,
        form.getValues("dialougeMemberName"),
        selectedRadio,
      );
    else toast.error("Please enter name");
  };

  const handleJointAccountAddWithCheck = (memberData) => {
    const jointDetails = form.getValues("jointHolderDetails") || [];
    const memberId = form.getValues("memberId");

    if (jointDetails.length >= 2) {
      toast.error(
        "Maximum 2 joint holders allowed! Please remove one to add another.",
      );
      return;
    }
    if (memberData?.Id === Number(memberId)) {
      toast.error("You Cannot Add Same Customer As Joint Holder!");
      return;
    }
    if (jointDetails.some((jh) => jh.Id === memberData.Id)) {
      toast.error("This member is already added as a joint holder!");
      return;
    }
    if (jointDetails.some((jh) => jh.Cust_No === memberData.Cust_No)) {
      toast.error("A member with this Customer Number already exists!");
      return;
    }
    handleJointAccountAdd(memberData);
    setJointMemberDialougeOpen(false);
  };

  /* ── Security table column definitions ── */
  /* ── Security table column definitions ── */
  const internalHeaders = [
    { key: "sl", label: "#" },
    { key: "certType", label: "Certificate Type" },
    { key: "certNo", label: "Certificate No." },
    { key: "issueDate", label: "Issue Date" },
    { key: "issueAmount", label: "Issue Amount" },
    { key: "roi", label: "ROI" },
    { key: "maturityDate", label: "Maturity Date" },
    { key: "maturityAmount", label: "Maturity Amount", fullWidth: true },
    { key: "actions", label: "Action" },
  ];

  const extType1Headers = [
    { key: "sl", label: "#" },
    { key: "certType", label: "Certificate Type" },
    { key: "certNo", label: "Certificate No." },
    { key: "issueDate", label: "Issue Date" },
    { key: "issueAmount", label: "Issue Amount" },
    { key: "roi", label: "ROI" },
    { key: "maturityDate", label: "Maturity Date" },
    { key: "maturityAmount", label: "Maturity Amount", fullWidth: true },
    { key: "actions", label: "Action" },
  ];

  const extType2Headers = [
    { key: "sl", label: "#" },
    { key: "typeName", label: "Type Name" },
    { key: "location", label: "Property Location" },
    { key: "area", label: "Property Area" },
    { key: "owner", label: "Owner Name" },
    { key: "coOwner", label: "Co Owner Name" },
    { key: "details", label: "Property Details" },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" },
    { key: "secValue", label: "Security Value" },
    { key: "actions", label: "Action" },
  ];

  const extType3Headers = [
    { key: "sl", label: "#" },
    { key: "itemName", label: "Item Name" },
    { key: "itemDetails", label: "Item Details" },
    { key: "brand", label: "Item Brand" },
    { key: "owner", label: "Owner Name" },
    { key: "coOwner", label: "Co Owner Name" },
    { key: "cost", label: "Item Cost" },
    { key: "ownCont", label: "Own Contribution" },
    { key: "actions", label: "Action" },
  ];

  const extType4Headers = [
    { key: "sl", label: "#" },
    { key: "typeName", label: "Type Name" },
    { key: "details", label: "Details" },
    { key: "secValue", label: "Security Value" },
    { key: "actions", label: "Action" },
  ];

  const safeFormatDate = (dateVal) => {
    if (!dateVal) return "—";
    const dateObj = new Date(dateVal);
    if (isNaN(dateObj.getTime())) return String(dateVal);
    return format(dateObj, "dd-MM-yyyy");
  };

  const getDeleteAction = (item) => {
    const originalIndex = securityTable.findIndex((x) => x.Id === item.Id);
    return (
      <DeleteBtn onClick={() => handleDeleteSecurityTable(originalIndex)} />
    );
  };

  const internalItems = securityTable.filter((d) => !d.externalSecurityType);
  const extType1Items = securityTable.filter(
    (d) => d.externalSecurityType === 1,
  );
  const extType2Items = securityTable.filter(
    (d) => d.externalSecurityType === 2,
  );
  const extType3Items = securityTable.filter(
    (d) => d.externalSecurityType === 3,
  );
  const extType4Items = securityTable.filter(
    (d) => d.externalSecurityType === 4,
  );

  const internalRows = internalItems.map((d, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    certType: d?.certificateType || "—",
    certNo: d?.certificateNo || "—",
    issueDate: safeFormatDate(d?.issueDate),
    issueAmount: <span className="tabular-nums">{d?.issueAmount || "—"}</span>,
    roi: d?.roi || "—",
    maturityDate: safeFormatDate(d?.maturityDate),
    maturityAmount: (
      <span className="tabular-nums">{d?.maturityAmount || "—"}</span>
    ),
    actions: getDeleteAction(d),
  }));

  const extType1Rows = extType1Items.map((d, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    certType: d?.certificateType || "—",
    certNo: d?.certificateNo || "—",
    issueDate: safeFormatDate(d?.issueDate),
    issueAmount: <span className="tabular-nums">{d?.issueAmount || "—"}</span>,
    roi: d?.roi || "—",
    maturityDate: safeFormatDate(d?.maturityDate),
    maturityAmount: (
      <span className="tabular-nums">{d?.maturityAmount || "—"}</span>
    ),
    actions: getDeleteAction(d),
  }));

  const extType2Rows = extType2Items.map((d, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    typeName: d?.extTypeName || "—",
    location: d?.extPropertyLocation || "—",
    area: d?.extPropertyArea || "—",
    owner: d?.extOwnerName || "—",
    coOwner: d?.extCoOwnerName || "—",
    details: d?.extPropertyDetails || "—",
    latitude: d?.extLatitude || "—",
    longitude: d?.extLongitude || "—",
    secValue: (
      <span className="tabular-nums">{d?.extSecurityValue || "—"}</span>
    ),
    actions: getDeleteAction(d),
  }));

  const extType3Rows = extType3Items.map((d, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    itemName: d?.extItemName || "—",
    itemDetails: d?.extItemDetails || "—",
    brand: d?.extItemBrand || "—",
    owner: d?.extOwnerName || "—",
    coOwner: d?.extCoOwnerName || "—",
    cost: <span className="tabular-nums">{d?.extItemCost || "—"}</span>,
    ownCont: (
      <span className="tabular-nums">{d?.extOwnContribution || "—"}</span>
    ),
    actions: getDeleteAction(d),
  }));

  const extType4Rows = extType4Items.map((d, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    typeName: d?.extTypeName || "—",
    details: d?.extDetails || "—",
    secValue: (
      <span className="tabular-nums">{d?.extSecurityValue || "—"}</span>
    ),
    actions: getDeleteAction(d),
  }));

  const securityTotal = securityTable.reduce((s, r) => {
    const amt = r.issueAmount
      ? Number(r.issueAmount)
      : r.extItemCost
        ? Number(r.extItemCost)
        : r.extSecurityValue
          ? Number(r.extSecurityValue)
          : 0;
    return s + amt;
  }, 0);

  /* ── Guarantee table column definitions ── */
  const guaranteeHeaders = [
    { key: "sl", label: "#" },
    { key: "name", label: "Member Name" },
    { key: "guardian", label: "Guardian Name" },
    { key: "address", label: "Address", fullWidth: true },
    { key: "actions", label: "Action" },
  ];

  const guaranteeRows = guaranteeTable.map((d, i) => ({
    sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
    name: <span className="font-medium">{d?.guaranteeName || "—"}</span>,
    guardian: d?.guaranteeGuardianName || "—",
    address: d?.guaranteeAddress || "—",
    actions: <DeleteBtn onClick={() => handleDeleteGuaranteeTable(d.Id)} />,
  }));

  /* ── Joint holder table column definitions ── */
  const jointHeaders = [
    { key: "sl", label: "#" },
    { key: "custNo", label: "Cust No." },
    { key: "cifNo", label: "CIF No." },
    { key: "name", label: "Full Name" },
    { key: "relation", label: "Relation" },
    { key: "actions", label: "Action" },
  ];

  const watchedJointHolders = form.watch("jointHolderDetails") || [];

  const jointRows = watchedJointHolders.map((item, i) => {
    return {
      sl: <span className="text-muted-foreground text-xs">{i + 1}</span>,
      custNo: (
        <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded">
          {item.Cust_No || "—"}
        </span>
      ),
      cifNo: (
        <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded">
          {item.CIF_No || "—"}
        </span>
      ),
      name: (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
            <UserPlus className="w-3 h-3 text-primary" />
          </div>
          <span className="font-medium truncate">{item.Full_Name || "—"}</span>
        </div>
      ),
      relation: (
        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200">
          {item.Relation_Name || "—"}
        </span>
      ),
      actions: (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="flex  gap-2 bg-destructive/10 md:px-4 md:py-2 px-2 py-1 rounded text-destructive hover:bg-destructive hover:text-white transition-all"
            >
              <MdDeleteForever className="text-lg" /> Remove
            </button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-1rem)] max-w-sm p-4 sm:p-5 rounded-2xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-destructive" />
              </div>
              <div className="min-w-0 w-full">
                <h3 className="text-base font-semibold mb-1">
                  Remove Joint Holder
                </h3>
                <p className="text-sm text-muted-foreground break-words">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold text-foreground">
                    {item.Full_Name}
                  </span>
                  ?
                </p>
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1 w-full"
                  onClick={() => setDeleteJointMemberDialougeOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 w-full"
                  onClick={() =>
                    handleJointAccountDelete(item.Id || item.Cust_Id)
                  }
                >
                  <MdDeleteForever className="mr-1.5 text-base" /> Remove
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    };
  });

  const existingHeaders = [
    { key: "sl", label: "#" },
    { key: "name", label: "Member Name" },
    { key: "cif", label: "CIF No." },
    { key: "designation", label: "Designation" },
    { key: "relation", label: "Relation" },
    { key: "joinDate", label: "Joining Date" },
    { key: "savings", label: "Savings A/C", fullWidth: true },
    { key: "applactioamount", label: "Application Amount" },
  ];

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
    designation: m.Designation || "N/A",
    relation: m.Relation_Name || "N/A",
    joinDate: (
      <span className="text-muted-foreground whitespace-nowrap">
        {m.Joinong_Date || "N/A"}
      </span>
    ),
    applactioamount: (
      <Input
        type="number"
        className="border border-primary-50 shadow-sm"
        defaultValue={m.Application_Amount || ""}
        onChange={(e) => {
          let value = e.target.value;

          // Allow empty value and backspace
          if (value === "") {
            const members = form.getValues("member_info") || [];
            members[i] = { ...members[i], Application_Amount: "" };
            form.setValue("member_info", members);
            return;
          }

          // Check decimal places and prevent more than 2
          if (value.includes(".")) {
            const parts = value.split(".");
            if (parts[1] && parts[1].length > 2) {
              // Prevent typing more than 2 decimal places
              value = parts[0] + "." + parts[1].substring(0, 2);
              e.target.value = value;
            }
          }

          // Update form value
          const members = form.getValues("member_info") || [];
          members[i] = { ...members[i], Application_Amount: e.target.value };
          form.setValue("member_info", members);
        }}
        onKeyDown={(e) => {
          // Prevent typing more than 2 decimal places
          const value = e.target.value;
          if (value.includes(".")) {
            const parts = value.split(".");
            if (parts[1] && parts[1].length >= 2) {
              // Prevent typing more digits after 2 decimal places
              if (e.key >= "0" && e.key <= "9") {
                e.preventDefault();
              }
            }
          }
        }}
        placeholder="0.00"
        min="0"
        step="0.01"
      />
    ),
  }));

  const openHeaders = [
    { key: "sl", label: "#" },
    { key: "DeductionName", label: "Charge Name" },
    { key: "FinalCharge", label: "Amount" },
  ];

  const openRows = (deductionList || []).map((item, index) => ({
    sl: <span className="text-muted-foreground text-xs">{index + 1}</span>,
    DeductionName: (
      <span className="font-medium whitespace-nowrap">
        {item.Deduction_Name || "N/A"}
      </span>
    ),
    FinalCharge: (
      <span className="text-muted-foreground whitespace-nowrap">
        {item.Final_Charge ? parseFloat(item.Final_Charge).toFixed(2) : "0.00"}
      </span>
    ),
  }));

  const handleDialogSubmit = () => {
    // Get form data and directly call handleFormSubmit
    form.handleSubmit(handleFormSubmit, (errors) => {
      console.log("Validation errors:", errors);
      const firstError = Object.values(errors)[0];
      if (firstError) {
        toast.error(firstError.message || "Please check the form for errors");
      }
    })();
  };

  const handleFormSubmit = (data) => {
    const fullData = {
      ...data,
      securityTable,
      guaranteeTable,
      cashInDenomArray,
      cashOutDenomArray,
      cashInTransactionGrandTotal,
      cashOutTransactionGrandTotal,
      deductionList,
    };
    console.log(
      "Submitting loan application with ALL captured data:",
      fullData,
    );

    // const operationMode = data.operationMode || form.getValues("operationMode");
    // const jointHolderDetails = data.jointHolderDetails || form.getValues("jointHolderDetails") || [];

    // if (
    //   (operationMode === "71" || operationMode === "72") &&
    //   jointHolderDetails.length === 0
    // ) {
    //   toast.error("At least one joint member is required");
    //   return;
    // }

    FormhandleSubmit(data, deductionList);
  };

  const [isActiveDenom, setIsActiveDenom] = useState(false);

  useEffect(() => {
    // Initialize form values or perform any setup needed
    if (window !== "undefined") {
      setIsActiveDenom(!!getCookieData("userIsActiveDenomination"));
    }
  }, []);

  useEffect(() => {
    console.log("Final Repayment Date useEffect triggered");
    // const appDate = form.getValues("applicationDate");
    // const sancDate = form.getValues("sanctionDate");
    const appDate = applicationDate;
    const sancDate = sanctionDate;

    // The UI uses sanctionDate for "Application Date"
    const effectiveDate = sancDate || appDate;

    console.log("Final Repayment Date Calculation index:", {
      duration,
      durationUnit,
      effectiveDate,
      appDate,
      sancDate,
      durationUnitType: typeof durationUnit,
      hasDuration: !!duration,
      hasDurationUnit: !!durationUnit,
      hasEffectiveDate: !!effectiveDate,
    });

    // Force calculation if all values exist
    if (duration && durationUnit && effectiveDate) {
      try {
        let parsedDate;
        if (effectiveDate instanceof Date) {
          parsedDate = effectiveDate;
        } else {
          // Try parsing common formats if it's a string
          parsedDate = new Date(effectiveDate);
          if (isNaN(parsedDate.getTime())) {
            // Fallback to parse from date-fns if standard Date constructor fails
            parsedDate = parse(effectiveDate, "yyyy-MM-dd", new Date());
          }
        }

        if (isNaN(parsedDate.getTime())) {
          console.log("Invalid date detected");
          return;
        }

        let finalDate;
        const durationUnitStr = String(durationUnit);
        console.log(
          "Duration unit value:",
          durationUnitStr,
          typeof durationUnitStr,
        );

        if (durationUnitStr === "1") {
          // Days calculation
          finalDate = addDays(parsedDate, Number(duration));
          console.log(`Adding ${duration} days to`, parsedDate);
        } else if (durationUnitStr === "2") {
          // Months calculation
          finalDate = addMonths(parsedDate, Number(duration));
          console.log(`Adding ${duration} months to`, parsedDate);
        } else {
          form.setValue("finalRepaymentDate", "");
          return;
        }

        // Set the final repayment date as a Date object
        console.log("Setting final repayment date to:", finalDate);
        form.setValue("finalRepaymentDate", finalDate);
        // Force a re-render by triggering a form update
        form.trigger("finalRepaymentDate");
        // Additional force update
        setTimeout(() => {
          form.setValue("finalRepaymentDate", finalDate);
        }, 100);
      } catch (error) {
        console.error("Error calculating final repayment date:", error);
        form.setValue("finalRepaymentDate", "");
      }
    } else {
      console.log("Missing required values for calculation");
    }
  }, [duration, durationUnit, applicationDate, sanctionDate, form]);

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="w-full h-full flex justify-between  bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col items-center border-primary rounded-lg border-2 p-2 sm:p-3 w-full gap-3 overflow-hidden">
        {/* <h3 className="text-lg sm:text-xl font-semibold">New Application</h3> */}

        <ScrollArea className="w-full h-full px-1">
          {/* Member Search */}
          <div className="w-full mb-3">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              showDate
              resetTrigger={resetTrigger}
              formLabel="New Application"
            />
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="w-full flex flex-col gap-4"
              autoComplete="off"
            >
              {/* ── 1. Basic Info ── */}
              {visibleBlock && (
                <SectionCard
                  title="Basic Info Block"
                  headerAction={
                    <button
                      type="button"
                      onClick={() => setShowBasicInfo(!showBasicInfo)}
                      className="p-1.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
                      title={showBasicInfo ? "Hide Details" : "Show Details"}
                    >
                      {showBasicInfo ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                  }
                >
                  {showBasicInfo && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
                      {[
                        { name: "memberName", label: "Member Name" },
                        { name: "gurdianName", label: "Guardian Name" },
                        { name: "mobile", label: "Mobile No." },
                        { name: "memberType", label: "Member Type" },
                        { name: "CustType", label: "Customer Type" },
                        { name: "shareBalance", label: "Share Balance" },
                      ].map(({ name, label }) => (
                        <FormField
                          key={name}
                          control={form.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{label}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`Enter ${label.toLowerCase()}`}
                                  {...field}
                                  readOnly
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="sm:col-span-2 xl:col-span-1">
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter address"
                                {...field}
                                readOnly
                                className="resize-none"
                                rows={2}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="branchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                className={cn(
                                  "h-9",
                                  branchId === form.getValues("BranchId")
                                    ? "bg-muted/40"
                                    : "bg-red-50 border-red-300 text-red-600",
                                )}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </SectionCard>
              )}

              {/* ── 2. Application Info ── */}
              {visibleBlock && (
                <SectionCard title="Application Info Block">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
                    <DatePickerField
                      control={form.control}
                      name="sanctionDate"
                      label="Application Date"
                      onPopover
                      isRequired
                    />

                    {/* <FormField
                      control={form.control}
                      name="operationMode"
                      render={({ field }) => (
                        <DropdownField
                          label="Operation Mode"
                          options={[
                            { label: "Self", value: "70" },
                            { label: "Joint - Either or Survivor", value: "71" },
                            { label: "Joint - Former or Survivor", value: "72" },
                          ]}
                          {...field}
                        />
                      )}
                    /> */}

                    <FormField
                      control={form.control}
                      name="applicationNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Case No.{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter application no."
                              {...field}
                              className="h-9"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productTypeId"
                      render={({ field }) => (
                        <KYCDropdownField
                          label="Product Type"
                          value={field.value}
                          onChange={field.onChange}
                          options={prodTypeData}
                          optionValueKey="Option_Value"
                          placeholder="Select product type"
                          searchPlaceholder="Search..."
                          isRequired
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <KYCDropdownField
                          label="Product"
                          value={field.value}
                          onChange={field.onChange}
                          options={productData}
                          optionLabelKey="Prod_Sh_Name"
                          placeholder="Select product"
                          searchPlaceholder="Search..."
                          isRequired
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="loanPurpose"
                      render={({ field }) => {
                        return (
                          <DropdownField
                            label="Loan Purpose"
                            value={field.value}
                            onChange={field.onChange}
                            options={loanPurposeData} // Using test data for now
                            optionLabelKey="Purpose_Name"
                            placeholder="Select loan purpose"
                            searchPlaceholder="Search..."
                            isRequired
                          />
                        );
                      }}
                    />

                    {/* <FormField
                      control={form.control}
                      name="applicationAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Application Amount <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter amount"
                              readOnly={!loanEligible}
                              {...field}
                              className="h-9"
                            />
                          </FormControl>
                          <FormMessage />
                          {amountErrorMessage && (
                            <p className="text-destructive text-xs">
                              {amountErrorMessage}
                            </p>
                          )}
                        </FormItem>
                      )}
                    /> */}
                    <InputField
                      label="Application Amount"
                      name="applicationAmount"
                      control={form.control}
                      placeholder="Enter amount"
                      readOnly={!loanEligible}
                      isBlurUpdate
                      hint={amountErrorMessage}
                      isRequired
                    />

                    <FormField
                      control={form.control}
                      name="rateOfInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Rate Of Interest{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              {...field}
                              className="h-9 bg-muted/40"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Duration{" "}
                            <span className="text-red-500 ml-1">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter duration"
                              readOnly={!loanEligible}
                              {...field}
                              className="h-9"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationUnit"
                      render={({ field }) => (
                        <DropdownField
                          label="Duration Unit"
                          value={field.value}
                          onChange={field.onChange}
                          options={durationUnitData}
                          optionLabelKey="Option_Value"
                          placeholder="Select unit"
                          searchPlaceholder="Search..."
                          disabled={
                            !form.getValues("productId") && !loanEligible
                          }
                          isRequired
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="repaymentMode"
                      render={({ field }) => (
                        <DropdownField
                          label="Repayment Mode"
                          value={field.value}
                          onChange={field.onChange}
                          options={repaymentModeData}
                          optionLabelKey="Option_Value"
                          placeholder="Select mode"
                          searchPlaceholder="Search..."
                          disabled={
                            !form.getValues("productId") && !loanEligible
                          }
                          isRequired
                        />
                      )}
                    />

                    <DatePickerField
                      control={form.control}
                      name="finalRepaymentDate"
                      label="Final Repayment Date"
                      disabled={true}
                    />

                    {showEmi && (
                      <FormField
                        control={form.control}
                        name="emiAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EMI Amount</FormLabel>
                            <FormControl>
                              <Input
                                readOnly
                                {...field}
                                className="h-9 bg-muted/40"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="isAvailEcs"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Is Avail ECS
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              // disabled={
                              //   checkDepositAmountDisable ||
                              //   !allowProcessDeposit
                              // }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ecsAccount"
                      render={({ field }) => (
                        <DropdownField
                          label="ECS Account"
                          value={field.value}
                          onChange={field.onChange}
                          options={ecsAccountData}
                          optionLabelKey="Account_No" // Specify the key for label
                          disabled={!isAvailEcs}
                        />
                      )}
                    />

                    <div className="flex items-end h-9 mt-5">
                      <button
                        type="button"
                        onClick={() => setJointMemberDialougeOpen(true)}
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:bg-primary/90 transition-all active:scale-95 h-9 w-full sm:w-auto whitespace-nowrap"
                      >
                        <UserPlusIcon className="w-4 h-4" />
                        Add Joint Member Details
                      </button>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* ── Joint Member Search Dialog ── */}
              {visibleBlock && (
                <Dialog
                  open={jointMemberDialougeOpen}
                  onOpenChange={setJointMemberDialougeOpen}
                >
                  <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-2xl">
                    <DialogHeader className="shrink-0 pr-8 text-left">
                      <DialogTitle className="text-base sm:text-lg">
                        Search Members
                      </DialogTitle>
                    </DialogHeader>

                    <RadioGroup
                      defaultValue="1"
                      value={selectedRadio}
                      onValueChange={setSelectedRadio}
                      className="flex flex-wrap items-center gap-x-3 gap-y-2 shrink-0"
                    >
                      {RadioData.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 min-w-0"
                        >
                          <RadioGroupItem value={item.value} id={item.value} />
                          <Label
                            htmlFor={item.value}
                            className="text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                          >
                            {item.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="w-full min-h-0 flex-1 flex flex-col gap-3 overflow-hidden">
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 shrink-0">
                        <FormField
                          control={form.control}
                          name="dialougeMemberName"
                          render={({ field }) => (
                            <FormItem className="flex-1 min-w-0">
                              <FormLabel>Member Name</FormLabel>
                              <FormControl>
                                <Input
                                  autoComplete="off"
                                  placeholder="Search by member name"
                                  {...field}
                                  className="h-9"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          onClick={handleSearchMember}
                          className="h-9 w-full sm:w-auto sm:px-8 shrink-0"
                        >
                          Search
                        </Button>
                      </div>

                      <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl border border-border">
                        <MemberSearchTable
                          data={memberDataByName}
                          handleSelectData={handleJointAccountAddWithCheck}
                          currentMemberPage={currentMemberPage}
                          setCurrentMemberPage={setCurrentMemberPage}
                          lastMemberPage={lastMemberPage}
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* ── 3. Joint Holder Details ── */}
              {visibleBlock && watchedJointHolders.length > 0 && (
                <SectionCard title="Joint Holder's Details">
                  <ResponsiveTable
                    headers={jointHeaders}
                    rows={jointRows}
                    emptyIcon={UserPlus}
                    emptyText="No joint holders added yet. Click 'Add Joint Member Details' above."
                  />
                </SectionCard>
              )}

              {/* ── 4. Security Options ── */}
              {visibleBlock && productId && (
                <SectionCard title="Loan Based On">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name="securityOption"
                        render={({ field }) => {
                          console.log("CustomerType=", CustomerType);

                          const securityOptionsList = [
                            {
                              value: "SECURITY",
                              label: "Security Based",
                              show:
                                CustomerType !== 2 &&
                                CustomerType !== 3 &&
                                currentProductData?.Is_Mortg !== 0,
                            },
                            {
                              value: "GUARANTEE",
                              label: "Guarantor Based",
                              show:
                                CustomerType !== 2 &&
                                CustomerType !== 3 &&
                                currentProductData?.Is_Gurr !== 0,
                            },
                            {
                              value: "PROJECT",
                              label: "Project Based",
                              show:
                                CustomerType !== 2 &&
                                CustomerType !== 3 &&
                                currentProductData?.Is_Project !== 0,
                            },
                            {
                              value: "GROUP",
                              label: "Group Based",
                              show: CustomerType === 2 || CustomerType === 3,
                            },
                          ].filter((opt) => opt.show);

                          return (
                            <CustomRadioField
                              // label="Select Loan Security Type"
                              value={field.value}
                              onChange={field.onChange}
                              customStyle
                              options={securityOptionsList}
                              disabled={!productId}
                            />
                          );
                        }}
                      />
                    </div>

                    {securityOption && (
                      <div className="shrink-0 flex items-center md:mt-5">
                        <Button
                          type="button"
                          onClick={() => setSecurityDialogOpen(true)}
                          className="w-full sm:w-auto text-white bg-primary hover:bg-primary/95 transition-colors px-10"
                        >
                          <Plus className="w-4 h-4 mr-2" /> Add
                        </Button>
                      </div>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* it opendilog button  */}
              {visibleBlock && (
                <div className="flex justify-end w-full">
                  <Button
                    type="button"
                    variant="default"
                    className="w-full sm:w-auto px-10"
                    onClick={async () => {
                      // Validate all form fields before opening dialog
                      const isValid = await form.trigger();

                      if (!isValid) {
                        toast.error(`Please All Field is required`);
                        return;
                      }

                      const productId = form.getValues("productId");
                      const applicationAmount =
                        form.getValues("applicationAmount");

                      setLoading(true);
                      try {
                        const result = await getDeductionListApiCall(
                          orgId,
                          productId,
                          applicationAmount,
                        );
                        if (result && result.hasData) {
                          setOpenDialog(true);
                        } else {
                          // Call FormhandleSubmit directly (submit)
                          const data = form.getValues();
                          const fullData = {
                            ...data,
                            securityTable,
                            guaranteeTable,
                            cashInDenomArray,
                            cashOutDenomArray,
                            cashInTransactionGrandTotal,
                            cashOutTransactionGrandTotal,
                            deductionList: [],
                          };
                          FormhandleSubmit(fullData, []);
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to process deductions");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading || postNewLoanLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>

      {/* openDialog  */}
      <Dialog open={openDialog}>
        <DialogContent
          hideClose
          className="w-[calc(100vw-1rem)] sm:max-w-[90vw] lg:max-w-[80vw] h-[min(92dvh,900px)] sm:h-auto sm:max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-xl"
        >
          <ScrollArea className="flex-1 min-h-0 overflow-auto">
            <div className="p-3 sm:p-6">
              <ResponsiveTable
                headers={openHeaders}
                rows={openRows}
                emptyIcon={Users}
                emptyText="No existing members found for this group."
                footer={
                  deductionList && deductionList.length > 0 ? (
                    <>
                      {/* Desktop footer cells */}
                      <TableCell colSpan={2} className="text-xs font-bold">
                        Grand Total
                      </TableCell>
                      <TableCell className="text-start text-xs font-bold tabular-nums">
                        {deductionList
                          .reduce(
                            (sum, item) =>
                              sum + parseFloat(item.Final_Charge || 0),
                            0,
                          )
                          .toFixed(2)}
                      </TableCell>
                    </>
                  ) : null
                }
              />

              {/* ── Transaction block ── */}
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-2 sm:px-5 gap-2 my-4 sm:my-5">
                  <h3 className="w-full text-center text-lg sm:text-xl font-semibold">
                    Transanction Block
                  </h3>
                  {loading ? (
                    <div className="w-full flex flex-col gap-3">
                      <Skeleton className=" h-10 w-full lg:w-[400px] bg-secondary " />
                      <div className="w-full max-w-48 flex flex-col gap-[10px]">
                        <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
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
                                  {/* {Number(CustomerType) !== 1 && ( */}
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="savings" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      Savings
                                    </FormLabel>
                                  </FormItem>
                                  {/* )} */}
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
                              handleInDenominatorChange={
                                handleInDenominatorChange
                              }
                              handleOutDenominatorChange={
                                handleOutDenominatorChange
                              }
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
                  )}
                </div>
              )}

              {/* Add setion  */}
              {visibleBlock && (
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto sm:min-w-[120px]"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="w-full sm:w-auto sm:min-w-[120px]"
                    onClick={handleDialogSubmit}
                    disabled={
                      postNewLoanLoading ||
                      (transMode === "cash" &&
                        isActiveDenom &&
                        Number(cashInTransactionGrandTotal) -
                          Number(cashOutTransactionGrandTotal) !==
                          Number(form.getValues("applicationAmount"))) ||
                      !Number(form.getValues("applicationAmount")) ||
                      (transMode === "bank" && !form.getValues("bank")) ||
                      (transMode === "savings" && !savings) ||
                      insufficientBalanceDisable
                    }
                  >
                    {postNewLoanLoading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={20}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />

      {/* ── Security Configuration Dialog ── */}
      <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[90vw] lg:max-w-7xl h-[min(92dvh,900px)] sm:h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-xl">
          <DialogHeader className="p-3 sm:p-6 pb-3 sm:pb-4 border-b shrink-0 pr-10">
            <DialogTitle className="text-base sm:text-lg font-semibold">
              {securityOption === "SECURITY" && "Security Details"}
              {securityOption === "GUARANTEE" && "Guarantee Details"}
              {securityOption === "PROJECT" && "Project Details"}
              {securityOption === "GROUP" && "Existing Group Members"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0 overflow-auto p-3 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* ── 5. Security Details ── */}
              {securityOption === "SECURITY" && (
                <div className="space-y-4">
                  {/* Security type radio + input row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
                    <FormField
                      control={form.control}
                      name="securityType"
                      render={({ field }) => (
                        <RadioField
                          label="Security Type"
                          value={field.value}
                          onChange={field.onChange}
                          customStyle
                          options={[
                            { value: "E", label: "External" },
                            { value: "I", label: "Internal" },
                          ]}
                          className="border border-input p-2 rounded-lg"
                          disabled={
                            disableSecurityType || securityTable.length > 0
                          }
                        />
                      )}
                    />

                    {form.getValues("securityType") === "I" && (
                      <div className="flex gap-3 items-end">
                        <div className="flex-1 min-w-0">
                          <FormField
                            control={form.control}
                            name="securityAccount"
                            render={({ field }) => (
                              <DropdownField
                                label="Security Account"
                                value={field.value}
                                onChange={field.onChange}
                                options={securityData.filter(
                                  (d) =>
                                    !securityTable.some((t) => d.Id === t.Id) &&
                                    Number(d.Balance) > 0,
                                )}
                                optionLabelKey="Account_No"
                                placeholder="Select account"
                                searchPlaceholder="Search..."
                              />
                            )}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleAddSecurityTable(
                              securityData?.find(
                                (d) =>
                                  d.Id.toString() ===
                                  form.getValues("securityAccount"),
                              ),
                            )
                          }
                          className="h-10 w-10 shrink-0 bg-primary text-white rounded-lg flex items-center justify-center text-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    )}

                    {form.getValues("securityType") === "E" && (
                      <>
                        <FormField
                          control={form.control}
                          name="externalSecurityType"
                          render={({ field }) => (
                            <DropdownField
                              label="External Security Type"
                              value={field.value}
                              onChange={(val) => {
                                field.onChange(val);
                                // Reset fields on change
                                form.setValue("certificateType", "");
                                form.setValue("certificateNumber", "");
                                form.setValue("issueDate", "");
                                form.setValue("issueAmount", "");
                                form.setValue("roi", "");
                                form.setValue("maturityDate", "");
                                form.setValue("maturityAmount", "");
                                form.setValue("extTypeName", "");
                                form.setValue("extPropertyLocation", "");
                                form.setValue("extPropertyArea", "");
                                form.setValue("extOwnerName", "");
                                form.setValue("extCoOwnerName", "");
                                form.setValue("extPropertyDetails", "");
                                form.setValue("extLatitude", "");
                                form.setValue("extLongitude", "");
                                form.setValue("extItemName", "");
                                form.setValue("extItemDetails", "");
                                form.setValue("extItemBrand", "");
                                form.setValue("extItemCost", "");
                                form.setValue("extOwnContribution", "");
                                form.setValue("extDetails", "");
                              }}
                              options={externalSecurityTypes}
                              optionLabelKey="Option_Value"
                              placeholder="Select security type"
                              searchPlaceholder="Search type..."
                            />
                          )}
                        />

                        {Number(externalSecurityType) === 1 && (
                          <>
                            <InputField
                              control={form.control}
                              name="certificateType"
                              label="Certificate Type"
                              placeholder="Enter certificate type"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="certificateNumber"
                              label="Certificate No."
                              placeholder="Enter certificate no."
                              isRequired
                            />
                            <DatePickerField
                              control={form.control}
                              name="issueDate"
                              label="Deposit Date"
                              disabledDateAfter={new Date()}
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="issueAmount"
                              label="Deposit Amount"
                              placeholder="Enter deposit amount"
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="roi"
                              label="ROI"
                              placeholder="Enter ROI"
                            />
                            <DatePickerField
                              control={form.control}
                              name="maturityDate"
                              label="Maturity Date"
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="maturityAmount"
                              label="Maturity Amount"
                              placeholder="Enter maturity amount"
                              isRequired
                            />
                          </>
                        )}

                        {Number(externalSecurityType) === 2 && (
                          <>
                            <InputField
                              control={form.control}
                              name="extTypeName"
                              label="Type Name"
                              placeholder="Enter type name"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extPropertyLocation"
                              label="Property Location"
                              placeholder="Enter property location"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extPropertyArea"
                              label="Property Area"
                              placeholder="Enter property area"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extOwnerName"
                              label="Owner Name"
                              placeholder="Enter owner name"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extCoOwnerName"
                              label="Co Owner Name (If Any)"
                              placeholder="Enter co owner name"
                            />
                            <InputField
                              control={form.control}
                              name="extPropertyDetails"
                              label="Property Details"
                              placeholder="Enter Mouza Dag & Khatian No"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extLatitude"
                              label="Latitude"
                              placeholder="Enter latitude"
                            />
                            <InputField
                              control={form.control}
                              name="extLongitude"
                              label="Longitude"
                              placeholder="Enter longitude"
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extSecurityValue"
                              label="Security Value"
                              placeholder="Enter security value"
                              isRequired
                            />
                          </>
                        )}

                        {Number(externalSecurityType) === 3 && (
                          <>
                            <InputField
                              control={form.control}
                              name="extItemName"
                              label="Item Name"
                              placeholder="Enter item name"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extItemDetails"
                              label="Item Details"
                              placeholder="Enter Registration Number Etc"
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extItemBrand"
                              label="Item Brand"
                              placeholder="Enter item brand"
                            />
                            <InputField
                              control={form.control}
                              name="extOwnerName"
                              label="Owner Name"
                              placeholder="Enter owner name"
                            />
                            <InputField
                              control={form.control}
                              name="extCoOwnerName"
                              label="Co Owner Name"
                              placeholder="Enter co owner name"
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extItemCost"
                              label="Item Cost"
                              placeholder="Enter item cost"
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extOwnContribution"
                              label="Own Contribution"
                              placeholder="Enter own contribution"
                              isRequired
                            />
                          </>
                        )}

                        {Number(externalSecurityType) === 4 && (
                          <>
                            <InputField
                              control={form.control}
                              name="extTypeName"
                              label="Type Name"
                              placeholder="Enter type name"
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extSecurityValue"
                              label="Security Value"
                              placeholder="Enter security value"
                              isRequired
                            />
                            <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                              <TextareaField
                                control={form.control}
                                name="extDetails"
                                label="Details"
                                placeholder="Enter details"
                                className="resize-none"
                                rows={3}
                                isRequired
                              />
                            </div>
                          </>
                        )}

                        {externalSecurityType && (
                          <div className="col-span-1 lg:col-span-2 xl:col-span-3 flex justify-end">
                            <button
                              type="button"
                              onClick={handleAddExternalSecurityTable}
                              className="h-10 bg-primary text-white text-sm font-medium rounded-lg px-6 hover:bg-primary/90 transition-colors"
                            >
                              Add To Table
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Security ResponsiveTable */}
                  {form.getValues("securityType") && (
                    <div className="space-y-4">
                      {form.getValues("securityType") === "I" &&
                        internalItems.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                              Internal Deposit Security
                            </h4>
                            <ResponsiveTable
                              headers={internalHeaders}
                              rows={internalRows}
                              emptyText="No internal security records added yet."
                            />
                          </div>
                        )}

                      {form.getValues("securityType") === "E" && (
                        <>
                          {extType1Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Deposit/Certificate Security Details
                              </h4>
                              <ResponsiveTable
                                headers={extType1Headers}
                                rows={extType1Rows}
                                emptyText="No records added yet."
                              />
                            </div>
                          )}

                          {extType2Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Property Security Details
                              </h4>
                              <ResponsiveTable
                                headers={extType2Headers}
                                rows={extType2Rows}
                                emptyText="No records added yet."
                              />
                            </div>
                          )}

                          {extType3Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Hypothecation
                              </h4>
                              <ResponsiveTable
                                headers={extType3Headers}
                                rows={extType3Rows}
                                emptyText="No records added yet."
                              />
                            </div>
                          )}

                          {extType4Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                Other Security Details
                              </h4>
                              <ResponsiveTable
                                headers={extType4Headers}
                                rows={extType4Rows}
                                emptyText="No records added yet."
                              />
                            </div>
                          )}
                        </>
                      )}

                      {/* Total security amount */}
                      {securityTable.length > 0 && (
                        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border border-border rounded-xl text-sm font-semibold">
                          <span>Total Security Value</span>
                          <span className="tabular-nums">
                            {securityTotal.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Max Allow / Max Loan Amount */}
                  {form.getValues("securityType") === "I" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                      <FormField
                        control={form.control}
                        name="maxAllow"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Allow</FormLabel>
                            <Input
                              placeholder="Enter max allow"
                              {...field}
                              readOnly={disableSecurityType}
                              className="h-9"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxLoanAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Loan Amount</FormLabel>
                            <Input
                              placeholder="Max loan amount"
                              {...field}
                              readOnly
                              className="h-9 bg-muted/40"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* ── 6. Guarantee Details ── */}
              {securityOption === "GUARANTEE" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-3">
                    <MemberSearchForm
                      handleSubmit={handleGuaranteeMemberSearch}
                      resetTrigger={resetGuaranteeMember}
                      className="border-none p-0"
                      insidePosition
                    />
                    {[
                      { name: "guaranteeName", label: "Member Name" },
                      {
                        name: "guaranteeGuardianName",
                        label: "Guardian Name",
                      },
                    ].map(({ name, label }) => (
                      <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{label}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter ${label.toLowerCase()}`}
                                {...field}
                                readOnly
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}

                    <FormField
                      control={form.control}
                      name="guaranteeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Member Address</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter member address"
                              {...field}
                              readOnly
                              className="resize-none"
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (guaranteeMemberDetails) handleAddGuaranteeTable();
                      }}
                      className={cn(
                        "h-10 self-end text-sm font-medium rounded-lg text-white transition-colors",
                        guaranteeMemberDetails
                          ? "bg-primary hover:bg-primary/90 cursor-pointer"
                          : "bg-gray-300 cursor-not-allowed opacity-60",
                      )}
                    >
                      Add To Table
                    </button>
                  </div>

                  <ResponsiveTable
                    headers={guaranteeHeaders}
                    rows={guaranteeRows}
                    emptyText="No guarantors added yet."
                  />
                </div>
              )}

              {/* ── 7. Project Details ── */}
              {securityOption === "PROJECT" && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter project name"
                            {...field}
                            className="h-9"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4 mt-2">
                    <FormField
                      control={form.control}
                      name="projectcost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Cost</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder="Enter project cost"
                              {...field}
                              className="h-9"
                              onChange={(e) => {
                                let value = e.target.value;

                                if (value === "") {
                                  field.onChange("");
                                  return;
                                }

                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length > 2) {
                                    value =
                                      parts[0] + "." + parts[1].substring(0, 2);
                                    e.target.value = value;
                                  }
                                }

                                field.onChange(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                const value = e.target.value;
                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length >= 2) {
                                    if (e.key >= "0" && e.key <= "9") {
                                      e.preventDefault();
                                    }
                                  }
                                }
                              }}
                              step="0.01"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectowncont"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Own Contribution</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder="Enter project own contribution"
                              {...field}
                              className="h-9"
                              onChange={(e) => {
                                let value = e.target.value;

                                if (value === "") {
                                  field.onChange("");
                                  return;
                                }

                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length > 2) {
                                    value =
                                      parts[0] + "." + parts[1].substring(0, 2);
                                    e.target.value = value;
                                  }
                                }

                                field.onChange(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                const value = e.target.value;
                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length >= 2) {
                                    if (e.key >= "0" && e.key <= "9") {
                                      e.preventDefault();
                                    }
                                  }
                                }
                              }}
                              step="0.01"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border border-black rounded-lg p-2 my-2">
                    <Label className="flex justify-center items-center mb-2">
                      Project Location
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-2">
                      <FormField
                        control={form.control}
                        name="projectmouza"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mouza</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter project mouza"
                                {...field}
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectplotno"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plot No.</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter project plot no."
                                {...field}
                                className="h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="projectland"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Land Offered As Security (In Acre)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter project Land Offered As Security (In Acre)"
                            {...field}
                            className="h-9"
                            type={"number"}
                            onChange={(e) => {
                              let value = e.target.value;

                              if (value === "") {
                                field.onChange("");
                                return;
                              }

                              if (value.includes(".")) {
                                const parts = value.split(".");
                                if (parts[1] && parts[1].length > 2) {
                                  value =
                                    parts[0] + "." + parts[1].substring(0, 2);
                                  e.target.value = value;
                                }
                              }

                              field.onChange(e.target.value);
                            }}
                            onKeyDown={(e) => {
                              const value = e.target.value;
                              if (value.includes(".")) {
                                const parts = value.split(".");
                                if (parts[1] && parts[1].length >= 2) {
                                  if (e.key >= "0" && e.key <= "9") {
                                    e.preventDefault();
                                  }
                                }
                              }
                            }}
                            step="0.01"
                            min="0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-2">
                    <FormField
                      control={form.control}
                      name="projecthypothicated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hypothicated Value</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder="Enter project Hypothicated Value"
                              {...field}
                              className="h-9"
                              onChange={(e) => {
                                let value = e.target.value;

                                if (value === "") {
                                  field.onChange("");
                                  return;
                                }

                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length > 2) {
                                    value =
                                      parts[0] + "." + parts[1].substring(0, 2);
                                    e.target.value = value;
                                  }
                                }

                                field.onChange(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                const value = e.target.value;
                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length >= 2) {
                                    if (e.key >= "0" && e.key <= "9") {
                                      e.preventDefault();
                                    }
                                  }
                                }
                              }}
                              step="0.01"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="projectincome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Income Generated</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder="Enter project Income Generated"
                              {...field}
                              className="h-9"
                              onChange={(e) => {
                                let value = e.target.value;

                                if (value === "") {
                                  field.onChange("");
                                  return;
                                }

                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length > 2) {
                                    value =
                                      parts[0] + "." + parts[1].substring(0, 2);
                                    e.target.value = value;
                                  }
                                }

                                field.onChange(e.target.value);
                              }}
                              onKeyDown={(e) => {
                                const value = e.target.value;
                                if (value.includes(".")) {
                                  const parts = value.split(".");
                                  if (parts[1] && parts[1].length >= 2) {
                                    if (e.key >= "0" && e.key <= "9") {
                                      e.preventDefault();
                                    }
                                  }
                                }
                              }}
                              step="0.01"
                              min="0"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* group section */}
              {securityOption === "GROUP" && (
                <ResponsiveTable
                  headers={existingHeaders}
                  rows={existingRows}
                  emptyIcon={Users}
                  emptyText="No existing members found for this group."
                  footer={
                    securityRows.length > 0 ? (
                      <>
                        {/* Desktop footer cells */}
                        <TableCell colSpan={4} className="text-xs font-bold">
                          Grand Total
                        </TableCell>
                        <TableCell className="text-right text-xs font-bold tabular-nums">
                          {/* AMount Total */}
                          {securityTotal}
                        </TableCell>
                        <TableCell colSpan={4} />
                      </>
                    ) : null
                  }
                />
              )}
            </div>
          </ScrollArea>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 p-3 sm:p-6 border-t bg-muted/20 shrink-0">
            <Button
              type="button"
              onClick={() => setSecurityDialogOpen(false)}
              className="w-full sm:w-auto text-white bg-primary hover:bg-primary/90"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrapper component that uses the hook
const NewApplicationWithHook = () => {
  const hookProps = useNewApplication();
  return <NewApplication {...hookProps} />;
};

export default NewApplicationWithHook;
export { NewApplication };
