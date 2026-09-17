"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { set, useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { getShareIssueDataByIdAPI, postShareIssueAPI } from "./ShareIssueApis";
import { format } from "date-fns";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";
import { getCheckBalanceAPI } from "../issueMembership/IssueMembershipApis";
import { useShareLedger } from "@/common/ledger/shareLedger/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
} from "@/utils/validationRegex";
import convertToWords from "@/utils/numberToWords";

const parseDateHelper = (dStr) => {
  if (!dStr) return null;
  if (dStr instanceof Date) return dStr;
  
  if (typeof dStr === "string" && (dStr.includes("-") || dStr.includes("/"))) {
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
      if (parts[2].split("T")[0].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

export const useShareIssue = () => {
  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const {
    loading: getLedgerLoading,
    showLedger: showLedgerDialog,
    setShowLedger: setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalIssue,
    userName,
    currentDate,
    currentTime,
    getShareLedgerHeaderApiCall,
    getShareLedgerDataApiCall,
    fromDate,
  } = useShareLedger();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const [resetTrigger, setResetTrigger] = useState(0);

  const [loading, setLoading] = useState(false);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);
  const [postShareIssueLoading, setPostShareIssueLoading] = useState(false);

  const [showLedger, setShowLedger] = useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [insufficientBalanceDisable, setInsufficientBalanceDisable] =
    useState(false);
  const [memberProduct, setMemberProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [shareIssueReceiptData, setShareIssueReceiptData] = useState(null);

  // denominators
  const [inDenominators, setInDenominators] = useState([]);
  const [outDenominators, setOutDenominators] = useState([]);

  // cash Transaction Total
  const [cashInTransactionTotal, setCashInTransactionTotal] = useState([]);
  const [cashOutTransactionTotal, setCashOutTransactionTotal] = useState([]);

  const [cashInTransactionGrandTotal, setCashInTransactionGrandTotal] =
    useState(0);

  const [cashOutTransactionGrandTotal, setCashOutTransactionGrandTotal] =
    useState(0);

  const [cashInDenomArray, setCashInDenomArray] = useState([]);
  const [cashOutDenomArray, setCashOutDenomArray] = useState([]);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const formSchema = yup.object({
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    branchName: yup.string().nullable(),
    BranchId: yup.string().nullable(),
    ledgerFolio: yup.string().nullable(),
    availableBal: yup.string().nullable(),
    date: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .test(
        "is-between",
        "Date must be between financial start and end date",
        function (value) {
          if (!value) return false;
          if (!startDate || !endDate) return true;
          const sDate = parseDateHelper(startDate);
          const eDate = parseDateHelper(endDate);
          if (!sDate || !eDate) return true;

          const beg_date = getCookieData("beg_date");
          const begDateParsed = parseDateHelper(beg_date);

          const today = new Date();
          const max = eDate > today ? today : eDate;
          const maxDate = (begDateParsed && !isNaN(begDateParsed.getTime()) && begDateParsed > max) ? begDateParsed : max;

          const valDate = new Date(value);
          valDate.setHours(0, 0, 0, 0);
          sDate.setHours(0, 0, 0, 0);
          maxDate.setHours(23, 59, 59, 999);

          return valDate >= sDate && valDate <= maxDate;
        },
      ),
    noOfShare: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null for handling missing fields
      .required("No. of share is required") // Required message
      .test(
        "is-integer",
        "No. of share must be an integer",
        (value) => value !== null && integerRegex.test(value), // Use regex for integer validation
      )
      .test(
        "is-greater-than-zero",
        "No. of share must be greater than 0",
        (value) => value !== null && parseInt(value, 10) > 0, // Ensure value is greater than 0
      ),
    ratePerShare: yup.string().nullable(),
    totalAmt: yup.string().nullable(),
    totalAmtInWords: yup.string().nullable(),
    voucherMode: yup.string().required("Transanction mode is required"),
    refVouchNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null values
      .test(
        "is-valid-ref-vouch-no",
        "Reference voucher number is invalid",
        (value) => {
          if (value === null) return true; // Skip validation if value is null or empty
          return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
        },
      ),
    bank: yup.string(),
    savings: yup.string(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      ledgerFolio: "",
      availableBal: "",
      date: null,
      noOfShare: "",
      ratePerShare: "",
      totalAmt: "",
      voucherMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
    },
  });

  const { control } = form;

  const {
    ratePerShare,
    noOfShare,
    voucherMode,
    date,
    totalAmt,
    savings,
    savingsBalance,
    bank,
  } = useWatch({
    control,
  });

  const handleSubmit = (values) => {
    postShareIssueApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    form.setValue("date", values.date);

    getShareIssueDataByIdApiCall(
      orgId,
      values.memberNo,
      format(values.date, "yyyy-MM-dd"),
    );
  };

  const handleShowLedger = () => {
    if (memberProduct && memberProduct.Share_Id && date) {
      getShareLedgerHeaderApiCall(memberProduct.Share_Id, date);
      setShowLedgerDialog(true);
    } else {
      toast.error("Select member and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setShareIssueReceiptData(null);
  };

  const handleGenerateShareIssueReceipt = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setIsReceiptOpen(true);
  };

  const postShareIssueApiCall = async (item) => {
    console.log("postShareIssueApiCall item", item);
    setPostShareIssueLoading(true);

    const cashDetails = cashInDenomArray.map((inItem, idx) => {
      return {
        note_id: inItem.note_id,
        in_qnty: inItem.denominator,
        out_qnty: cashOutDenomArray.filter(
          (outItem) => inItem.note_id === outItem.note_id,
        )[0].denominator,
        tot_amount: cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
      };
    });
    let data = {
      trans_date: format(item.date, "yyyy-MM-dd"),
      share_id: memberProduct.Share_Id,
      mem_id: memberProduct.Id,
      share_gl: memberProduct.Share_Gl,
      no_share: item.noOfShare,
      share_rate: item.ratePerShare,
      ledg_fol: item.ledgerFolio,
      tot_amt: item.totalAmt,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.voucherMode === "cash" ? cashDetails : [],
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      sb_id: item.voucherMode === "savings" ? item.savings : null,
      bank_id: item.voucherMode === "bank" ? item.bank : null,
    };
    try {
      const res = await postShareIssueAPI(data);
      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setResetTrigger((prev) => prev + 1);
        setShareIssueReceiptData(res?.Data[0] || null);
        setShowLedger(false);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostShareIssueLoading(false);
    }
  };

  const getShareIssueDataByIdApiCall = async (orgId, memberId, date) => {
    setGetMemberDataLoading(true);
    try {
      const res = await getShareIssueDataByIdAPI(orgId, memberId, date);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        setMemberProduct(res.details[0]);
        form.setValue("memberNo", res.details[0].Cust_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Cust_Mob || "");
        form.setValue("branchName", res.details[0].Branch_Name || "");
        form.setValue("BranchId", res.details[0].Branch_Id || "");
        form.setValue("availableBal", res.details[0].Balance || "");
        form.setValue("ratePerShare", res.details[0].Share_Rate || "0");
        form.setValue("ledgerFolio", res.details[0].Ledg_fol || "");
        getDepositEcsAccountApiCall(orgId, res.details[0].Id);
        setShowLedger(true);
      } else {
        setVisibleBlock(false);
        setMemberProduct(null);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("branchName", "");
        form.setValue("BranchId", "");
        form.setValue("availableBal", "");
        form.setValue("ratePerShare", "");
        form.setValue("ledgerFolio", "");
        toast.error(res.details);
        setShowLedger(false);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      setMemberProduct(null);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("branchName", "");
      form.setValue("BranchId", "");
      form.setValue("availableBal", "");
      form.setValue("ratePerShare", "");
      form.setValue("ledgerFolio", "");
      setShowLedger(false);
    } finally {
      setGetMemberDataLoading(false);
    }
  };

  const getCheckBalanceApiCall = async () => {
    setLoading(true);

    try {
      const res = await getCheckBalanceAPI(
        form.getValues("savings"),
        format(form.getValues("date"), "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue(
          "savingsBalance",
          res.details ? Number(res.details)?.toFixed(2) : "",
        );
      } else {
        toast.error(res.details || res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //handle in denominators change
  const handleInDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...inDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setInDenominators(newDenominators);
    }
  };
  //handle in denominators change
  const handleOutDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...outDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setOutDenominators(newDenominators);
    }
  };

  //handle cash transaction grand total
  const calculateCashTransactionTotalAmount = (note, denominator) => {
    const parsedNote = parseFloat(note);
    const parsedDenominators = parseFloat(denominator);
    if (!isNaN(parsedNote) && !isNaN(parsedDenominators)) {
      return parsedNote * parsedDenominators;
    }
    return 0;
  };

  // set denominators
  useEffect(() => {
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    setCashInTransactionTotal(defaultTotalAmounts);
    setCashOutTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        inDenominators[index],
      ),
    );

    setCashInTransactionTotal(newTotalAmounts);
  }, [inDenominators, cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        outDenominators[index],
      ),
    );

    setCashOutTransactionTotal(newTotalAmounts);
  }, [outDenominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashInTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashInTransactionGrandTotal(newGrandTotal);
  }, [cashInTransactionTotal]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashOutTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashOutTransactionGrandTotal(newGrandTotal);
  }, [cashOutTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(inDenominators[idx]) || 0,
        totalAmount: cashInTransactionTotal[idx],
      };
    });
    setCashInDenomArray(postData);
  }, [inDenominators, cashInTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(outDenominators[idx]) || 0,
        totalAmount: cashOutTransactionTotal[idx],
      };
    });
    setCashOutDenomArray(postData);
  }, [outDenominators, cashOutTransactionTotal]);

  useEffect(() => {
    if (ratePerShare && noOfShare) {
      let total = Number(ratePerShare) * Number(noOfShare);
      form.setValue("totalAmt", total.toFixed(2));
      form.setValue(
        "totalAmtInWords",
        "Rupees " + convertToWords(total) + " Only" || "",
      );
    } else {
      form.setValue("totalAmt", "");
      form.setValue("totalAmtInWords", "");
    }
  }, [ratePerShare, noOfShare]);

  const prevSavings = useRef();
  const prevDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("date");

    if (
      currentSavings &&
      currentDate &&
      (currentSavings !== prevSavings.current ||
        currentDate !== prevDate.current)
    ) {
      getCheckBalanceApiCall();
    }

    prevSavings.current = currentSavings;
    prevDate.current = currentDate;
  }, [savings, date]);

  useEffect(() => {
    if (savings)
      form.setValue(
        "savingsName",
        savingsAccountData?.find(
          (account) => account?.Id?.toString() === savings,
        )?.Full_Name || "",
      );
    else {
      form.setValue("savingsName", "");
      form.setValue("savingsBalance", "");
    }
  }, [savings]);

  useEffect(() => {
    form.setValue("savings", "");
    form.setValue("bank", "");
  }, [voucherMode]);

  useEffect(() => {
    if (voucherMode === "savings") {
      if (
        savingsBalance &&
        totalAmt &&
        Number(savingsBalance) < Number(totalAmt)
      )
        setInsufficientBalanceDisable(true);
      else setInsufficientBalanceDisable(false);
      console.log(savingsBalance, totalAmt, voucherMode);
    }
  }, [voucherMode, savingsBalance, totalAmt, ratePerShare]);

  const errors = form.formState.errors;
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Share Issue Form Validation Errors:", errors);
      const firstError = Object.values(errors)[0];
      if (firstError && firstError.message) {
        toast.error(`Validation Error: ${firstError.message}`);
      }
    }
  }, [errors]);

  return {
    totalAmt,
    savings,
    bank,
    loading,
    getMemberDataLoading,
    postShareIssueLoading,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    voucherMode,
    insufficientBalanceDisable,
    showLedger,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalIssue,
    userName,
    currentDate,
    currentTime,
    fromDate,
    getLedgerLoading,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    shareIssueReceiptData,
    handleGenerateShareIssueReceipt,
  };
};
