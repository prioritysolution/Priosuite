"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { getOperateProductAPI } from "../deposit/DepositApis";
import { getOperateProductData } from "../deposit/DepositReducer";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDays, addMonths, addYears, format } from "date-fns";
import { getDepositMatureAccountAPI } from "../mature/MatureApis";
import {
  checkDepositDurationAPI,
  getDepositInterestRateAPI,
  getDepositMaturityAmountAPI,
} from "../openDepositAccount/OpenDepositAccountApis";
import { useOpenDepositAccount } from "../openDepositAccount/Hooks";
import { postDepositRenewalAccountAPI } from "./RenewalApis";
import { alphanumericWithHyphenUnderscoreRegex } from "@/utils/validationRegex";

export const useRenewal = () => {
  const dispatch = useDispatch();
  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const getOperateProductAPICall = async (orgId, screen) => {
    try {
      const res = await getOperateProductAPI(orgId, screen);
      if (res.message === "Data Found") {
        dispatch(getOperateProductData(res.details));
      }
    } catch (error) {
      console.error(error);
      dispatch(getOperateProductData([]));
    }
  };

  useEffect(() => {
    if (orgId) {
      getOperateProductAPICall(orgId, "R");
    }
  }, [orgId]);

  const [loading, setLoading] = useState(false);
  const [getRenewalLoading, setGetRenewalLoading] = useState(false);
  const [postRenewalLoading, setPostRenewalLoading] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);

  const [checkDepositDurationDisable, setCheckDepositDurationDisable] =
    useState(false);
  const [checkDepositDurationMessage, setCheckDepositDurationMessage] =
    useState("");

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const formSchema = yup.object({
    productId: yup.string().nullable(),
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    refAcNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    mobile: yup.string().nullable(),
    panNo: yup.string().nullable(),
    depositAmount: yup.string().nullable(),
    rateOfInterest: yup.string().nullable(),
    maturityDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    maturityAmount: yup.string().nullable(),
    renewalType: yup.string().required("Renewal type is required"),
    renewalDate: yup.string().nullable(),
    effectDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    depositBalance: yup.string().nullable(),
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
    durationUnit: yup.string().required("Duration unit is required"),
    newRateOfInterest: yup.string(),
    newMaturityAmount: yup.string(),
    newMaturityDate: yup.string(),
    payoutAmount: yup.string(),
    Joint_1: yup.string().nullable(),
    Joint_2: yup.string().nullable(),
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
    transMode: yup.string().required("Transanction mode is required"),
    bank: yup.string(),
    savings: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productId: "",
      memberNo: "",
      cifNo: "",
      refAcNo: "",
      memberName: "",
      gurdianName: "",
      mobile: "",
      panNo: "",
      depositAmount: "",
      rateOfInterest: "",
      maturityDate: "",
      maturityAmount: "",
      renewalType: "maturity",
      renewalDate: "",
      effectDate: "",
      depositAmount: "",
      duration: "",
      durationUnit: "",
      newRateOfInterest: "",
      newMaturityAmount: "",
      newMaturityDate: "",
      payoutAmount: "",
      Joint_1: "",
      Joint_2: "",
      refVouchNo: "",
      transMode: "bank",
    },
  });

  const { control } = form;
  const {
    duration,
    durationUnit,
    renewalType,
    newRateOfInterest,
    depositAmount,
    maturityAmount,
    renewalDate,
  } = useWatch({
    control,
  });

  // Calculate newMaturityDate when duration, durationUnit, or renewalDate changes (similar to OpenDepositAccount)
  useEffect(() => {
    if (duration && durationUnit && renewalDate) {
      let calcMaturityDate;
      const durationNum = parseInt(duration);
      const unit = String(durationUnit);

      if (unit === "1") {
        calcMaturityDate = addDays(new Date(renewalDate), durationNum);
      } else if (unit === "2") {
        calcMaturityDate = addMonths(new Date(renewalDate), durationNum);
      } else if (unit === "3") {
        calcMaturityDate = addYears(new Date(renewalDate), durationNum);
      }

      if (calcMaturityDate) {
        const currentNewMaturityDate = form.getValues("newMaturityDate");
        if (
          !currentNewMaturityDate ||
          new Date(calcMaturityDate).getTime() !== new Date(currentNewMaturityDate).getTime()
        ) {
          form.setValue("newMaturityDate", calcMaturityDate, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      }
    }
  }, [duration, durationUnit, renewalDate, form]);

  const handleSubmit = async (values) => {
    postDepositRenewalAccountApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    getAccountDetailsByAccountNoApiCall(values);
    form.setValue("renewalDate", values.date);
    if (values.productId) {
      form.setValue("productId", values.productId);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postDepositRenewalAccountApiCall = async (item) => {
    setPostRenewalLoading(true);

    let data = {
      trans_date: format(item.renewalDate, "yyyy-MM-dd"),
      account_id: depositProduct.Acct_Id,
      member_id: depositProduct.Mem_Id,
      principal_amt: item.depositAmount,
      intt_amt: Number(item.maturityAmount) - Number(item.depositAmount),
      pay_amt: item.renewalType === "principal" ? item.payoutAmount : "0",
      roi: item.newRateOfInterest,
      matur_val: item.newMaturityAmount,
      duration: item.duration,
      dur_unit: item.durationUnit,
      mature_date: format(item.newMaturityDate, "yyyy-MM-dd"),
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      sb_id: item.transMode === "savings" ? item.savings : null,
      bank_id: item.transMode === "bank" ? item.bank : null,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    // console.log(data);

    try {
      const res = await postDepositRenewalAccountAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setResetTrigger((prev) => prev + 1);
      } else {
        toast.error(res.details || res.message);
        setSuccessMessage(null);
        setVisibleBlock(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
      setVisibleBlock(true);
    } finally {
      setPostRenewalLoading(false);
    }
  };

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    setGetRenewalLoading(true);

    try {
      const res = await getDepositMatureAccountAPI(
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        orgId,
        item.productId,
      );
      if (res.message === "Data Found") {
        if (format(item.date, "yyyy-MM-dd") >= res.details[0].Maturity_Date) {
          form.setValue("memberNo", res.details[0].Member_No || "");
          form.setValue("cifNo", res.details[0].CIF_No || "");
          form.setValue("refAcNo", res.details[0].Ref_Ac_No || "");
          form.setValue("memberName", res.details[0].Full_Name || "");
          form.setValue("gurdianName", res.details[0].Relation_Name || "");
          form.setValue("mobile", res.details[0].Mem_Mob || "");
          form.setValue("panNo", res.details[0].Mem_Pan || "");
          form.setValue("rateOfInterest", res.details[0].ROI || "");
          form.setValue(
            "maturityDate",
            res.details[0].Maturity_Date
              ? new Date(res.details[0].Maturity_Date)
              : "",
          );
          form.setValue("maturityAmount", res.details[0].Maturity_Amount || "");
          form.setValue("depositAmount", res.details[0].Avail_Bal || "");
          form.setValue("amount", res.details[0].Avail_Bal || "");
          form.setValue("joint1", res.details[0].Joint_1);
          form.setValue("joint2", res.details[0].Joint_2);
          form.setValue(
            "effectDate",
            res.details[0].Maturity_Date
              ? new Date(res.details[0].Maturity_Date)
              : "",
          );
          form.setValue("depositBalance", res.details[0].Maturity_Amount || "");
          setDepositProduct(res.details[0]);
          setVisibleBlock(true);
          getDepositEcsAccountApiCall(orgId, res.details[0].Mem_Id);
        } else {
          toast.error(
            `Maturity date is ${format(
              res.details[0].Maturity_Date,
              "dd-MM-yyyy",
            )}. Can't be process for renew.`,
          );
        }
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("refAcNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("mobile", "");
        form.setValue("panNo", "");
        form.setValue("rateOfInterest", "");
        form.setValue("maturityDate", "");
        form.setValue("maturityAmount", "");
        form.setValue("depositAmount", "");
        form.setValue("amount", "");
        form.setValue("joint1", "");
        form.setValue("joint2", "");
        setDepositProduct(null);
        setVisibleBlock(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("refAcNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("mobile", "");
      form.setValue("panNo", "");
      form.setValue("rateOfInterest", "");
      form.setValue("maturityDate", "");
      form.setValue("maturityAmount", "");
      form.setValue("depositAmount", "");
      form.setValue("amount", "");
      form.setValue("joint1", "");
      form.setValue("joint2", "");
      setDepositProduct(null);
      setVisibleBlock(false);
    } finally {
      setGetRenewalLoading(false);
    }
  };

  const checkDepositDurationApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await checkDepositDurationAPI(
        depositProduct.Prod_Id,
        form.getValues("duration"),
        form.getValues("durationUnit"),
        orgId,
      );
      if (res.message === "Data Found") {
        setCheckDepositDurationDisable(false);
        setCheckDepositDurationMessage("");
        if (form.getValues("renewalDate")) {
          if (form.getValues("durationUnit") === "1")
            form.setValue(
              "newMaturityDate",
              addDays(
                form.getValues("renewalDate"),
                Number(form.getValues("duration")),
              ),
            );
          else if (form.getValues("durationUnit") === "2")
            form.setValue(
              "newMaturityDate",
              addMonths(
                form.getValues("renewalDate"),
                Number(form.getValues("duration")),
              ),
            );
          else if (form.getValues("durationUnit") === "3")
            form.setValue(
              "newMaturityDate",
              addYears(
                form.getValues("renewalDate"),
                Number(form.getValues("duration")),
              ),
            );
        }

        toast.success(res.details);
      } else {
        setCheckDepositDurationDisable(true);
        setCheckDepositDurationMessage(res.details);
        form.setValue("newMaturityDate", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setCheckDepositDurationDisable(true);
      setCheckDepositDurationMessage("");
      form.setValue("newMaturityDate", "");
    } finally {
      setLoading(false);
    }
  };

  const getDepositInterestRateApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getDepositInterestRateAPI(
        depositProduct.Prod_Id,
        form.getValues("duration") || 0,
        form.getValues("durationUnit") || 0,
        format(form.getValues("renewalDate"), "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("newRateOfInterest", res.details);
      } else {
        form.setValue("newRateOfInterest", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("newRateOfInterest", "");
    } finally {
      setLoading(false);
    }
  };

  const getDepositMaturityAmountApiCall = async (orgId) => {
    setLoading(true);

    const postAmount =
      renewalType === "principal"
        ? form.getValues("depositAmount")
        : form.getValues("maturityAmount");

    try {
      const res = await getDepositMaturityAmountAPI(
        depositProduct.Prod_Id,
        form.getValues("duration"),
        form.getValues("durationUnit"),
        postAmount,
        form.getValues("newRateOfInterest"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("newMaturityAmount", res.details);
      } else {
        form.setValue("newMaturityAmount", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("newMaturityAmount", "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (duration && durationUnit && orgId) {
      checkDepositDurationApiCall(orgId);
      getDepositInterestRateApiCall(orgId);
    }
  }, [duration, durationUnit]);

  useEffect(() => {
    if (duration && durationUnit && renewalType && newRateOfInterest && orgId) {
      getDepositMaturityAmountApiCall(orgId);
    }
  }, [duration, durationUnit, renewalType, newRateOfInterest]);

  useEffect(() => {
    if (depositAmount && maturityAmount && renewalType === "principal") {
      form.setValue(
        "payoutAmount",
        Number(maturityAmount) - Number(depositAmount) < 0
          ? 0
          : Number(maturityAmount) - Number(depositAmount),
      );
    } else {
      form.setValue("payoutAmount", 0);
    }
  }, [depositAmount, maturityAmount, renewalType]);

  return {
    loading,
    getRenewalLoading,
    postRenewalLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    checkDepositDurationDisable,
    checkDepositDurationMessage,
    resetTrigger,
  };
};
