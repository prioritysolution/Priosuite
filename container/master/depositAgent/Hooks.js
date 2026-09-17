"use client";

import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { getPaymentTypeAPI, postDepositAgentAPI } from "./DepositAgentApis";
import { getPaymentTypeData } from "./DepositAgentReducer";
import {
  maxTwoDecimalPlaces,
  mobileLengthRegex,
  mobileNoLeadingZeroRegex,
  mobileRegex,
} from "@/utils/validationRegex";

export const useDepositAgent = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const orgId = getCookieData("orgId");

  const formSchema = yup.object({
    agentName: yup.string().required("Member type is required"),
    address: yup.string().required("Address is required"),
    mobile: yup
      .string()
      .required("Mobile no. is required") // Required validation
      .test("no-leading-zero", "Mobile no. must not start with 0", (value) => {
        if (value === null || value === "") return false; // Required validation will handle null/empty
        return mobileNoLeadingZeroRegex.test(value); // Validate no leading zero
      })
      .test(
        "is-exactly-10-digits",
        "Mobile no. must be exactly 10 digits",
        (value) => {
          if (value === null || value === "") return false; // Required validation will handle null/empty
          return mobileLengthRegex.test(value); // Validate exact 10 digits
        },
      ),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    depositAmount: yup
      .string()
      .test(
        "is-integer",
        "Deposit amount must be a non-decimal number",
        (value) => {
          if (!value || value === "") return true; // Allow empty
          const numberValue = Number(value);
          return Number.isInteger(numberValue); // Ensure it's a non-decimal number
        },
      )
      .test("is-positive", "Deposit amount must be greater than 0", (value) => {
        if (!value || value === "") return true; // Allow empty
        return Number(value) > 0; // Ensure it's greater than 0
      })
      .required("Deposit amount is required"),

    maximumDays: yup
      .string()
      .test(
        "is-integer",
        "Maximum days must be a non-decimal number",
        (value) => {
          if (!value || value === "") return true; // Allow empty
          const numberValue = Number(value);
          return Number.isInteger(numberValue); // Ensure it's a non-decimal number
        },
      )
      .test("is-positive", "Maximum days must be greater than 0", (value) => {
        if (!value || value === "") return true; // Allow empty
        return Number(value) > 0; // Ensure it's greater than 0
      })
      .required("Maximum days is required"),
    maximumDeposit: yup
      .string()
      .test(
        "is-integer",
        "Maximum deposit must be a non-decimal number",
        (value) => {
          if (!value || value === "") return true; // Allow empty
          const numberValue = Number(value);
          return Number.isInteger(numberValue); // Ensure it's a non-decimal number
        },
      )
      .test(
        "is-positive",
        "Maximum deposit must be greater than 0",
        (value) => {
          if (!value || value === "") return true; // Allow empty
          return Number(value) > 0; // Ensure it's greater than 0
        },
      )
      .required("Maximum deposit is required"),
    paymentType: yup.string().required("Payment type is required"),
    payoutAmount: yup
      .string()
      .test(
        "is-positive-number",
        "Payout amount must be greater than 0",
        (value) => {
          if (!value || value.trim() === "") {
            return true; // Allow empty
          }
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Payout amount can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      )
      .required("Payout amount is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      agentName: "",
      address: "",
      mobile: "",
      email: "",
      depositAmount: "",
      maximumDays: "",
      maximumDeposit: "",
      paymentType: "",
      payoutAmount: "",
    },
  });

  const handleSubmit = (values) => {
    postDepositAgentApiCall(values);
  };

  const postDepositAgentApiCall = async (item) => {
    let data = {
      agent_name: item.agentName,
      address: item.address,
      mobile: item.mobile,
      email: item.email,
      deposit_amt: item.depositAmount,
      max_days: item.maximumDays,
      max_amt: item.maximumDeposit,
      paid_mode: item.paymentType,
      paid_amt: item.payoutAmount,

      org_id: orgId,
    };
    setLoading(true);
    try {
      const res = await postDepositAgentAPI(data);
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset();
      } else toast.error(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentTypeDataApiCall = async (org_id) => {
    try {
      const res = await getPaymentTypeAPI(org_id);
      console.log("getPaymentTypeAPI=", res);
      if (res.message === "Data Found") {
        dispatch(getPaymentTypeData(res.details));
      } else {
        dispatch(getPaymentTypeData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getPaymentTypeData([]));
    }
  };

  return {
    loading,
    getPaymentTypeDataApiCall,
    handleSubmit,
    form,
  };
};
