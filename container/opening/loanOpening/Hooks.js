"use client";

import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getCheckLoanDurationUnitDataAPI,
  getCheckLoanEligibleAPI,
  getLoanDurationUnitAPI,
  getLoanEmiAPI,
  getLoanInterestRateAPI,
  getLoanProductDataAPI,
  getLoanRepaymentModeAPI,
  postCheckLoanAmountAPI,
  postLoanMemberInfoAPI,
} from "@/container/loan/newApplication/NewApplicationApis";
import {
  getDurationUnitData,
  getLoanProductData,
  getRepaymentModeData,
} from "@/container/loan/newApplication/NewApplicationReducer";
import { addDays, addMonths, addYears, format, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import { postOpeningLoanAccountAPI } from "./LoanOpeningApis";
import {
  maxTwoDecimalPlaces,
  uptoFourDigitRegex,
} from "@/utils/validationRegex";

export const useLoanOpening = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [addLoanAccountLoading, setAddLoanAccountLoading] = useState(false);
  const [checkLoanEligibleLoading, setCheckLoanEligibleLoading] =
    useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [loanMemberProduct, setLoanMemberProduct] = useState(null);
  const [amountErrorMessage, setAmountErrorMessage] = useState("");
  const [loanEligible, setLoanEligible] = useState(false);

  const [showEmi, setShowEmi] = useState(false);

  const productData = useSelector(
    (state) => state?.newApplication?.loanProductData
  );

  const formSchema = yup.object({
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    memberType: yup.string().nullable(),
    shareBalance: yup.string().nullable(),
    applicationDate: yup
      .date()
      .nullable()
      .transform((curr, orig) => (orig === "" ? null : curr))
      .typeError("Application date is required")
      .required("Application date is required"),
    applicationNo: yup
      .string()
      .nullable() // Allow null values
      .notRequired() // Make it optional (not required)
      .max(10, "Application number must be at most 10 characters") // Enforce a max length of 10 characters
      .matches(/^.*$/, "Application number must be alphanumeric or empty"), // Optional: Add a custom pattern, if needed
    accountNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for proper validation
      .required("Manual account no. is required")
      .test(
        "is-valid-accountNo",
        "Account number must be a numeric value with up to 4 digits and not start with 0",
        (value) => {
          if (value === null) return true; // Required error for null or empty values
          return uptoFourDigitRegex.test(value);
        }
      ),
    ledgerFolio: yup.string().nullable(),
    productId: yup.string().required("Product is required"),
    applicationAmount: yup
      .string()
      .test(
        "is-required-applicationAmount",
        "Application amount is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        }
      )
      .test(
        "is-positive-number",
        "Application amount must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        }
      )
      .test(
        "is-valid-decimal",
        "Application amount can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
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
    durationUnit: yup.string().required("Duration unit is required"),
    repaymentMode: yup.string().required("Repayment mode is required"),
    finalRepaymentDate: yup.string().nullable(),
    emiAmount: yup.string().nullable(),
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
      ),
    dueInterest: yup
      .string() // Use string to handle empty strings first
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for required validation
      .required("Due interest is required") // Required validation for null or empty values
      .test(
        "is-positive-integer",
        "Due interest must be a integer without decimal points",
        (value) => {
          if (value === null) return false; // Required error for null values
          const numberValue = Number(value);
          // Check if the value is a positive integer and not a decimal
          return Number.isInteger(numberValue) && numberValue >= 0;
        }
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      memberType: "",
      shareBalance: "",
      applicationDate: "",
      applicationNo: "",
      accountNo: "",
      ledgerFolio: "",
      productId: "",
      applicationAmount: "",
      rateOfInterest: "",
      duration: "",
      durationUnit: "",
      repaymentMode: "",
      finalRepaymentDate: "",
      emiAmount: "",
      outstandingBalance: "",
      dueInterest: "",
    },
  });

  const { control } = form;
  const {
    productId,
    applicationAmount,
    duration,
    durationUnit,
    rateOfInterest,
  } = useWatch({
    control,
  });

  const handleSubmit = (values) => {
    postOpeningLoanAccountApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    postLoanMemberInfoByIdApiCall(values);
    form.setValue("applicationDate", values.date);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postOpeningLoanAccountApiCall = async (item) => {
    let data = {
      start_date: startDate,
      disb_date: formatDateForApi(item.applicationDate),
      mem_id: loanMemberProduct.Id,
      appl_no: item.applicationNo,
      ref_ac_no: item.accountNo,
      ledg_fol: item.ledgerFolio ? item.ledgerFolio : null,
      prod_id: item.productId,
      duration: item.duration,
      dur_unit: item.durationUnit,
      roi: item.rateOfInterest,
      disb_amount: item.applicationAmount,
      repay_mode: item.repaymentMode,
      repay_within: format(
        parse(item.finalRepaymentDate, "dd-MM-yyyy", new Date()),
        "yyyy-MM-dd"
      ),
      outs_balance: item.outstandingBalance,
      due_intt: item.dueInterest,
      branch_Id: branchId,
      org_id: orgId,
    };

    setAddLoanAccountLoading(true);
    try {
      const res = await postOpeningLoanAccountAPI(data);
      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setLoanMemberProduct(null);
        setLoanEligible(false);
        setShowEmi(false);
        setResetTrigger((prev) => prev + 1);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setAddLoanAccountLoading(false);
    }
  };

  const postLoanMemberInfoByIdApiCall = async (item) => {
    setLoading(true);

    try {
      const res = await postLoanMemberInfoAPI(
        orgId,
        item.memberNo,
        format(item.date, "yyyy-MM-dd")
      );
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("memberType", res.details[0].Member_Type || "");
        form.setValue("shareBalance", res.details[0].Balance || "");
        setLoanMemberProduct(res.details[0]);
        getLoanProductDataApiCall(orgId);
      } else {
        setVisibleBlock(false);
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("memberType", "");
        form.setValue("shareBalance", "");
        setLoanMemberProduct(null);
        toast.error(res.details);
      }
      console.log(res);
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("memberType", "");
      form.setValue("shareBalance", "");
      setLoanMemberProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const getLoanProductDataApiCall = async (orgId) => {
    setLoading(true);
    try {
      const res = await getLoanProductDataAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getLoanProductData(res.details));
      } else {
        dispatch(getLoanProductData([]));
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLoanProductData([]));
    } finally {
      setLoading(false);
    }
  };

  const getCheckLoanEligibleApiCall = async (orgId) => {
    setCheckLoanEligibleLoading(true);

    try {
      const res = await getCheckLoanEligibleAPI(
        orgId,
        form.getValues("productId"),
        loanMemberProduct.Id,
        format(form.getValues("applicationDate"), "yyyy-MM-dd")
      );
      if (res.message === "Data Found") {
        setLoanEligible(true);

        getLoanDurationUnitApiCall(productId, orgId);
        getLoanRepaymentModeApiCall(productId, orgId);
        getLoanInterestRateApiCall(orgId, productId);

        const selectedProduct = productData.find(
          (item) => item.Id.toString() === productId
        );

        setShowEmi(!!selectedProduct && selectedProduct?.Loan_Type === 24);

        console.log(
          productData.filter((item) => item.Id.toString() === productId)
        );
      } else {
        setLoanEligible(false);
        toast.error(res.details);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLoanEligible(false);
    } finally {
      setCheckLoanEligibleLoading(false);
    }
  };

  const getLoanDurationUnitApiCall = async (prodId, orgId) => {
    setLoading(true);
    try {
      const res = await getLoanDurationUnitAPI(prodId, orgId);
      if (res.message === "Data Found") {
        dispatch(getDurationUnitData(res.details));
      } else {
        dispatch(getDurationUnitData([]));
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getDurationUnitData([]));
    } finally {
      setLoading(false);
    }
  };

  const getCheckLoanDurationUnitDataApiCall = async (
    orgId,
    prodId,
    duration,
    durationUnit
  ) => {
    setLoading(true);
    try {
      const res = await getCheckLoanDurationUnitDataAPI(
        orgId,
        prodId,
        duration,
        durationUnit
      );
      if (res.message === "Data Found") {
        toast.success(res.details);
      } else {
        toast.error(res.details);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getLoanRepaymentModeApiCall = async (prodId, orgId) => {
    setLoading(true);
    try {
      const res = await getLoanRepaymentModeAPI(prodId, orgId);
      if (res.message === "Data Found") {
        dispatch(getRepaymentModeData(res.details));
      } else {
        dispatch(getRepaymentModeData([]));
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getRepaymentModeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getLoanInterestRateApiCall = async (orgId, prodId) => {
    setLoading(true);
    try {
      const res = await getLoanInterestRateAPI(orgId, prodId);
      if (res.message === "Data Found") {
        form.setValue("rateOfInterest", res.details[0].Roi);
      } else {
        form.setValue("rateOfInterest", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("rateOfInterest", "");
    } finally {
      setLoading(false);
    }
  };

  const getLoanEmiApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getLoanEmiAPI(
        orgId,
        form.getValues("applicationAmount"),
        form.getValues("rateOfInterest"),
        form.getValues("duration")
      );
      if (res.message === "Data Found") {
        form.setValue("emiAmount", res.details);
      } else {
        form.setValue("emiAmount", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("emiAmount", "");
    } finally {
      setLoading(false);
    }
  };

  const postCheckLoanAmountApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await postCheckLoanAmountAPI(
        orgId,
        form.getValues("productId"),
        form.getValues("applicationAmount")
      );
      if (res.message === "Data Found") {
        setAmountErrorMessage("");
      } else {
        setAmountErrorMessage(res.details);
      }
      console.log(res);
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      setAmountErrorMessage("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId && orgId) {
      getCheckLoanEligibleApiCall(orgId);
    }
  }, [productId, orgId]);

  useEffect(() => {
    if (productId && applicationAmount && orgId) {
      postCheckLoanAmountApiCall(orgId);
    }
  }, [productId, applicationAmount, orgId]);

  useEffect(() => {
    if (productId && duration && durationUnit && orgId) {
      getCheckLoanDurationUnitDataApiCall(
        orgId,
        productId,
        duration,
        durationUnit
      );
    }
  }, [productId, duration, durationUnit, orgId]);

  useEffect(() => {
    if (duration && durationUnit) {
      if (durationUnit === "30")
        form.setValue(
          "finalRepaymentDate",
          format(
            addYears(
              form.getValues("applicationDate"),
              Number(form.getValues("duration"))
            ),
            "dd-MM-yyyy"
          )
        );
      else if (durationUnit === "29")
        form.setValue(
          "finalRepaymentDate",
          format(
            addMonths(
              form.getValues("applicationDate"),
              Number(form.getValues("duration"))
            ),
            "dd-MM-yyyy"
          )
        );
    }
  }, [duration, durationUnit]);

  useEffect(() => {
    if (
      productId &&
      applicationAmount &&
      rateOfInterest &&
      duration &&
      orgId &&
      showEmi
    ) {
      getLoanEmiApiCall(orgId);
    }
  }, [duration, applicationAmount, rateOfInterest, orgId, showEmi]);

  return {
    loading,
    addLoanAccountLoading,
    checkLoanEligibleLoading,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    amountErrorMessage,
    showEmi,
    loanEligible,
    resetTrigger,
  };
};
