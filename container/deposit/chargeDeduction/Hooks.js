"use client";

import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  setChargeTypeList,
  setProductList,
  setChargeParam,
  setChargeList,
  clearChargeDeduction,
  clearChargeParam,
  clearChargeList,
} from "./chargeDeductionReducer";
import {
  getOperateProductAPI,
  getTypeAPI,
  getParamAPI,
  getListAPI,
  postLedgerChargeAPI,
} from "./chargeDeductionApi";

import toast from "react-hot-toast";
import { formatDate } from "date-fns";
import { useDepositLedger } from "@/common/ledger/depositLedger/Hooks";

export const useChargeDeduction = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");
  const beg_date = getCookieData("beg_date");

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const {
    loading: getLedgerLoading,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalDeposit: totalLedgerDeposit,
    totalWithdrawn: totalLedgerWithdrawn,
    totalInterest: totalLedgerInterest,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getDepositLedgerHeaderApiCall,
    fromDate: ledgerFromDate,
  } = useDepositLedger();

  const productList = useSelector(
    (state) => state?.chargeDeduction?.productList || [],
  );
  const chargeTypeList = useSelector(
    (state) => state?.chargeDeduction?.chargeTypeList || [],
  );
  const chargeParam = useSelector(
    (state) => state?.chargeDeduction?.chargeParam || {},
  );
  const chargeList = useSelector(
    (state) => state?.chargeDeduction?.chargeList || [],
  );

  const formSchema = yup.object({
    productType: yup.string().required("Product type is required"),
    chargeType: yup.string().required("Charge type is required"),
    date: yup.string().required("Date is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productType: "",
      chargeType: "",
      date: beg_date,
    },
  });

  useEffect(() => {
    return () => {
      dispatch(clearChargeDeduction());
      dispatch(clearChargeParam());
      dispatch(clearChargeList());
      form.reset({
        productType: "",
        chargeType: "",
        date: beg_date,
      });
    };
  }, [dispatch]);

  const productType = form.watch("productType");
  const chargeType = form.watch("chargeType");

  useEffect(() => {
    dispatch(clearChargeList());
  }, [productType, chargeType, dispatch]);

  const getOperateProductAPICall = async (orgId, screen) => {
    try {
      const res = await getOperateProductAPI(orgId, screen);

      if (res.message === "Data Found") {
        dispatch(setProductList(res.details || []));
      }
    } catch (error) {
      dispatch(setProductList([]));
      console.log(error, "error");
    }
  };

  const getTypeAPICall = async (orgId) => {
    try {
      const res = await getTypeAPI(orgId);

      if (res.message === "Data Found") {
        dispatch(setChargeTypeList(res.details || []));
      }
    } catch (error) {
      dispatch(setChargeTypeList([]));
      console.log(error, "error");
    }
  };

  const getParamAPICall = async (charge_id, prod_id) => {
    try {
      const res = await getParamAPI(orgId, charge_id, prod_id);

      if (res.message === "Data Found") {
        dispatch(setChargeParam(res.details[0] || {}));
      } else if (res.message === "No Data Found") {
        dispatch(setChargeParam({}));
        toast.error("No parmeter set for this charge Deduction");
      }
    } catch (error) {
      dispatch(setChargeParam({}));
      console.log(error, "error");
    }
  };

  const getListAPICall = async (
    charge_id,
    prod_id,
    date,
    branch_id,
    org_id,
  ) => {
    setLoading(true);
    setProgress(0);
    dispatch(setChargeList([]));

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
      const res = await getListAPI(charge_id, prod_id, date, branch_id, org_id);

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);

      if (res.message === "Data Found") {
        dispatch(setChargeList(res.details || []));
      } else {
        toast.error("No Account Found");
      }
    } catch (error) {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
      dispatch(setChargeList([]));
      console.log(error, "error");
    }
  };

  const handlePostCharges = async (postData) => {
    const finId = getCookieData("finId");

    const int_data = (postData.chargeList || []).map((row) => ({
      acct_id: row.Id,
      charge_amt: row.Charge_Amt,
    }));

    const formValues = form.getValues();

    const payload = {
      trans_date: postData.voucherDate
        ? formatDate(new Date(postData.voucherDate), "yyyy-MM-dd")
        : "",
      prd_id: formValues.productType,
      charge_id: formValues.chargeType,
      amount: postData.totalAmount,
      int_data: int_data,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
      ref_vouch: postData.referenceVoucherNo,
    };

    console.log("Post Charges Payload:", payload);
    setLoading(true);
    try {
      const res = await postLedgerChargeAPI(payload);
      console.log("postLedgerAPI response:", res);
      if (res.message === "Success" || res.status === 200) {
        toast.success(res.details || "Charges posted successfully!");
        dispatch(clearChargeParam());
        dispatch(clearChargeList());
        form.reset({
          productType: "",
          chargeType: "",
          date: beg_date,
        });
      } else if (res.message === "Error Found") {
        toast.error(res.details || "Failed to post charges.");
      }
    } catch (err) {
      console.error("Error posting charges:", err);
      toast.error(err.message || "Failed to post charges.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
    getListAPICall(
      values.chargeType,
      values.productType,
      values.date,
      branchId,
      orgId,
    );
  };

  return {
    orgId,
    form,
    handleSubmit,
    productList,
    getOperateProductAPICall,
    chargeTypeList,
    getTypeAPICall,
    getParamAPICall,
    chargeParam,
    getListAPICall,
    chargeList,
    loading,
    progress,
    handlePostCharges,
    // Ledger fields
    getLedgerLoading,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerDeposit,
    totalLedgerWithdrawn,
    totalLedgerInterest,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    getDepositLedgerHeaderApiCall,
    ledgerFromDate,
  };
};
