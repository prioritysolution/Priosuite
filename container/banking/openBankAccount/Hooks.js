"use client";
import { useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getBankAccountTypeAPI,
  getBankGlAPI,
  postOpenBankAccountAPI,
} from "./OpenBankAccountApis";
import {
  getBankAccountTypeData,
  getBankGlData,
} from "./OpenBankAccountReducer";
import {
  alphanumericRegex,
  integerUpTo15DigitsRegex,
} from "@/utils/validationRegex";
import { format } from "date-fns";

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

export const useOpenBankAccount = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState("");

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    openingDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Opening date is required"),

    bankName: yup.string().required("Bank name is required"),
    bankBranch: yup.string().required("Bank branch is required"),
    ifscCode: yup
      .string()
      .required("IFSC code is required") // Required validation
      .test(
        "is-alphanumeric",
        "Invalid IFSC code",
        (value) => alphanumericRegex.test(value), // Validate as alphanumeric and exactly 11 characters
      )
      .test(
        "is-exactly-11-length",
        "Invalid IFSC code",
        (value) => value.length === 11, // Ensure length is exactly 11
      ),
    accountNo: yup
      .string()
      .required("Account no. is required") // Required validation
      .test("is-non-decimal-integer", "Invalid Account no.", (value) => {
        if (!value) return false; // Required validation will handle null or empty
        return integerUpTo15DigitsRegex.test(value); // Ensure it's a non-decimal integer up to 15 digits
      })
      .test(
        "is-max-15-digits",
        "Account no. must not exceed 15 digits",
        (value) => {
          if (!value) return false; // Required validation will handle null or empty
          return value.length <= 15; // Ensure length is up to 15 digits
        },
      ),
    accountType: yup.string().required("Account type is required"),
    bankGl: yup.string().required("Bank gl is required"),
  });

  const beg_date = getCookieData("beg_date");

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      openingDate: beg_date ? parseFlexDate(beg_date) : new Date(),
      bankName: "",
      bankBranch: "",
      ifscCode: "",
      accountNo: "",
      accountType: "",
      bankGl: "",
    },
  });

  const handleSubmit = async (values) => {
    postOpenBankAccountApiCall(values);
  };

  const postOpenBankAccountApiCall = async (item) => {
    let data = {
      opening_date: item.openingDate
        ? format(item.openingDate, "yyyy-MM-dd")
        : "",
      bank_name: item.bankName,
      branch_name: item.bankBranch,
      ifsc_code: item.ifscCode,
      account_no: item.accountNo,
      account_type: item.accountType,
      under_gl: item.bankGl,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postOpenBankAccountAPI(data);

      if (res.message === "Success") {
        form.reset();
        toast.success(res.details || res.message);
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

  const getBankAccountTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getBankAccountTypeAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getBankAccountTypeData(res.details));
      } else {
        dispatch(getBankAccountTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getBankAccountTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  const getBankGlApiCall = async (orgId, accountType) => {
    setLoading(true);

    try {
      const res = await getBankGlAPI(orgId, accountType);
      if (res.message === "Data Found") {
        dispatch(getBankGlData(res.details));
      } else {
        dispatch(getBankGlData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getBankGlData([]));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    getBankAccountTypeApiCall,
    getBankGlApiCall,
  };
};
