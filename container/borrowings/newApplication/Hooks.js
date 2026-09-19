"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMonths, format, parse } from "date-fns";
import {
  getInterestLedgerData,
  getPrincipalLedgerData,
  getProductTypeData,
  getRepayModeData,
} from "./NewApplicationReducer";
import {
  addBorrowingsNewApplicationAPI,
  getBorrowingProductRepayLedgerDataAPI,
} from "./NewApplicationApis";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
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

export const useBorrowingsNewApplication = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");
  const beg_date = getCookieData("beg_date");

  const formSchema = yup.object({
    productName: yup.string().required("Product name is required"),
    productType: yup.string().required("Product type is required"),
    repaymentMode: yup.string().required("Repayment mode is required"),
    bankName: yup.string().required("Bank name is required"),
    accountNo: yup
      .string()
      .required("Account no. is required") // Ensure the field is required
      .test("is-valid-integer", "Invalid Account no.", (value) => {
        if (!value) return false; // If the value is empty, it's invalid
        return positiveIntegerRegex.test(value); // Validate using regex (not starting with 0, and integer up to 12 digits)
      }),
    issueDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Issue date is required"),
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
    overdueRate: yup
      .string()
      .required("Overdue rate is required") // Ensure the field is required
      .test(
        "is-valid-integer",
        "Overdue rate must be a non-decimal integer",
        (value) => {
          if (value === null || value === "") return false; // Required validation already handles this
          return integerRegex.test(value); // Validate it matches integer format
        },
      ),
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
    dueDate: yup.string(),
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
    // transMode: yup.string().required("Transaction mode is required"),
    bank: yup.string().required("Bank is required"),
    // DisbDate: yup
    //   .date()
    //   .transform((value, originalValue) =>
    //     originalValue === "" ? null : value,
    //   )
    //   .typeError("Invalid date")
    //   .required("Disb date is required"),
    voucherDate: yup.string().required("Voucher date is required"),
    particulars: yup.string().required("Particulars is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productName: "",
      productType: "",
      repaymentMode: "",
      bankName: "",
      accountNo: "",
      issueDate: parseDateHelper(beg_date) || new Date(),
      amount: "",
      rateOfInterest: "",
      overdueRate: "",
      duration: "",
      dueDate: "",
      principalLedger: "",
      interestLedger: "",
      refVouchNo: "",
      // transMode: "bank",
      bank: "",

      voucherDate: parseDateHelper(beg_date) || new Date(),
      particulars: "",
    },
  });

  const { control } = form;
  const { issueDate, duration } = useWatch({ control });

  // Set default dates to beg_date by default
  useEffect(() => {
    const clientBegDate = getCookieData("beg_date");
    if (clientBegDate) {
      const parsed = parseDateHelper(clientBegDate) || new Date();
      form.setValue("issueDate", parsed);
      form.setValue("voucherDate", parsed);
    }
  }, [form]);

  const handleSubmit = async (values) => {
    postBorrowingsNewApplicationApiCall(values);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postBorrowingsNewApplicationApiCall = async (item) => {
    let data = {
      prod_name: item.productName,
      prod_type: item.productType,
      repay_mode: item.repaymentMode,
      bank_name: item.bankName,
      acct_no: item.accountNo,
      disb_date: format(item.issueDate, "yyyy-MM-dd"),
      amount: item.amount,
      roi: item.rateOfInterest,
      over_rate: item.overdueRate,
      duration: item.duration,
      due_date: format(
        parse(item.dueDate, "dd-MM-yyyy", new Date()),
        "yyyy-MM-dd",
      ),
      prn_ledg: item.principalLedger,
      intt_ledg: item.interestLedger,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      bank_id: item.bank,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
      particulars: item.particulars,
      vouch_date: format(item.voucherDate, "yyyy-MM-dd"),
    };

    setLoading(true);

    try {
      const res = await addBorrowingsNewApplicationAPI(data);

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

  const getBorrowingsProductTypeApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI(
        "PRODUCTTYPE",
        orgId,
      );
      if (res.message === "Data Found") {
        dispatch(getProductTypeData(res.details));
      } else {
        dispatch(getProductTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getProductTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBorrowingsRepayModeApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI(
        "REPAYMODE",
        orgId,
      );
      if (res.message === "Data Found") {
        dispatch(getRepayModeData(res.details));
      } else {
        dispatch(getRepayModeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getRepayModeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBorrowingsPrincipalLedgerApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI(
        "PRINCIPALLEGDER",
        orgId,
      );
      if (res.message === "Data Found") {
        dispatch(getPrincipalLedgerData(res.details));
      } else {
        dispatch(getPrincipalLedgerData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getPrincipalLedgerData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBorrowingsInterestLedgerApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI(
        "INTERESTLEDGER",
        orgId,
      );
      if (res.message === "Data Found") {
        dispatch(getInterestLedgerData(res.details));
      } else {
        dispatch(getInterestLedgerData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getInterestLedgerData([]));
    } finally {
      setLoading(false);
    }
  };

  const prevDuration = useRef();
  const prevIssueDate = useRef();

  useEffect(() => {
    const currentDuration = form.getValues("duration");
    const currentIssueDate = form.getValues("issueDate");

    if (
      currentDuration &&
      currentIssueDate &&
      (currentDuration !== prevDuration.current ||
        currentIssueDate !== prevIssueDate.current)
    ) {
      form.setValue(
        "dueDate",
        format(
          addMonths(
            form.getValues("issueDate"),
            Number(form.getValues("duration")),
          ),
          "dd-MM-yyyy",
        ),
      );
    }

    prevDuration.current = currentDuration;
    prevIssueDate.current = currentIssueDate;
  }, [duration, issueDate]);

  return {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getBorrowingsProductTypeApiCall,
    getBorrowingsRepayModeApiCall,
    getBorrowingsPrincipalLedgerApiCall,
    getBorrowingsInterestLedgerApiCall,
  };
};
