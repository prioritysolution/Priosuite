"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getInvestmentAccountTypeAPI,
  getInvestmentInterestTypeAPI,
  getInvestmentOpenLedgerAPI,
  getInvestmentMatureAmountAPI,
  getInvestmentTypeAPI,
} from "@/container/investment/investmentOpenAccount/InvestmentOpenAccountApis";
import {
  getInvestmentAccountTypeData,
  getInvestmentInterestLedgerData,
  getInvestmentInterestTypeData,
  getInvestmentPrincipalLedgerData,
  getInvestmentTypeData,
} from "@/container/investment/investmentOpenAccount/InvestmentOpenAccountReducer";
import { addDays, addMonths, addYears, format, isValid, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import { postOpeningInvestmentAccountAPI } from "./InvestmentOpeningApis";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";

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

export const useInvestmentOpening = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  const formSchema = yup.object({
    investmentType: yup.string().required("Investment type is required"),
    accountType: yup.string().required("Account type is required"),
    bankName: yup.string().required("Bank name is required"),
    accountNo: yup
      .string()
      .required("Account no. is required") // Required validation for empty/null values
      .test("is-integer", "Account no. must be an integer", (value) => {
        if (value === null || value === "") return false; // Required check will trigger if null or ""
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test("max-length", "Account no. must be at most 15 digits", (value) => {
        if (value === null || value === "") return false; // Required check will trigger if null or ""
        return value.length <= 15; // Ensure the length is no more than 15
      })
      .test("no-leading-zero", "Account no. must not start with 0", (value) => {
        if (value === null || value === "") return false; // Required check will trigger if null or ""
        return !value.startsWith("0"); // Ensure it doesn't start with 0
      }),
    openingDate: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Opening date is required")
      .required("Opening date is required")
      .test("is-between", "Invalid Date", function (value) {
        if (!value) return false;
        return format(value, "yyyy-MM-dd") < startDate;
      }),
    amount: yup
      .string() // Use string to handle empty strings first
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for required validation
      .required("Amount is required") // Required validation for null or empty values
      .test(
        "is-positive-integer",
        "Amount must be a positive integer without decimal points",
        (value) => {
          if (value === null) return false; // Required error for null values
          const numberValue = Number(value);
          // Check if the value is a positive integer and not a decimal
          return Number.isInteger(numberValue) && numberValue > 0;
        }
      ),
    rateOfInterest: yup
      .string()
      .test(
        "is-required-rateOfInterest",
        "Rate of interest is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        }
      )
      .test(
        "is-positive-number",
        "Rate of interest must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        }
      )
      .test(
        "is-valid-decimal",
        "Rate of interest can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        }
      ),
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
        }
      ),
    matureDate: yup.string().required("Mature date is required"),
    matureAmount: yup
      .string()
      .test(
        "is-required-matureAmount",
        "Mature amount is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        }
      )
      .test(
        "is-positive-number",
        "Mature amount must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        }
      )
      .test(
        "is-valid-decimal",
        "Mature amount can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        }
      ),
    principalLedger: yup.string().required("Principal ledger is required"),
    interestLedger: yup.string().required("Interest ledger is required"),
    durtype: yup.string().required("Duration type is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      investmentType: "",
      accountType: "",
      bankName: "",
      accountNo: "",
      openingDate: null,
      amount: "",
      rateOfInterest: "",
      interestType: "",
      duration: "",
      matureDate: "",
      matureAmount: "",
      principalLedger: "",
      interestLedger: "",
      durtype: "",
    },
  });

  const { control } = form;
  const [
    investmentType,
    accountType,
    amount,
    rateOfInterest,
    duration,
    interestType,
    openingDate,
    durtype,
  ] = useWatch({
    control,
    name: [
      "investmentType",
      "accountType",
      "amount",
      "rateOfInterest",
      "duration",
      "interestType",
      "openingDate",
      "durtype",
    ],
  });

  // Fetch ledgers when investmentType, accountType, or orgId changes
  useEffect(() => {
    if (orgId && investmentType && accountType) {
      getInvestmentPrincipalLedgerApiCall();
      getInvestmentInterestLedgerApiCall();
    } else {
      dispatch(getInvestmentPrincipalLedgerData([]));
      dispatch(getInvestmentInterestLedgerData([]));
    }
  }, [investmentType, accountType, orgId]);

  const handleSubmit = async (values) => {
    postOpeningInvestmentAccountApiCall(values);
  };

  const handleCalculateMatureAmount = () => {
    if (
      accountType &&
      amount &&
      rateOfInterest &&
      duration &&
      interestType &&
      durtype
    ) {
      getInvestmentMatureAmountApiCall();
    } else {
      toast.error("Enter all fields first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postOpeningInvestmentAccountApiCall = async (item) => {
    let data = {
      invest_type: item.investmentType,
      acct_type: item.accountType,
      bank_name: item.bankName,
      acct_no: item.accountNo,
      open_date: formatDateForApi(item.openingDate),
      invest_amt: item.amount,
      roi: item.rateOfInterest,
      intt_on: item.interestType,
      duration: item.duration,
      dur_type: item.durtype,
      mature_date: formatDateForApi(item.matureDate),
      mature_val: item.matureAmount,
      prn_gl: item.principalLedger,
      intt_gl: item.interestLedger,
      branch_Id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postOpeningInvestmentAccountAPI(data);

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

  const getInvestmentTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getInvestmentTypeAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getInvestmentTypeData(res.details));
      } else {
        dispatch(getInvestmentTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInvestmentTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentAccountTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getInvestmentAccountTypeAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getInvestmentAccountTypeData(res.details));
      } else {
        dispatch(getInvestmentAccountTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInvestmentAccountTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentInterestTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getInvestmentInterestTypeAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getInvestmentInterestTypeData(res.details));
      } else {
        dispatch(getInvestmentInterestTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInvestmentInterestTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getInvestmentMatureAmountApiCall = async () => {
    setLoading(true);

    try {
      const res = await getInvestmentMatureAmountAPI(
        orgId,
        // form.getValues("accountType"),
        // form.getValues("amount"),
        // form.getValues("rateOfInterest"),
        // form.getValues("duration"),
        // form.getValues("interestType")
        accountType,
        amount,
        rateOfInterest,
        duration,
        interestType,
        durtype,
      );
      if (res.message === "Data Found") {
        form.setValue("matureAmount", res.details);
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
  const getInvestmentPrincipalLedgerApiCall = async () => {
    setLoading(true);
    const type = form.getValues("investmentType");
    const acctType = form.getValues("accountType");
    try {
      const res = await getInvestmentOpenLedgerAPI(1, orgId, type, acctType);
      if (res.message === "Data Found") {
        dispatch(getInvestmentPrincipalLedgerData(res.details));
      } else {
        dispatch(getInvestmentPrincipalLedgerData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInvestmentPrincipalLedgerData([]));
    } finally {
      setLoading(false);
    }
  };
  const getInvestmentInterestLedgerApiCall = async () => {
    setLoading(true);
    const type = form.getValues("investmentType");
    const acctType = form.getValues("accountType");

    try {
      const res = await getInvestmentOpenLedgerAPI(2, orgId, type, acctType);
      if (res.message === "Data Found") {
        dispatch(getInvestmentInterestLedgerData(res.details));
      } else {
        dispatch(getInvestmentInterestLedgerData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInvestmentInterestLedgerData([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const nextMatureDate = calculateMatureDate(
      form.getValues("openingDate") ?? openingDate,
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
  }, [duration, openingDate, durtype, durationTypeData, form]);

  return {
    loading,
    form,
    handleSubmit,
    getInvestmentTypeApiCall,
    getInvestmentAccountTypeApiCall,
    getInvestmentInterestTypeApiCall,
    getInvestmentPrincipalLedgerApiCall,
    getInvestmentInterestLedgerApiCall,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleCalculateMatureAmount,
  };
};
