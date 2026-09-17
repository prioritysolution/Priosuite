"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDays, addMonths, addYears, format, isValid, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";

import {
  getInvestmentRenewalInfoAPI,
  postInvestmentRenewalAPI,
} from "./InvestmentRenewalApis";
import { getInvestmentMatureAmountAPI } from "../investmentOpenAccount/InvestmentOpenAccountApis";
import { useInvestmentLedger } from "@/common/ledger/investmentLedger/Hooks";
import {
  maxTwoDecimalPlaces,
  positiveIntegerRegex,
} from "@/utils/validationRegex";

const parseDateHelper = (dStr) => {
  if (dStr === null || dStr === undefined || dStr === "") return null;
  if (dStr instanceof Date) {
    return isNaN(dStr.getTime()) ? null : dStr;
  }
  if (typeof dStr === "number" && Number.isFinite(dStr)) {
    const fromTs = new Date(dStr);
    return isNaN(fromTs.getTime()) ? null : fromTs;
  }

  if (typeof dStr === "string" && (dStr.includes("-") || dStr.includes("/"))) {
    const parts = dStr.split(/[-/]/);
    if (parts.length >= 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].split("T")[0], 10);
        const parsed = new Date(year, month, day, 12, 0, 0, 0);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
      if (String(parts[2]).split("T")[0].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].split("T")[0], 10);
        const parsed = new Date(year, month, day, 12, 0, 0, 0);
        return isNaN(parsed.getTime()) ? null : parsed;
      }
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

const getDurationUnit = (durationType) => {
  if (durationType === null || durationType === undefined || durationType === "") {
    return null;
  }

  let raw = durationType;
  if (raw && typeof raw === "object") {
    raw = raw.Id ?? raw.id ?? raw.Option_Id ?? raw.Option_Value ?? raw.value;
  }

  const numeric = Number(raw);
  if (numeric === 1 || numeric === 2 || numeric === 3) return numeric;

  const label = String(raw || "").toLowerCase();
  if (label === "d" || label.includes("day")) return 1;
  if (label === "y" || label.includes("year")) return 3;
  if (label === "m" || label.includes("month")) return 2;
  return null;
};

const resolveDurationType = (durtype, options = []) => {
  if (durtype === null || durtype === undefined || durtype === "") return "";

  const found = (options || []).find(
    (opt) =>
      String(opt?.Id ?? opt?.id ?? opt?.value ?? opt?.Option_Id ?? "") ===
        String(durtype) ||
      String(opt?.Option_Value ?? "") === String(durtype),
  );

  if (!found) return durtype;
  return found.Option_Value ?? found.Id ?? durtype;
};

const calculateMatureDate = (openingDateValue, durationValue, durationType) => {
  const startDateValue = parseDateHelper(openingDateValue);
  const durationNum = Number(durationValue);
  const unit = getDurationUnit(durationType);

  if (
    !startDateValue ||
    !isValid(startDateValue) ||
    !Number.isFinite(durationNum) ||
    durationNum <= 0 ||
    !unit
  ) {
    return "";
  }

  let matureDateValue = addMonths(startDateValue, durationNum);
  if (unit === 1) matureDateValue = addDays(startDateValue, durationNum);
  if (unit === 3) matureDateValue = addYears(startDateValue, durationNum);

  if (!matureDateValue || !isValid(matureDateValue)) return "";
  return format(matureDateValue, "dd-MM-yyyy");
};

