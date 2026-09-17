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
  getInvestmentAccountAPI,
  postInvestmentInterestAPI,
} from "./InvestmentInterestApis";
import { getInvestmentAccountData } from "./InvestmentInterestReducer";
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

export const useInvestmentInterestPosting = () => {
  const dispatch = useDispatch();

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

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    accountNo: yup.string().required("Account no. is required"),
    interestAmount: yup
      .string()
      .required("Interest amount is required") // Required validation for null or empty string
      .test(
        "is-valid-amount",
        "Interest amount must be an integer greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          return positiveIntegerRegex.test(value); // Validate that it's an integer
        },
      )
      .test(
        "is-greater-than-zero",
        "Interest amount must be greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          const numberValue = parseInt(value, 10);
          return numberValue > 0; // Ensure the value is greater than 0
        },
      ),
    interestDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .required("Interest date is required"),
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
      accountNo: "",
      interestAmount: "",
      interestDate: parseDateHelper(beg_date) || new Date(),
      transMode: "bank",
      refVouchNo: "",
    },
  });

  // Set interestDate to beg_date by default
  useEffect(() => {
    const clientBegDate = getCookieData("beg_date");
    if (clientBegDate) {
      form.setValue(
        "interestDate",
        parseDateHelper(clientBegDate) || new Date(),
      );
    }
  }, [form]);

  const { control } = form;
  const { accountNo, interestDate } = useWatch({ control });

  const handleSubmit = async (values) => {
    postInvestmentInterestPostingApiCall(values);
  };

  const handleShowLedger = () => {
    if (accountNo && interestDate) {
      getInvestLedgerHeaderApiCall(accountNo, interestDate);
      setShowLedger(true);
    } else {
      toast.error("Select bank account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postInvestmentInterestPostingApiCall = async (item) => {
    let data = {
      invest_id: item.accountNo,
      trans_date: format(item.interestDate, "yyyy-MM-dd"),
      amount: item.interestAmount,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      bank_id: item.bank,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    console.log(data);

    setLoading(true);

    try {
      const res = await postInvestmentInterestAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
      } else {
        toast.error(res.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentAccountApiCall = async (orgId, mode) => {
    setLoading(true);

    try {
      const res = await getInvestmentAccountAPI(orgId, mode);
      if (res.message === "Data Found") {
        dispatch(getInvestmentAccountData(res.details));
      } else {
        dispatch(getInvestmentAccountData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInvestmentAccountData([]));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getInvestmentAccountApiCall,
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
