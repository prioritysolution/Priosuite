"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";

import { format } from "date-fns";

import { postInvestmentInstallmentDepositAPI } from "./InstallmentDepositApis";
import { useInvestmentLedger } from "@/common/ledger/investmentLedger/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  positiveIntegerRegex,
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

export const useInvestmentInstallmentDeposit = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const {
    loading: getLedgerLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn,
    totalDeposit,
    userName,
    currentDate,
    currentTime,
    getInvestLedgerHeaderApiCall,
    fromDate,
  } = useInvestmentLedger();

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
    (state) => state?.issueMembership?.noteDenomData
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    accountNo: yup.string().required("Account no. is required"),
    installmentAmount: yup
      .string()
      .required("Installment amount is required") // Required validation for null or empty string
      .test(
        "is-valid-amount",
        "Installment amount must be an integer greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          return positiveIntegerRegex.test(value); // Validate that it's an integer
        }
      )
      .test(
        "is-greater-than-zero",
        "Installment amount must be greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          const numberValue = parseInt(value, 10);
          return numberValue > 0; // Ensure the value is greater than 0
        }
      ),
    postingDate: yup
      .date().required("Transaction date is required"),
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
        }
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountNo: "",
      installmentAmount: "",
      postingDate: parseDateHelper(beg_date) || new Date(),
      transMode: "cash",
      refVouchNo: "",
    },
  });

  // Set postingDate to beg_date by default
  useEffect(() => {
    const clientBegDate = getCookieData("beg_date");
    if (clientBegDate) {
      form.setValue("postingDate", parseDateHelper(clientBegDate) || new Date());
    }
  }, [form]);

  const { control } = form;
  const { transMode, accountNo, postingDate } = useWatch({ control });

  const handleSubmit = async (values) => {
    postInvestmentInstallmentDepositApiCall(values);
  };

  const handleShowLedger = () => {
    if (accountNo && postingDate) {
      getInvestLedgerHeaderApiCall(accountNo, postingDate);
      setShowLedger(true);
    } else {
      toast.error("Select bank account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postInvestmentInstallmentDepositApiCall = async (item) => {
    const cashDetails = cashDenomArray.map((cash) => ({
      note_id: cash.note_id,
      in_qnty: 0,
      out_qnty: cash.denominator,
      tot_amount: cash.totalAmount,
    }));

    let data = {
      invest_id: item.accountNo,
      trans_date: format(item.postingDate, "yyyy-MM-dd"),
      amount: item.installmentAmount,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      bank_id: item.transMode === "bank" ? item.bank : null,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    console.log(data);

    try {
      const res = await postInvestmentInstallmentDepositAPI(data);

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
      calculateCashTransactionTotalAmount(cash.Note_Value, denominators[index])
    );

    setCashTransactionTotal(newTotalAmounts);
  }, [denominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0
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
    getLedgerLoading,
  };
};
