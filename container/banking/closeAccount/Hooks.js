"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { getBankBalanceAPI } from "../bankDeposit/BankDepositApis";
import { postBankClosingAPI } from "./CloseAccountApis";
import {
  alphanumericWithHyphenUnderscoreRegex,
  maxTwoDecimalPlaces,
} from "@/utils/validationRegex";
import { formatDateForApi } from "@/utils/dateHelpers";
import { useBankLedger } from "@/common/ledger/bankLedger/Hooks";

const parseFlexDate = (dStr) => {
  if (!dStr) return new Date();
  if (dStr instanceof Date) return dStr;
  const parts = dStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2].split("T")[0], 10),
      );
    }
    if (parts[2].split("T")[0].length === 4) {
      return new Date(
        parseInt(parts[2].split("T")[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
      );
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

export const useBankClosing = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const {
    loading: getBankLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn,
    totalDeposit,
    userName,
    currentDate,
    currentTime,
    getBankLedgerHeaderApiCall,
    getBankLedgerDataApiCall,
    fromDate,
  } = useBankLedger();

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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

  const formSchema = yup.object({
    bankAccount: yup.string().required("Bank account is required"),
    closingDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      ),
    availableBalance: yup.string(),
    closingAmount: yup
      .string()
      .required("Closing amount is required") // Required validation
      .test(
        "is-valid-number",
        "Closing amount must be a valid number with up to 2 decimal places",
        (value) => {
          if (!value) return false; // Required validation already handles null/empty
          return maxTwoDecimalPlaces.test(value); // Validate format with regex
        },
      )
      .test(
        "is-greater-than-zero",
        "Closing amount must be greater than 0",
        (value) => {
          if (!value) return false; // Required validation already handles null/empty
          const numberValue = parseFloat(value);
          return numberValue > 0; // Ensure value is greater than 0
        },
      )
      .test(
        "is-less-than-or-equal-to-balance",
        "Closing amount must be less than or equal to senders available balance",
        function (value) {
          if (!value) return false; // Required validation already handles null/empty
          const { availableBalance } = this.parent;
          if (!availableBalance) return false; // Ensure availableBalance is defined
          const withdrawn = parseFloat(value);
          const balance = parseFloat(availableBalance);
          return withdrawn === balance; // Validate that closing amount is === available balance
        },
      ),
    transMode: yup.string().required("Transaction mode is required"),
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
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      bankAccount: "",
      closingDate: beg_date ? parseFlexDate(beg_date) : new Date(),
      availableBalance: "",
      closingAmount: "",
      transMode: "bank",
      refVouchNo: "",
    },
  });

  const { control } = form;
  const { bankAccount, closingDate, transMode } = useWatch({ control });

  const handleSubmit = async (values) => {
    postBankClosingApiCall(values);
  };

  const handleShowLedger = () => {
    if (bankAccount && closingDate) {
      getBankLedgerHeaderApiCall(bankAccount, closingDate);
      getBankLedgerDataApiCall(bankAccount, closingDate);
      setShowLedger(true);
    } else {
      toast.error("Select bank account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postBankClosingApiCall = async (item) => {
    const cashDetails = cashDenomArray.map((cash) => ({
      note_id: cash.note_id,
      in_qnty: 0,
      out_qnty: cash.denominator,
      tot_amount: cash.totalAmount,
    }));

    let data = {
      trans_date: item.closingDate
        ? formatDateForApi(item.closingDate)
        : null,
      Account_Id: item.bankAccount,
      Amount: item.closingAmount,
      to_account_id: item.transMode === "bank" ? item.bank : null,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);
    try {
      const res = await postBankClosingAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setDenominators(defaultDenominators);
      } else {
        toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getBankBalanceApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getBankBalanceAPI(
        orgId,
        form.getValues("bankAccount"),
        formatDateForApi(form.getValues("closingDate")),
      );
      if (res.message === "Data Found") {
        form.setValue("availableBalance", res.details || "");
      } else {
        form.setValue("availableBalance", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("availableBalance", "");
    } finally {
      setLoading(false);
    }
  };

  const prevBankAccount = useRef();
  const prevClosingDate = useRef();

  useEffect(() => {
    const currentBankAccount = form.getValues("bankAccount");
    const currentClosingDate = form.getValues("closingDate");

    if (
      currentBankAccount &&
      currentClosingDate &&
      (currentBankAccount !== prevBankAccount.current ||
        currentClosingDate !== prevClosingDate.current)
    ) {
      getBankBalanceApiCall(orgId);
    }

    prevBankAccount.current = currentBankAccount;
    prevClosingDate.current = currentClosingDate;
  }, [bankAccount, closingDate]);

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
    form.setValue("bank", "");
  }, [bankAccount]);

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
    transMode,
    handleShowLedger,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn,
    totalDeposit,
    userName,
    currentDate,
    currentTime,
    fromDate,
    getBankLoading,
  };
};
