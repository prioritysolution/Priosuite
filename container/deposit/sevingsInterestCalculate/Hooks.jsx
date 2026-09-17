"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import getCookieData from "@/utils/getCookieData";
import {
  getOperateProductAPI,
  checkParamAPI,
  runProcessAPI,
  postLedgerAPI,
} from "./sevingsInterestCalculateApi";
import {
  setProductList,
  setInterestDetails,
  clearSavingsInterestCalculate,
} from "./sevingsInterestCalculateReducer";
import { formatDate } from "date-fns";
import toast from "react-hot-toast";

export const usesevingsInterestCalculate = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSavingsInterestCalculate());
    };
  }, [dispatch]);

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [isFromDateDisabled, setIsFromDateDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const productList = useSelector(
    (state) => state?.sevingsInterestCalculate?.productList || [],
  );

  const interestDetails = useSelector(
    (state) => state?.sevingsInterestCalculate?.interestDetails || [],
  );

  const formSchema = yup.object({
    fromDate: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("From date is required"),
    toDate: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("To date is required")
      .test(
        "is-greater",
        "To date must be greater than From date",
        function (value) {
          const { fromDate } = this.parent;
          if (!value || !fromDate) return true;
          return new Date(value) > new Date(fromDate);
        },
      ),
    productType: yup.string().required("Product type is required"),
    roi: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      productType: "",
      roi: "",
    },
  });

  const fromDate = form.watch("fromDate");
  const toDate = form.watch("toDate");
  const productType = form.watch("productType");

  useEffect(() => {
    dispatch(setInterestDetails([]));
  }, [fromDate, toDate, productType, dispatch]);

  const checkParamAPICall = async (orgId, prod_id) => {
    try {
      const res = await checkParamAPI(orgId, prod_id);
      console.log("checkParamAPI res.details", res.details);
      if (res.message === "Data Found") {
        const lastDateStr = res.details?.[0]?.Last_Date;
        if (lastDateStr) {
          const parts = lastDateStr.split("-");
          if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            form.setValue("fromDate", new Date(year, month, day));
          } else {
            form.setValue("fromDate", new Date(lastDateStr));
          }
        } else {
          form.setValue("fromDate", null);
        }
        setIsFromDateDisabled(true);
      } else {
        setIsFromDateDisabled(false);
      }
    } catch (error) {
      console.log(error, "error");
      setIsFromDateDisabled(false);
    }
  };

  const getOperateProductAPICall = async (orgId, screen) => {
    try {
      const res = await getOperateProductAPI(orgId, screen);
      console.log("res.details=", res.details);
      if (res.message === "Data Found") {
        dispatch(setProductList(res.details || []));
      }
    } catch (error) {
      dispatch(setProductList([]));
      console.log(error, "error");
    }
  };

  const handleSubmit = async (values) => {
    console.log(values, " handleSubmit values");
    setLoading(true);
    setProgress(0);
    dispatch(setInterestDetails([]));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 150);

    try {
      const res = await runProcessAPI(
        orgId,
        values.productType,
        values.fromDate ? formatDate(values.fromDate, "yyyy-MM-dd") : "",
        values.toDate ? formatDate(values.toDate, "yyyy-MM-dd") : "",
        branchId,
      );
      console.log("runProcessAPI=", res);

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);

      if (res.message === "Data Found") {
        dispatch(setInterestDetails(res.details || []));
      }
    } catch (error) {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
      console.log("Error in handleSubmit:", error);
    }
  };

  const handlePostInterest = async (postData) => {
    const finId = getCookieData("finId");

    const int_data = (postData.interestDetails || []).map((row) => ({
      acct_id: row.Id,
      int_amt: row.interest_amount,
    }));

    const formValues = form.getValues();

    const payload = {
      trans_date: postData.voucherDate
        ? formatDate(new Date(postData.voucherDate), "yyyy-MM-dd")
        : "",
      frm_date: formValues.fromDate
        ? formatDate(new Date(formValues.fromDate), "yyyy-MM-dd")
        : "",
      to_date: formValues.toDate
        ? formatDate(new Date(formValues.toDate), "yyyy-MM-dd")
        : "",
      prd_id: parseInt(formValues.productType, 10) || formValues.productType,
      amount: parseFloat(postData.totalAmount) || 0,
      roi: parseFloat(formValues.roi) || 0,
      // int_data: JSON.stringify(int_data),
      int_data: int_data,
      fin_id: parseInt(finId, 10) || finId,
      branch_id: parseInt(branchId, 10) || branchId,
      org_id: parseInt(orgId, 10) || orgId,
      ref_no: postData.referenceVoucherNo,
    };

    console.log("PostLedger Payload:", payload);
    setLoading(true);
    try {
      const res = await postLedgerAPI(payload);
      console.log("postLedgerAPI response:", res);
      if (res.message === "Success" || res.status === 200) {
        // Success logic: e.g. clear interestDetails
        toast.success(res.details);
        dispatch(setInterestDetails([]));
      }
    } catch (err) {
      console.error("Error posting ledger:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    orgId,
    form,
    handleSubmit,
    productList,
    interestDetails,
    getOperateProductAPICall,
    checkParamAPICall,
    isFromDateDisabled,
    loading,
    progress,
    handlePostInterest,
  };
};
