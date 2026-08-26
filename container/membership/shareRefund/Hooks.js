"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { getShareIssueDataByIdAPI } from "../shareIssue/ShareIssueApis";
import { postShareRefundAPI } from "./ShareRefundApis";
import { format } from "date-fns";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";
import { useShareLedger } from "@/common/ledger/shareLedger/Hooks";
import { alphanumericWithHyphenUnderscoreRegex } from "@/utils/validationRegex";
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

export const useShareRefund = () => {
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
  const [postShareRefundLoading, setPostShareRefundLoading] = useState(false);

  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);

  const [showLedger, setShowLedger] = useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [memberProduct, setMemberProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    ledgerFolio: yup.string().nullable(),
    shareBalance: yup.string().nullable(),
    refundAmt: yup
      .string()
      .required("Total amount is required")
      .test(
        "is-less-than-share-balance",
        "Should be less than or equal to share balance",
        function (value) {
          const { shareBalance } = this.parent;
          return Number(value) <= Number(shareBalance);
        },
      ),
    totalRefundInWords: yup.string().nullable(),
    transMode: yup.string().required("Transanction mode is required"),
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
    bank: yup.string().nullable(),
    savings: yup.string().nullable(),
    savingsName: yup.string(),
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
      date: null,
      ledgerFolio: "",
      shareBalance: "",
      refundAmt: "",
      transMode: "cash",
      refVouchNo: "",
    },
  });

  const { control } = form;

  const { transMode, date, refundAmt, savings, bank } = useWatch({ control });

  const handleSubmit = (values) => {
    postShareRefundApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    form.setValue("date", values.date);

    getShareRefundDataByIdApiCall(
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
  };

  const postShareRefundApiCall = async (item) => {
    console.log("item", item);
    setPostShareRefundLoading(true);
    const cashDetails =
      item.transMode === "cash"
        ? cashOutDenomArray.map((outItem, idx) => {
            const match = cashInDenomArray.find(
              (inItem) => outItem.note_id === inItem.note_id,
            );
            return {
              note_id: outItem.note_id,
              in_qnty: outItem.denominator,
              out_qnty: match ? match.denominator : 0,
              tot_amount:
                (cashInTransactionTotal[idx] || 0) -
                (cashOutTransactionTotal[idx] || 0),
            };
          })
        : [];
    let data = {
      trans_date: format(item.date, "yyyy-MM-dd"),
      share_id: memberProduct.Share_Id,
      mem_id: memberProduct.Id,
      share_gl: memberProduct.Share_Gl, 
      no_share: 0,
      share_rate: 0,
      ledg_fol: item.ledgerFolio,
      tot_amt: item.refundAmt,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      sb_id: item.transMode === "savings" ? item.savings || null : null,
      bank_id: item.transMode === "bank" ? item.bank || null : null,
    };

    console.log(item.savings);
    console.log(item.bank);
    try {
      const res = await postShareRefundAPI(data);
      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setResetTrigger((prev) => prev + 1);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostShareRefundLoading(false);
    }
  };

  const getShareRefundDataByIdApiCall = async (orgId, memberId, date) => {
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
        form.setValue("shareBalance", res.details[0].Balance || "0");
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
        form.setValue("shareBalance", "");
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
      form.setValue("shareBalance", "");
      form.setValue("ledgerFolio", "");
      setShowLedger(false);
    } finally {
      setGetMemberDataLoading(false);
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
    if (refundAmt)
      form.setValue(
        "totalRefundInWords",
        "Rupees " + convertToWords(refundAmt) + " Only" || "",
      );
    else form.setValue("totalRefundInWords", "");
  }, [refundAmt]);

  useEffect(() => {
    if (savings)
      form.setValue(
        "savingsName",
        savingsAccountData?.find(
          (account) => account?.Id?.toString() === savings,
        )?.Full_Name || "",
      );
  }, [savings]);

  const errors = form.formState.errors;
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Share Refund Form Validation Errors:", errors);
      const firstError = Object.values(errors)[0];
      if (firstError && firstError.message) {
        toast.error(`Validation Error: ${firstError.message}`);
      }
    }
  }, [errors]);

  return {
    loading,
    getMemberDataLoading,
    postShareRefundLoading,
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
    transMode,
    refundAmt,
    savings,
    bank,
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
  };
};
