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
} from "@/container/banking/openBankAccount/OpenBankAccountApis";
import {
  getBankAccountTypeData,
  getBankGlData,
} from "@/container/banking/openBankAccount/OpenBankAccountReducer";
import { postOpeningBankAccountAPI } from "./BankOpeningApis";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import { format, parse } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";

export const useBankOpening = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);

  const formSchema = yup.object({
    openingDate: yup
      .date()
      .typeError("Opening date is required")
      .required("Opening date is required")
      .test("is-between", "Invalid Date", function (value) {
        if (!value) return false;
        return format(value, "yyyy-MM-dd") < startDate;
      }),
    bankName: yup.string().required("Bank name is required"),
    bankBranch: yup.string().required("Bank branch is required"),
    ifscCode: yup.string().required("IFSC code is required"),
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
    accountType: yup.string().required("Account type is required"),
    bankGl: yup.string().required("Bank gl is required"),
    openingBalance: yup
      .string()
      .test(
        "is-required-openingBalance",
        "Opening balance is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        },
      )
      .test(
        "is-positive-number",
        "Opening balance must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Opening balance can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      openingDate: null,
      bankName: "",
      bankBranch: "",
      ifscCode: "",
      accountNo: "",
      accountType: "",
      bankGl: "",
      openingBalance: "",
    },
  });

  const handleSubmit = async (values) => {
    postOpeningBankAccountApiCall(values);
  };

  const postOpeningBankAccountApiCall = async (item) => {
    let data = {
      bank_name: item.bankName,
      branch_name: item.bankBranch,
      ifsc: item.ifscCode,
      account_no: item.accountNo,
      acct_type: item.accountType,
      under_gl: item.bankGl,
      open_date: formatDateForApi(item.openingDate),
      open_balance: item.openingBalance,
      branch_Id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postOpeningBankAccountAPI(data);

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

  const getBankGlApiCall = async (org_id, typeId) => {
    setLoading(true);

    try {
      const res = await getBankGlAPI(org_id, typeId);
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
