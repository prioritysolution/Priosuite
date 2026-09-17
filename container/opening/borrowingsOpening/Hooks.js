"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { addMonths, format, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import {
  getInterestLedgerData,
  getPrincipalLedgerData,
  getProductTypeData,
  getRepayModeData,
} from "@/container/borrowings/newApplication/NewApplicationReducer";
import { getBorrowingProductRepayLedgerDataAPI } from "@/container/borrowings/newApplication/NewApplicationApis";
import { postOpeningBorrowingsAccountAPI } from "./BorrowingsOpeningApis";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";

export const useBorrowingsOpening = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const startDate = getCookieData("fin_start_date");

  const formSchema = yup.object({
    productName: yup.string().required("Product name is required"),
    productType: yup.string().required("Product type is required"),
    repaymentMode: yup.string().required("Repayment mode is required"),
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
    issueDate: yup
      .date()
      .typeError("Issue date is required")
      .required("Issue date is required")
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
    overdueRate: yup
      .string()
      .test(
        "is-required-overdueRate",
        "Overdue rate is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        }
      )
      .test(
        "is-positive-number",
        "Overdue rate must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        }
      )
      .test(
        "is-valid-decimal",
        "Overdue rate can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        }
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
        }
      ),
    dueDate: yup.string(),
    principalLedger: yup.string().required("Principal ledger is required"),
    interestLedger: yup.string().required("Interest ledger is required"),
    outstandingBalance: yup
      .string()
      .test(
        "is-required-outstandingBalance",
        "Outstanding balance is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        }
      )
      .test(
        "is-positive-number",
        "Outstanding balance must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        }
      )
      .test(
        "is-valid-decimal",
        "Outstanding balance can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        }
      )
      .test(
        "is-less-than-amount",
        "Outstanding balance cannot be greater than amount",
        function (value) {
          const amount = parseFloat(this.parent.amount) || 0; // Convert amount to a number
          const outstandingBalance = parseFloat(value) || 0;
          return outstandingBalance <= amount; // Ensure outstandingBalance is <= amount
        }
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productName: "",
      productType: "",
      repaymentMode: "",
      bankName: "",
      accountNo: "",
      issueDate: null,
      amount: "",
      rateOfInterest: "",
      overdueRate: "",
      duration: "",
      dueDate: "",
      principalLedger: "",
      interestLedger: "",
      outstandingBalance: "",
    },
  });

  const { control } = form;
  const { issueDate, duration, amount, outstandingBalance } = useWatch({
    control,
  });

  const handleSubmit = async (values) => {
    postOpeningBorrowingsAccountApiCall(values);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postOpeningBorrowingsAccountApiCall = async (item) => {
    let data = {
      start_date: startDate,
      prod_name: item.productName,
      prod_type: item.productType,
      repay_mode: item.repaymentMode,
      bank_name: item.bankName,
      acct_no: item.accountNo,
      disb_date: formatDateForApi(item.issueDate),
      disb_amount: item.amount,
      roi: item.rateOfInterest,
      over_rate: item.overdueRate,
      duration: item.duration,
      due_date: format(
        parse(item.dueDate, "dd-MM-yyyy", new Date()),
        "yyyy-MM-dd"
      ),
      prn_ledg: item.principalLedger,
      intt_ledg: item.interestLedger,
      outs_amt: item.outstandingBalance,
      branch_Id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postOpeningBorrowingsAccountAPI(data);

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

  const getBorrowingsProductTypeApiCall = async (org_id) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI("PRODUCTTYPE", org_id || orgId);
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

  const getBorrowingsRepayModeApiCall = async (org_id) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI("REPAYMODE", org_id || orgId);
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

  const getBorrowingsPrincipalLedgerApiCall = async (org_id) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI(
        "PRINCIPALLEGDER",
        org_id || orgId,
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

  const getBorrowingsInterestLedgerApiCall = async (org_id) => {
    setLoading(true);

    try {
      const res = await getBorrowingProductRepayLedgerDataAPI("INTERESTLEDGER", org_id || orgId);
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
            Number(form.getValues("duration"))
          ),
          "dd-MM-yyyy"
        )
      );
    }

    prevDuration.current = currentDuration;
    prevIssueDate.current = currentIssueDate;
  }, [duration, issueDate]);

  useEffect(() => {
    if (amount) form.trigger("outstandingBalance");
  }, [amount]);

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
