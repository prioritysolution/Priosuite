"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getBorrowingsAccountAPI,
  getBorrowingsAccountInfoAPI,
  postBorrowingsTransactionDisburseAPI,
  postBorrowingsTransactionRepaymentAPI,
} from "./TansactionApis";
import { getBorrowingAccountData } from "./TransactionReducer";
import { useBorrowingsLedger } from "@/common/ledger/borrowingsLedger/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
  maxTwoDecimalPlaces,
} from "@/utils/validationRegex";

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

export const useBorrowingsTransaction = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");

  const {
    loading: getLedgerLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName,
    currentDate,
    currentTime,
    getBorrowingsLedgerHeaderApiCall,
    getBorrowingsLedgerDataApiCall,
    fromDate,
    toDate,
  } = useBorrowingsLedger();

  const [borrowingProduct, setBorrowingProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // denominators
  const [denominators, setDenominators] = useState([]);

  // cash Transaction Total
  const [cashTransactionTotal, setCashTransactionTotal] = useState([]);

  const [cashTransactionGrandTotal, setCashTransactionGrandTotal] = useState(0);

  const [cashDenomArray, setCashDenomArray] = useState([]);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");
  const beg_date = getCookieData("beg_date");

  const formSchema = yup.object({
    mode: yup.string().required("Account no. is required"),
    account: yup.string().required("Account is required"),
    productName: yup.string().nullable(),
    bankName: yup.string().nullable(),
    disburseDate: yup.string().nullable(),
    rateOfInterest: yup.string().nullable(),
    overdueRate: yup.string().nullable(),
    dueDate: yup.string().nullable(),
    balance: yup.string().nullable(),
    date: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Date is required"),
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
    principal: yup
      .string()
      .nullable()
      .test(
        "is-valid-principal",
        "Invalid principal amount",
        function (value) {
          if (value === null || value === "") return true; // Skip validation if not required or empty
          const { transMode } = this.parent; // Access the transMode field
          if (value === "0") return true; // Allow 0 in all cases

          // Check the value based on transMode
          if (transMode === "bank") {
            return maxTwoDecimalPlaces.test(value); // Allow decimals for bank
          }
          return integerRegex.test(value); // Allow only integers otherwise
        },
      )
      .test(
        "principal-less-than-balance",
        "Principal amount must be less than balance",
        function (value) {
          const { balance } = this.parent;
          const { mode } = this.parent;

          if (mode === "disburse") return true;
          if (!balance || !value) return false;

          return Number(value) <= Number(balance);
        },
      ),
    interest: yup
      .string()
      .nullable()
      .test(
        "is-valid-interest",
        "Invalid interest amount",
        function (value) {
          if (value === null || value === "") return true; // Skip validation if not required or empty
          const { transMode } = this.parent; // Access the transMode field
          if (value === "0") return true; // Allow 0 in all cases

          // Check the value based on transMode
          if (transMode === "bank") {
            return maxTwoDecimalPlaces.test(value); // Allow decimals for bank
          }
          return integerRegex.test(value); // Allow only integers otherwise
        },
      ),
    total: yup.string(),
    transMode: yup.string().required("Transaction mode is required"),
    bank: yup.string(),
    particulars: yup.string().required("Particulars is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      mode: "disburse",
      account: "",
      productName: "",
      bankName: "",
      disburseDate: "",
      rateOfInterest: "",
      overdueRate: "",
      dueDate: "",
      balance: "",
      date: null,
      refVouchNo: "",
      principal: "",
      interest: "",
      total: "",
      transMode: "bank",
      bank: "",
      particulars: "",
    },
  });

  const { control } = form;
  const { mode, account, transMode, principal, interest } = useWatch({
    control,
  });

  useEffect(() => {
    if (beg_date) {
      const parsed = parseDateHelper(beg_date);
      if (parsed) {
        form.setValue("date", parsed);
      }
    }
  }, [beg_date, form]);

  const handleSubmit = async (values) => {
    if (mode === "disburse") {
      postBorrowingsTransactionDisburseApiCall(values);
    } else {
      postBorrowingsTransactionRepaymentApiCall(values);
    }
  };

  const handleShowLedger = () => {
    if (account) {
      getBorrowingsLedgerHeaderApiCall(account);
      getBorrowingsLedgerDataApiCall(account);
      setShowLedger(true);
    } else {
      toast.error("Select account first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postBorrowingsTransactionDisburseApiCall = async (item) => {
    let data = {
      borrow_id: item.account,
      disb_date: format(item.date, "yyyy-MM-dd"),
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      disb_amt: item.principal,
      prn_ledg: borrowingProduct.Prn_Gl,
      bank_id: item.bank,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
      particulars: item.particulars,
    };

    setLoading(true);

    try {
      const res = await postBorrowingsTransactionDisburseAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const postBorrowingsTransactionRepaymentApiCall = async (item) => {
    const cashDetails = cashDenomArray.map((cash) => ({
      note_id: cash.note_id,
      in_qnty: 0,
      out_qnty: cash.denominator,
      tot_amount: cash.totalAmount,
    }));

    let data = {
      borrow_id: item.account,
      disb_date: format(item.date, "yyyy-MM-dd"),
      prn_amt: item.principal,
      intt_amt: item.interest,
      intt_gl: borrowingProduct.Intt_Gl,
      prn_ledg: borrowingProduct.Prn_Gl,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      bank_id: item.transMode === "bank" ? item.bank : null,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
      particulars: item.particulars,
    };

    setLoading(true);

    try {
      const res = await postBorrowingsTransactionRepaymentAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setDenominators(defaultDenominators);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getBorrowingsAccountApiCall = async (orgId, branch_id) => {
    setLoading(true);

    try {
      const res = await getBorrowingsAccountAPI(orgId, branch_id);

      if (res.message === "Data Found") {
        dispatch(getBorrowingAccountData(res.details));
      } else {
        toast.error(res.message);
        dispatch(getBorrowingAccountData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getBorrowingAccountData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBorrowingsAccountInfoApiCall = async () => {
    const recentDate = new Date();

    setLoading(true);

    try {
      const res = await getBorrowingsAccountInfoAPI(
        orgId,
        form.getValues("account"),
        format(recentDate, "yyyy-MM-dd"),
      );

      if (res.message === "Data Found") {
        setBorrowingProduct(res.details[0]);
        form.setValue("productName", res.details[0].Product_Name || "");
        form.setValue("bankName", res.details[0].Bank_Name || "");
        form.setValue(
          "disburseDate",
          res.details[0].Disb_Date
            ? format(res.details[0].Disb_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("rateOfInterest", res.details[0].Roi || "");
        form.setValue("overdueRate", res.details[0].Od_Rate || "");
        form.setValue(
          "dueDate",
          res.details[0].Due_Date
            ? format(res.details[0].Due_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("balance", res.details[0].Balance || "");
      } else {
        setBorrowingProduct(null);
        form.setValue("productName", "");
        form.setValue("bankName", "");
        form.setValue("disburseDate", "");
        form.setValue("rateOfInterest", "");
        form.setValue("overdueRate", "");
        form.setValue("dueDate", "");
        form.setValue("balance", "");
      }
      console.log(res);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setBorrowingProduct(null);
    } finally {
      setLoading(false);
    }
  };

  //handle in denominators change
  const handleDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...denominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setDenominators(newDenominators);
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
    setDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    setCashTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(cash.Note_Value, denominators[index]),
    );

    setCashTransactionTotal(newTotalAmounts);
  }, [denominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashTransactionGrandTotal(newGrandTotal);
  }, [cashTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(denominators[idx]) || 0,
        totalAmount: cashTransactionTotal[idx],
      };
    });
    setCashDenomArray(postData);
  }, [denominators, cashTransactionTotal]);

  useEffect(() => {
    if (account) {
      getBorrowingsAccountInfoApiCall();
    }
  }, [account]);

  useEffect(() => {
    if (mode === "repayment") {
      form.setValue(
        "total",
        (principal ? Number(principal) : 0) + (interest ? Number(interest) : 0),
      );
    } else {
      form.setValue("total", "");
    }
  }, [mode, principal, interest]);

  return {
    loading,
    cashDenomData,
    denominators,
    cashTransactionTotal,
    cashTransactionGrandTotal,
    handleDenominatorChange,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    mode,
    transMode,
    getBorrowingsAccountApiCall,
    handleShowLedger,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName,
    currentDate,
    currentTime,
    fromDate,
    toDate,
    getLedgerLoading,
  };
};
