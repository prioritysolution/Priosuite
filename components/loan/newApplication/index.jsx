"use client";

import { useTranslation } from "react-i18next";
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
  emptyText,
}) => {
  const { t } = useTranslation();
  const resolvedEmptyText = emptyText ?? t("loan.noRecordsFound");

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center border border-dashed border-primary/40 rounded-xl bg-muted/20">
        <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
          <EmptyIcon className="w-5 h-5 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground">{resolvedEmptyText}</p>
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
  const { t } = useTranslation();
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

  const RadioData = [{ label: t("loan.individualCustomer"), value: "1" }];

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
    else toast.error(t("loan.pleaseEnterName"));
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
      toast.error(t("loan.youCannotAddSameCustomerAsJointHolder"));
      return;
    }
    if (jointDetails.some((jh) => jh.Id === memberData.Id)) {
      toast.error(t("loan.thisMemberIsAlreadyAddedAsAJointHolder"));
      return;
    }
    if (jointDetails.some((jh) => jh.Cust_No === memberData.Cust_No)) {
      toast.error(t("loan.aMemberWithThisCustomerNumberAlreadyExists"));
      return;
    }
    handleJointAccountAdd(memberData);
    setJointMemberDialougeOpen(false);
  };

  /* ── Security table column definitions ── */
  /* ── Security table column definitions ── */
  const internalHeaders = [
    { key: "sl", label: "#" },
    { key: "certType", label: t("loan.certificateType") },
    { key: "certNo", label: t("loan.certificateNo2") },
    { key: "issueDate", label: t("loan.issueDate") },
    { key: "issueAmount", label: t("loan.issueAmount") },
    { key: "roi", label: t("loan.rOI") },
    { key: "maturityDate", label: t("loan.maturityDate") },
    { key: "maturityAmount", label: t("loan.maturityAmount"), fullWidth: true },
    { key: "actions", label: t("loan.action") },
  ];

  const extType1Headers = [
    { key: "sl", label: "#" },
    { key: "certType", label: t("loan.certificateType") },
    { key: "certNo", label: t("loan.certificateNo2") },
    { key: "issueDate", label: t("loan.issueDate") },
    { key: "issueAmount", label: t("loan.issueAmount") },
    { key: "roi", label: t("loan.rOI") },
    { key: "maturityDate", label: t("loan.maturityDate") },
    { key: "maturityAmount", label: t("loan.maturityAmount"), fullWidth: true },
    { key: "actions", label: t("loan.action") },
  ];

  const extType2Headers = [
    { key: "sl", label: "#" },
    { key: "typeName", label: t("loan.typeName") },
    { key: "location", label: t("loan.propertyLocation") },
    { key: "area", label: t("loan.propertyArea") },
    { key: "owner", label: t("loan.ownerName") },
    { key: "coOwner", label: t("loan.coOwnerName") },
    { key: "details", label: t("loan.propertyDetails") },
    { key: "latitude", label: t("loan.latitude") },
    { key: "longitude", label: t("loan.longitude") },
    { key: "secValue", label: t("loan.securityValue") },
    { key: "actions", label: t("loan.action") },
  ];

  const extType3Headers = [
    { key: "sl", label: "#" },
    { key: "itemName", label: t("loan.itemName") },
    { key: "itemDetails", label: t("loan.itemDetails") },
    { key: "brand", label: t("loan.itemBrand") },
    { key: "owner", label: t("loan.ownerName") },
    { key: "coOwner", label: t("loan.coOwnerName") },
    { key: "cost", label: t("loan.itemCost") },
    { key: "ownCont", label: t("loan.ownContribution") },
    { key: "actions", label: t("loan.action") },
  ];

  const extType4Headers = [
    { key: "sl", label: "#" },
    { key: "typeName", label: t("loan.typeName") },
    { key: "details", label: t("loan.details") },
    { key: "secValue", label: t("loan.securityValue") },
    { key: "actions", label: t("loan.action") },
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
    { key: "name", label: t("loan.memberName") },
    { key: "guardian", label: t("loan.guardianName") },
    { key: "address", label: t("loan.address"), fullWidth: true },
    { key: "actions", label: t("loan.action") },
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
    { key: "custNo", label: t("loan.custNo") },
    { key: "cifNo", label: t("loan.cIFNo") },
    { key: "name", label: t("loan.fullName") },
    { key: "relation", label: t("loan.relation") },
    { key: "actions", label: t("loan.action") },
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
              <MdDeleteForever className="text-lg" />{t("loan.remove")}</button>
          </DialogTrigger>
          <DialogContent className="w-[calc(100vw-1rem)] max-w-sm p-4 sm:p-5 rounded-2xl">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-destructive" />
              </div>
              <div className="min-w-0 w-full">
                <h3 className="text-base font-semibold mb-1">{t("loan.removeJointHolder")}</h3>
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
                >{t("loan.cancel")}</Button>
                <Button
                  variant="destructive"
                  className="flex-1 w-full"
                  onClick={() =>
                    handleJointAccountDelete(item.Id || item.Cust_Id)
                  }
                >
                  <MdDeleteForever className="mr-1.5 text-base" />{t("loan.remove")}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ),
    };
  });

  const existingHeaders = [
    { key: "sl", label: "#" },
    { key: "name", label: t("loan.memberName") },
    { key: "cif", label: t("loan.cIFNo") },
    { key: "designation", label: t("loan.designation") },
    { key: "relation", label: t("loan.relation") },
    { key: "joinDate", label: t("loan.joiningDate") },
    { key: "savings", label: t("loan.savingsAC"), fullWidth: true },
    { key: "applactioamount", label: t("loan.applicationAmount") },
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
    { key: "DeductionName", label: t("loan.chargeName") },
    { key: "FinalCharge", label: t("loan.amount") },
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
        {/* <h3 className="text-lg sm:text-xl font-semibold">{t("loan.newApplication")}</h3> */}

        <ScrollArea className="w-full h-full px-1">
          {/* Member Search */}
          <div className="w-full mb-3">
            <MemberSearchForm
              handleSubmit={handleMemberFormSubmit}
              showDate
              resetTrigger={resetTrigger}
              formLabel={t("loan.newApplication")}
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
                  title={t("loan.basicInfoBlock")}
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
                        { name: "memberName", label: t("loan.memberName") },
                        { name: "gurdianName", label: t("loan.guardianName") },
                        { name: "mobile", label: t("loan.mobileNo") },
                        { name: "memberType", label: t("loan.memberType") },
                        { name: "CustType", label: t("loan.customerType") },
                        { name: "shareBalance", label: t("loan.shareBalance") },
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
                            <FormLabel>{t("loan.address")}</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("loan.enterAddress")}
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
                            <FormLabel>{t("loan.branchName")}</FormLabel>
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
                <SectionCard title={t("loan.applicationInfoBlock")}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-3">
                    <DatePickerField
                      control={form.control}
                      name="sanctionDate"
                      label={t("loan.applicationDate")}
                      onPopover
                      isRequired
                    />

                    {/* <FormField
                      control={form.control}
                      name="operationMode"
                      render={({ field }) => (
                        <DropdownField
                          label={t("loan.operationMode")}
                          options={[
                            { label: t("loan.self"), value: "70" },
                            { label: t("loan.jointEitherOrSurvivor"), value: "71" },
                            { label: t("loan.jointFormerOrSurvivor"), value: "72" },
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
                              placeholder={t("loan.enterApplicationNo")}
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
                          label={t("loan.productType")}
                          value={field.value}
                          onChange={field.onChange}
                          options={prodTypeData}
                          optionValueKey="Option_Value"
                          placeholder={t("loan.selectProductType")}
                          searchPlaceholder={t("loan.search2")}
                          isRequired
                        />
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="productId"
                      render={({ field }) => (
                        <KYCDropdownField
                          label={t("loan.product")}
                          value={field.value}
                          onChange={field.onChange}
                          options={productData}
                          optionLabelKey="Prod_Sh_Name"
                          placeholder={t("loan.selectProduct")}
                          searchPlaceholder={t("loan.search2")}
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
                            label={t("loan.loanPurpose")}
                            value={field.value}
                            onChange={field.onChange}
                            options={loanPurposeData} // Using test data for now
                            optionLabelKey="Purpose_Name"
                            placeholder={t("loan.selectLoanPurpose")}
                            searchPlaceholder={t("loan.search2")}
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
                              placeholder={t("loan.enterAmount")}
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
                      label={t("loan.applicationAmount")}
                      name="applicationAmount"
                      control={form.control}
                      placeholder={t("loan.enterAmount")}
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
                              placeholder={t("loan.enterDuration")}
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
                          label={t("loan.durationUnit")}
                          value={field.value}
                          onChange={field.onChange}
                          options={durationUnitData}
                          optionLabelKey="Option_Value"
                          placeholder={t("loan.selectUnit")}
                          searchPlaceholder={t("loan.search2")}
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
                          label={t("loan.repaymentMode")}
                          value={field.value}
                          onChange={field.onChange}
                          options={repaymentModeData}
                          optionLabelKey="Option_Value"
                          placeholder={t("loan.selectMode")}
                          searchPlaceholder={t("loan.search2")}
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
                      label={t("loan.finalRepaymentDate")}
                      disabled={true}
                    />

                    {showEmi && (
                      <FormField
                        control={form.control}
                        name="emiAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("loan.eMIAmount")}</FormLabel>
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
                            <FormLabel className="text-base">{t("loan.isAvailECS")}</FormLabel>
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
                          label={t("loan.eCSAccount")}
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
                      <DialogTitle className="text-base sm:text-lg">{t("loan.searchMembers")}</DialogTitle>
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
                              <FormLabel>{t("loan.memberName")}</FormLabel>
                              <FormControl>
                                <Input
                                  autoComplete="off"
                                  placeholder={t("loan.searchByMemberName")}
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
                        >{t("loan.search")}</Button>
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
                <SectionCard title={t("loan.jointHolderSDetails")}>
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
                <SectionCard title={t("loan.loanBasedOn")}>
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
                              label: t("loan.securityBased"),
                              show:
                                CustomerType !== 2 &&
                                CustomerType !== 3 &&
                                currentProductData?.Is_Mortg !== 0,
                            },
                            {
                              value: "GUARANTEE",
                              label: t("loan.guarantorBased"),
                              show:
                                CustomerType !== 2 &&
                                CustomerType !== 3 &&
                                currentProductData?.Is_Gurr !== 0,
                            },
                            {
                              value: "PROJECT",
                              label: t("loan.projectBased"),
                              show:
                                CustomerType !== 2 &&
                                CustomerType !== 3 &&
                                currentProductData?.Is_Project !== 0,
                            },
                            {
                              value: "GROUP",
                              label: t("loan.groupBased"),
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
                          <Plus className="w-4 h-4 mr-2" />{t("loan.add")}</Button>
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
                        toast.error(t("loan.pleaseAllFieldIsRequired"));
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
                        toast.error(t("loan.failedToProcessDeductions"));
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
                      t("loan.save")
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
                      <TableCell colSpan={2} className="text-xs font-bold">{t("loan.grandTotal")}</TableCell>
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
                  <h3 className="w-full text-center text-lg sm:text-xl font-semibold">{t("loan.transanctionBlock")}</h3>
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
                                    <FormLabel className="font-normal">{t("loan.cash")}</FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="bank" />
                                    </FormControl>
                                    <FormLabel className="font-normal">{t("loan.bank")}</FormLabel>
                                  </FormItem>
                                  {/* {Number(CustomerType) !== 1 && ( */}
                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="savings" />
                                    </FormControl>
                                    <FormLabel className="font-normal">{t("loan.savings")}</FormLabel>
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
                          placeholder={t("loan.enterRefVouchNo")}
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
                            label={t("loan.bank")}
                            options={bankAccountData}
                            optionLabelKey="Bank_Name"
                            placeholder={t("loan.selectBank")}
                            searchPlaceholder={t("loan.searchBank")}
                          />
                        ) : (
                          <>
                            <DropdownField
                              control={form.control}
                              name="savings"
                              label={t("loan.savings")}
                              options={ecsAccountData}
                              optionLabelKey="Account_No"
                              placeholder={t("loan.selectSavings")}
                              searchPlaceholder={t("loan.searchSavings")}
                            />
                            <InputField
                              control={form.control}
                              name="savingsName"
                              label={t("loan.accountHolderName")}
                              placeholder={t("loan.enterName")}
                              readOnly
                            />
                            <InputField
                              control={form.control}
                              name="savingsBalance"
                              label={t("loan.availableBalance")}
                              placeholder={t("loan.enterBalance")}
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
                  >{t("loan.cancel")}</Button>
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
                      t("loan.add")
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
                          label={t("loan.securityType")}
                          value={field.value}
                          onChange={field.onChange}
                          customStyle
                          options={[
                            { value: "E", label: t("loan.external") },
                            { value: "I", label: t("loan.internal") },
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
                                label={t("loan.securityAccount")}
                                value={field.value}
                                onChange={field.onChange}
                                options={securityData.filter(
                                  (d) =>
                                    !securityTable.some((t) => d.Id === t.Id) &&
                                    Number(d.Balance) > 0,
                                )}
                                optionLabelKey="Account_No"
                                placeholder={t("loan.selectAccount")}
                                searchPlaceholder={t("loan.search2")}
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
                              label={t("loan.externalSecurityType")}
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
                              placeholder={t("loan.selectSecurityType")}
                              searchPlaceholder={t("loan.searchType")}
                            />
                          )}
                        />

                        {Number(externalSecurityType) === 1 && (
                          <>
                            <InputField
                              control={form.control}
                              name="certificateType"
                              label={t("loan.certificateType")}
                              placeholder={t("loan.enterCertificateType")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="certificateNumber"
                              label={t("loan.certificateNo2")}
                              placeholder={t("loan.enterCertificateNo")}
                              isRequired
                            />
                            <DatePickerField
                              control={form.control}
                              name="issueDate"
                              label={t("loan.depositDate")}
                              disabledDateAfter={new Date()}
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="issueAmount"
                              label={t("loan.depositAmount")}
                              placeholder={t("loan.enterDepositAmount")}
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="roi"
                              label={t("loan.rOI")}
                              placeholder={t("loan.enterROI")}
                            />
                            <DatePickerField
                              control={form.control}
                              name="maturityDate"
                              label={t("loan.maturityDate")}
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="maturityAmount"
                              label={t("loan.maturityAmount")}
                              placeholder={t("loan.enterMaturityAmount")}
                              isRequired
                            />
                          </>
                        )}

                        {Number(externalSecurityType) === 2 && (
                          <>
                            <InputField
                              control={form.control}
                              name="extTypeName"
                              label={t("loan.typeName")}
                              placeholder={t("loan.enterTypeName")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extPropertyLocation"
                              label={t("loan.propertyLocation")}
                              placeholder={t("loan.enterPropertyLocation")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extPropertyArea"
                              label={t("loan.propertyArea")}
                              placeholder={t("loan.enterPropertyArea")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extOwnerName"
                              label={t("loan.ownerName")}
                              placeholder={t("loan.enterOwnerName")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extCoOwnerName"
                              label={t("loan.coOwnerNameIfAny")}
                              placeholder={t("loan.enterCoOwnerName")}
                            />
                            <InputField
                              control={form.control}
                              name="extPropertyDetails"
                              label={t("loan.propertyDetails")}
                              placeholder={t("loan.enterMouzaDagKhatianNo")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extLatitude"
                              label={t("loan.latitude")}
                              placeholder={t("loan.enterLatitude")}
                            />
                            <InputField
                              control={form.control}
                              name="extLongitude"
                              label={t("loan.longitude")}
                              placeholder={t("loan.enterLongitude")}
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extSecurityValue"
                              label={t("loan.securityValue")}
                              placeholder={t("loan.enterSecurityValue")}
                              isRequired
                            />
                          </>
                        )}

                        {Number(externalSecurityType) === 3 && (
                          <>
                            <InputField
                              control={form.control}
                              name="extItemName"
                              label={t("loan.itemName")}
                              placeholder={t("loan.enterItemName")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extItemDetails"
                              label={t("loan.itemDetails")}
                              placeholder={t("loan.enterRegistrationNumberEtc")}
                              isRequired
                            />
                            <InputField
                              control={form.control}
                              name="extItemBrand"
                              label={t("loan.itemBrand")}
                              placeholder={t("loan.enterItemBrand")}
                            />
                            <InputField
                              control={form.control}
                              name="extOwnerName"
                              label={t("loan.ownerName")}
                              placeholder={t("loan.enterOwnerName")}
                            />
                            <InputField
                              control={form.control}
                              name="extCoOwnerName"
                              label={t("loan.coOwnerName")}
                              placeholder={t("loan.enterCoOwnerName")}
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extItemCost"
                              label={t("loan.itemCost")}
                              placeholder={t("loan.enterItemCost")}
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extOwnContribution"
                              label={t("loan.ownContribution")}
                              placeholder={t("loan.enterOwnContribution")}
                              isRequired
                            />
                          </>
                        )}

                        {Number(externalSecurityType) === 4 && (
                          <>
                            <InputField
                              control={form.control}
                              name="extTypeName"
                              label={t("loan.typeName")}
                              placeholder={t("loan.enterTypeName")}
                              isRequired
                            />
                            <InputField
                              type="number"
                              control={form.control}
                              name="extSecurityValue"
                              label={t("loan.securityValue")}
                              placeholder={t("loan.enterSecurityValue")}
                              isRequired
                            />
                            <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                              <TextareaField
                                control={form.control}
                                name="extDetails"
                                label={t("loan.details")}
                                placeholder={t("loan.enterDetails")}
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
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("loan.internalDepositSecurity")}</h4>
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
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("loan.depositCertificateSecurityDetails")}</h4>
                              <ResponsiveTable
                                headers={extType1Headers}
                                rows={extType1Rows}
                                emptyText={t("loan.noRecordsAddedYet")}
                              />
                            </div>
                          )}

                          {extType2Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("loan.propertySecurityDetails")}</h4>
                              <ResponsiveTable
                                headers={extType2Headers}
                                rows={extType2Rows}
                                emptyText={t("loan.noRecordsAddedYet")}
                              />
                            </div>
                          )}

                          {extType3Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("loan.hypothecation")}</h4>
                              <ResponsiveTable
                                headers={extType3Headers}
                                rows={extType3Rows}
                                emptyText={t("loan.noRecordsAddedYet")}
                              />
                            </div>
                          )}

                          {extType4Items.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("loan.otherSecurityDetails")}</h4>
                              <ResponsiveTable
                                headers={extType4Headers}
                                rows={extType4Rows}
                                emptyText={t("loan.noRecordsAddedYet")}
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
                            <FormLabel>{t("loan.maxAllow")}</FormLabel>
                            <Input
                              placeholder={t("loan.enterMaxAllow")}
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
                            <FormLabel>{t("loan.maxLoanAmount")}</FormLabel>
                            <Input
                              placeholder={t("loan.maxLoanAmount2")}
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
                      { name: "guaranteeName", label: t("loan.memberName") },
                      {
                        name: "guaranteeGuardianName",
                        label: t("loan.guardianName"),
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
                          <FormLabel>{t("loan.memberAddress")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("loan.enterMemberAddress")}
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
                        <FormLabel>{t("loan.projectName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("loan.enterProjectName")}
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
                          <FormLabel>{t("loan.projectCost")}</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder={t("loan.enterProjectCost")}
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
                          <FormLabel>{t("loan.ownContribution")}</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder={t("loan.enterProjectOwnContribution")}
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
                            <FormLabel>{t("loan.mouza")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("loan.enterProjectMouza")}
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
                            <FormLabel>{t("loan.plotNo")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("loan.enterProjectPlotNo")}
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
                        <FormLabel>{t("loan.landOfferedAsSecurityInAcre")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("loan.enterProjectLandOfferedAsSecurityInAcre")}
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
                          <FormLabel>{t("loan.hypothicatedValue")}</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder={t("loan.enterProjectHypothicatedValue")}
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
                          <FormLabel>{t("loan.incomeGenerated")}</FormLabel>
                          <FormControl>
                            <Input
                              type={"number"}
                              placeholder={t("loan.enterProjectIncomeGenerated")}
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
                        <TableCell colSpan={4} className="text-xs font-bold">{t("loan.grandTotal")}</TableCell>
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
            >{t("loan.done")}</Button>
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
