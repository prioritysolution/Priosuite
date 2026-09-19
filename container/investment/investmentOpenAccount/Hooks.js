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
  postInvestmentOpenAccountAPI,
  getInvestmentDurationAPI,
} from "./InvestmentOpenAccountApis";
import {
  getInvestmentAccountTypeData,
  getInvestmentDurationData,
  getInvestmentInterestLedgerData,
  getInvestmentInterestTypeData,
  getInvestmentPrincipalLedgerData,
  getInvestmentTypeData,
} from "./InvestmentOpenAccountReducer";
import { addDays, addMonths, addYears, format, isValid, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import {
  alphanumericWithHyphenUnderscoreRegex,
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

export const useInvestmentOpenAccount = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

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

  const durationTypeData = useSelector(
    (state) => state.investmentOpenAccount.investmentDurationData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    investmentType: yup.string().required("Investment type is required"),
    accountType: yup.string().required("Account type is required"),
    bankName: yup.string().required("Bank name is required"),
    accountNo: yup
      .string()
      .required("Account no. is required") // Ensure the field is required
      .test("is-valid-integer", "Invalid Account no.", (value) => {
        if (!value) return false; // If the value is empty, it's invalid
        return positiveIntegerRegex.test(value); // Validate using regex (not starting with 0, and integer up to 12 digits)
      }),
      
    openingDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Opeing date is required"),

    amount: yup
      .string()
      .required("Amount is required") // Required validation for null or empty string
      .test(
        "is-valid-amount",
        "Amount must be an integer greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          return positiveIntegerRegex.test(value); // Validate that it's an integer
        },
      )
      .test(
        "is-greater-than-zero",
        "Amount must be greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          const numberValue = parseInt(value, 10);
          return numberValue > 0; // Ensure the value is greater than 0
        },
      ),
    rateOfInterest: yup
      .string()
      .required("Rate of interest is required") // Required validation for null or empty string
      .test(
        "is-valid-rate-of-interest",
        "Rate of interest must be a valid number with up to 2 decimal places",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          return maxTwoDecimalPlaces.test(value); // Validate that it's a decimal with up to 2 decimals
        },
      )
      .test(
        "is-greater-than-zero",
        "Rate of interest must be greater than 0",
        (value) => {
          if (!value) return false; // Return false if the value is null or empty
          const numberValue = parseFloat(value);
          return numberValue > 0; // Ensure the value is greater than 0
        },
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
        },
      ),
    matureDate: yup.string(),
    matureAmount: yup.string().required("Mature amount is required"),
    principalLedger: yup.string().required("Principal ledger is required"),
    interestLedger: yup.string().required("Interest ledger is required"),
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
    particulars: yup.string().required("Particulars is required"),
    bank: yup
      .string()
      .test("is-required-bank", "Bank is required", function (value) {
        const { transMode } = this.parent;
        if (transMode !== "bank") return true;
        return !!value;
      }),
      durtype: yup.string().required("Duration type is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      investmentType: "",
      accountType: "",
      bankName: "",
      accountNo: "",
      openingDate: parseDateHelper(beg_date) || new Date(),
      amount: "",
      rateOfInterest: "",
      interestType: "",
      duration: "",
      matureDate: "",
      matureAmount: "",
      principalLedger: "",
      interestLedger: "",
      refVouchNo: "",
      transMode: "cash",
      particulars: "",
      bank: "",
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
    transMode,
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
      "transMode",
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

  // Set openingDate to beg_date by default
  useEffect(() => {
    const clientBegDate = getCookieData("beg_date");

    if (clientBegDate) {
      form.setValue(
        "openingDate",
        parseDateHelper(clientBegDate) || new Date(),
      );
    }
  }, [form]);

  const handleSubmit = async (values) => {
    postInvestmentOpenAccountApiCall(values);
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

  const postInvestmentOpenAccountApiCall = async (item) => {
    const cashDetails = cashDenomArray.map((cash) => ({
      note_id: cash.note_id,
      in_qnty: 0,
      out_qnty: cash.denominator,
      tot_amount: cash.totalAmount,
    }));

    let data = {
      invest_type: item.investmentType,
      acct_type: item.accountType,
      bank_name: item.bankName,
      acct_no: item.accountNo,
      open_date: formatDateForApi(item.openingDate),
      invest_amt: item.amount,
      roi: item.rateOfInterest,
      duration: item.duration,
      mature_date: formatDateForApi(item.matureDate),
      mature_value: item.matureAmount,
      prn_gl: item.principalLedger,
      intt_gl: item.interestLedger,
      intt_on: item.interestType,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      bank_id: item.transMode === "bank" ? item.bank : null,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
      particulars: item.particulars,
    };

    setLoading(true);

    try {
      const res = await postInvestmentOpenAccountAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setDenominators(defaultDenominators);
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
        // form.getValues("interestType"),
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


  const getInvestmentDurationApiCall = async (org_id = orgId) => {
    if (!org_id) return;
    setLoading(true);
    try {
      const res = await getInvestmentDurationAPI(org_id);
      const durationList = Array.isArray(res?.details)
        ? res.details
        : Array.isArray(res?.Data)
          ? res.Data
          : Array.isArray(res)
            ? res
            : [];
      if (
        (res?.message === "Data Found" || res?.message === "Success") &&
        durationList.length > 0
      ) {
        dispatch(getInvestmentDurationData(durationList));
      } else {
        dispatch(getInvestmentDurationData([]));
      }
    } catch (error) {
      console.error(error);
      dispatch(getInvestmentDurationData([]));
    } finally {
      setLoading(false);
    }
  };

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
    getInvestmentTypeApiCall,
    getInvestmentAccountTypeApiCall,
    getInvestmentInterestTypeApiCall,
    getInvestmentPrincipalLedgerApiCall,
    getInvestmentInterestLedgerApiCall,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    transMode,
    handleCalculateMatureAmount,
    getInvestmentDurationApiCall
  };
};
