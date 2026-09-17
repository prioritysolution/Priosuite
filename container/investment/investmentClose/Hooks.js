"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { getInvestmentRenewalInfoAPI } from "../investmentRenewal/InvestmentRenewalApis";
import {
  getInvestmentClosingInterestAPI,
  postInvestmentCloseAPI,
} from "./InvestmentCloseApis";
import { useInvestmentLedger } from "@/common/ledger/investmentLedger/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  maxTwoDecimalPlaces,
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

export const useInvestmentClose = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const fromDate = getCookieData("fin_start_date");

  const toDate = getCookieData("fin_end_date");

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
  } = useInvestmentLedger();

  const [investmentProduct, setInvestmentProduct] = useState(null);

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formSchema = yup.object({
    accountNo: yup.string().required("Account no. is required"),
    openingDate: yup.string().nullable(),
    investmentAmount: yup.string().nullable(),
    rateOfInterest: yup.string().nullable(),
    maturityDate: yup.string().nullable(),
    maturityAmount: yup.string().nullable(),
    closingDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Closing date is required"),
    newInvestmentAmount: yup.string(),
    closingInterest: yup
      .string()
      .nullable()
      .test(
        "is-positive-number",
        "Closing interest must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue >= 0; // Ensure the value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Closing interest can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      ),
    tdsAmount: yup
      .string()
      .nullable() // Allow null value
      .test("is-valid-integer", "Invalid TDS amount", (value) => {
        if (value === null || value === "") return true; // Skip validation if value is null or empty
        return positiveIntegerRegex.test(value); // Validate integer greater than 0
      }),
    totalPayble: yup.string(),
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
    transMode: yup.string().required("Transaction mode is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountNo: "",
      openingDate: "",
      investmentAmount: "",
      rateOfInterest: "",
      maturityDate: "",
      maturityAmount: "",
      closingDate: parseDateHelper(beg_date) || new Date(),
      newInvestmentAmount: "",
      closingInterest: "",
      tdsAmount: "",
      refVouchNo: "",
      transMode: "bank",
      bank: "",
    },
  });

  // Set closingDate to beg_date by default
  useEffect(() => {
    const clientBegDate = getCookieData("beg_date");
    if (clientBegDate) {
      form.setValue(
        "closingDate",
        parseDateHelper(clientBegDate) || new Date(),
      );
    }
  }, [form]);

  const { control } = form;
  const {
    accountNo,
    closingDate,
    newInvestmentAmount,
    closingInterest,
    tdsAmount,
  } = useWatch({
    control,
  });

  const handleSubmit = async (values) => {
    postInvestmentCloseApiCall(values);
  };

  const handleShowLedger = () => {
    if (accountNo && toDate) {
      getInvestLedgerHeaderApiCall(accountNo, new Date(toDate));
      setShowLedger(true);
    } else {
      toast.error("Select bank account and date first");
    }
  };

  const handleCalculateClosingInterest = () => {
    if (accountNo && closingDate) {
      getInvestmentClosingInterestApiCall();
    } else {
      toast.error("Please enter Account no and Closing date");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postInvestmentCloseApiCall = async (item) => {
    let data = {
      invest_id: item.accountNo,
      trans_date: format(item.closingDate, "yyyy-MM-dd"),
      invest_amount: item.newInvestmentAmount,
      interest_amount: item.closingInterest ? item.closingInterest : 0,
      prn_gl: investmentProduct.Prn_Gl,
      intt_gl: investmentProduct.Intt_Gl,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      bank_id: item.bank,
      tds_amt: item.tdsAmount ? item.tdsAmount : 0,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postInvestmentCloseAPI(data);

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

  const getInvestmentRenewalInfoApiCall = async () => {
    try {
      const res = await getInvestmentRenewalInfoAPI(
        orgId,
        form.getValues("accountNo"),
      );
      if (res.message === "Data Found") {
        setInvestmentProduct(res.details[0]);
        form.setValue(
          "openingDate",
          res.details[0].Open_Date
            ? format(res.details[0].Open_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("investmentAmount", res.details[0].Invest_Amt || "");
        form.setValue("rateOfInterest", res.details[0].Roi || "");
        form.setValue(
          "maturityDate",
          res.details[0].Mature_Date
            ? format(res.details[0].Mature_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("maturityAmount", res.details[0].Mature_Val || "");
        form.setValue("interestAmount", res.details[0].Invest_Amt || "");
        form.setValue(
          "effectDate",
          res.details[0].Mature_Date
            ? format(res.details[0].Mature_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("newInvestmentAmount", res.details[0].Invest_Amt || "");
      } else {
        setInvestmentProduct(null);
        form.setValue("openingDate", "");
        form.setValue("investmestAmount", "");
        form.setValue("rateOfInterest", "");
        form.setValue("matureDate", "");
        form.setValue("matureAmount", "");
        form.setValue("effectDate", "");
        form.setValue("newInvestmentAmount", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setInvestmentProduct(null);
      form.setValue("openingDate", "");
      form.setValue("investmestAmount", "");
      form.setValue("rateOfInterest", "");
      form.setValue("matureDate", "");
      form.setValue("matureAmount", "");
      form.setValue("interestAmount", "");
      form.setValue("effectDate", "");
      form.setValue("newInvestmentAmount", "");
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentClosingInterestApiCall = async () => {
    setLoading(true);

    let data = {
      org_id: orgId,
      invest_id: form.getValues("accountNo"),
      date: format(form.getValues("closingDate"), "yyyy-MM-dd"),
    };

    try {
      const res = await getInvestmentClosingInterestAPI(data);
      if (res.message === "Success") {
        form.setValue("closingInterest", res.details);
      } else {
        form.setValue("closingInterest", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("closingInterest", "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountNo) {
      getInvestmentRenewalInfoApiCall();
    }
  }, [accountNo]);

  useEffect(() => {
    if (newInvestmentAmount && closingInterest) {
      let newTotalPayble = 0;
      if (tdsAmount) {
        newTotalPayble =
          Number(newInvestmentAmount) +
          Number(closingInterest) -
          Number(tdsAmount);
      } else {
        newTotalPayble = Number(newInvestmentAmount) + Number(closingInterest);
      }
      form.setValue("totalPayble", newTotalPayble);
    } else {
      form.setValue("totalPayble", "");
    }
  }, [newInvestmentAmount, closingInterest, tdsAmount]);

  return {
    loading,
    form,
    handleSubmit,
    handleCalculateClosingInterest,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
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
    toDate,
    getLedgerLoading,
  };
};