export const useInvestmentRenewal = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const toDate = useSelector((state) => state.footer.footerData.End_Date);

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

  const [investmentProduct, setInvestmentProduct] = useState(null);

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [disableRenwal, setDisableRenwal] = useState(false);

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    accountNo: yup.string().required("Account no. is required"),
    openingDate: yup.string().nullable(),
    investmentAmount: yup.string().nullable(),
    rateOfInterest: yup.string().nullable(),
    maturityDate: yup.string().nullable(),
    maturityAmount: yup.string().nullable(),
    interestAmount: yup.string().nullable(),
    renewalDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Renewal date is required"),
    tdsAmount: yup
      .string()
      .nullable() // Allow null value
      .test(
        "is-valid-integer",
        "TDS amount must be an integer greater than 0",
        (value) => {
          if (value === null || value === "") return true; // Skip validation if value is null or empty
          return positiveIntegerRegex.test(value); // Validate integer greater than 0
        },
      ),
    effectDate: yup.string(),
    interestType: yup.string().required("Interest type is required"),
    duration: yup
      .string() // Use string to handle empty strings
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for proper validation
      .required("Duration is required") // Show "required" error if null or empty
      .test(
        "is-positive-integer",
        "Duration must be a positive integer without decimal points",
        (value) => {
          if (value === null) return false; // The required validation will trigger if value is null
          const numberValue = Number(value);
          // Check if the value is a positive integer and not a decimal
          return Number.isInteger(numberValue) && numberValue > 0;
        },
      ),
    durtype: yup.string().required("Duration type is required"),
    newRateOfInterest: yup
      .string()
      .test(
        "is-required-newRateOfInterest",
        "Rate of interest is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        },
      )
      .test(
        "is-positive-number",
        "Rate of interest must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Rate of interest can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      ),
    newInvestmentAmount: yup.string(),
    matureDate: yup.string(),
    matureAmount: yup
      .mixed()
      .test(
        "is-required-matureAmount",
        "Mature amount is required",
        (value) => String(value ?? "").trim() !== "",
      )
      .test(
        "is-positive-number",
        "Mature amount must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return !Number.isNaN(numValue) && numValue > 0;
        },
      )
      .test("is-valid-decimal", "Invalid mature amount", (value) => {
        const str = String(value ?? "").trim();
        if (!str) return true;
        return maxTwoDecimalPlaces.test(str);
      }),
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
      interestAmount: "",
      renewalDate: parseDateHelper(beg_date) || new Date(),
      tdsAmount: "",
      effectDate: "",
      interestType: "",
      duration: "",
      durtype: "",
      newRateOfInterest: "",
      newInvestmentAmount: "",
      matureDate: "",
      matureAmount: "",
    },
  });

  // Set renewalDate to beg_date by default
  useEffect(() => {
    const clientBegDate = getCookieData("beg_date");
    if (clientBegDate) {
      form.setValue(
        "renewalDate",
        parseDateHelper(clientBegDate) || new Date(),
      );
    }
  }, [form]);

  const { control } = form;
  const watchedValues = useWatch({ control }) || {};
  const {
    accountNo,
    maturityAmount,
    tdsAmount,
    newInvestmentAmount,
    newRateOfInterest,
    duration,
    maturityDate,
    interestType,
    matureAmount,
    durtype,
  } = watchedValues;

  const isTdsEnabled = Number(matureAmount) > 0;

  const handleSubmit = async (values) => {
    const matureVal = parseFloat(values.matureAmount);
    if (
      values.matureAmount === null ||
      values.matureAmount === undefined ||
      String(values.matureAmount).trim() === "" ||
      Number.isNaN(matureVal) ||
      matureVal <= 0
    ) {
      form.setError("matureAmount", {
        type: "required",
        message: "Mature amount is required",
      });
      toast.error("Mature amount is required");
      return;
    }
    postInvestmentRenewalApiCall(values);
  };

  const handleShowLedger = () => {
    if (accountNo && toDate) {
      getInvestLedgerHeaderApiCall(accountNo, new Date(toDate));
      setShowLedger(true);
    } else {
      toast.error("Select bank account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const handleCalculateMatureAmount = () => {
    if (
      investmentProduct &&
      newInvestmentAmount &&
      newRateOfInterest &&
      duration &&
      interestType &&
      durtype
    ) {
      getInvestmentMatureAmountApiCall();
    } else {
      toast.error("Enter all fields first");
    }
  };

  const postInvestmentRenewalApiCall = async (item) => {
    let data = {
      invest_id: item.accountNo,
      trans_date: format(item.renewalDate, "yyyy-MM-dd"),
      effect_date: format(
        parse(item.effectDate, "dd-MM-yyyy", new Date()),
        "yyyy-MM-dd",
      ),
      invest_amount: item.newInvestmentAmount,
      interest_amount: item.interestAmount,
      roi: item.newRateOfInterest,
      duration: item.duration,
      dur_type: item.durtype,
      mature_date: formatDateForApi(item.matureDate),
      mature_val: item.matureAmount,
      tds_amt: item.tdsAmount || 0,
      prn_gl: investmentProduct.Prn_Gl,
      intt_gl: investmentProduct.Intt_Gl,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postInvestmentRenewalAPI(data);

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
        form.setValue(
          "interestAmount",
          (
            Number(res.details[0].Mature_Val || "0") -
            Number(res.details[0].Invest_Amt || "0")
          ).toFixed(2),
        );
        form.setValue(
          "effectDate",
          res.details[0].Mature_Date
            ? format(res.details[0].Mature_Date, "dd-MM-yyyy")
            : "",
        );
      } else {
        setInvestmentProduct(null);
        form.setValue("openingDate", "");
        form.setValue("investmentAmount", "");
        form.setValue("rateOfInterest", "");
        form.setValue("matureDate", "");
        form.setValue("matureAmount", "");
        form.setValue("effectDate", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setInvestmentProduct(null);
      form.setValue("openingDate", "");
      form.setValue("investmentAmount", "");
      form.setValue("rateOfInterest", "");
      form.setValue("matureDate", "");
      form.setValue("matureAmount", "");
      form.setValue("interestAmount", "");
      form.setValue("effectDate", "");
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentMatureAmountApiCall = async () => {
    setLoading(true);

    try {
      const res = await getInvestmentMatureAmountAPI(
        orgId,
        investmentProduct.Acct_Type,
        form.getValues("newInvestmentAmount"),
        form.getValues("newRateOfInterest"),
        form.getValues("duration"),
        form.getValues("interestType"),
        form.getValues("durtype"),
      );
      if (res.message === "Data Found") {
        form.setValue(
          "matureAmount",
          res.details === 0 || res.details
            ? String(res.details)
            : "",
          { shouldValidate: true, shouldDirty: true, shouldTouch: true },
        );
        if (Number(res.details) === 0) {
          setDisableRenwal(true);
        } else {
          setDisableRenwal(false);
        }
      } else {
        form.setValue("matureAmount", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("matureAmount", "");
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
    const nextMatureDate = calculateMatureDate(
      form.getValues("maturityDate") ?? maturityDate,
      form.getValues("duration") ?? duration,
      resolveDurationType(
        form.getValues("durtype") ?? durtype,
        durationTypeData,
      ),
    );

    form.setValue("matureDate", nextMatureDate, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  }, [duration, maturityDate, durtype, durationTypeData, form]);

  useEffect(() => {
    const currentMatureAmount = form.getValues("matureAmount");
    let calculatedInvestmentAmount = 0;
    if (maturityAmount) {
      if (tdsAmount) {
        calculatedInvestmentAmount =
          Number(maturityAmount) - Number(tdsAmount);
      } else {
        calculatedInvestmentAmount = Number(maturityAmount);
      }
    }
    form.setValue("newInvestmentAmount", calculatedInvestmentAmount, {
      shouldValidate: false,
      shouldDirty: false,
      shouldTouch: false,
    });
    if (
      currentMatureAmount !== undefined &&
      currentMatureAmount !== null &&
      String(currentMatureAmount).trim() !== "" &&
      (form.getValues("matureAmount") === undefined ||
        form.getValues("matureAmount") === null ||
        String(form.getValues("matureAmount")).trim() === "")
    ) {
      form.setValue("matureAmount", currentMatureAmount, {
        shouldValidate: false,
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [maturityAmount, tdsAmount]);

  return {
    loading,
    form,
    handleSubmit,
    handleCalculateMatureAmount,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    disableRenwal,
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
    isTdsEnabled,
    getLedgerLoading,
  };
};
