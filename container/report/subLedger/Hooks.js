"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getSubLedgerReportAPI } from "./SubLedgerReportApis";
import { getReportVoucherDetailsAPI } from "../daybook/DaybookApis";
import { getVoucherDetailsData } from "../daybook/DaybookReducer";
import { useEffect } from "react";

export const useSubLedgerReport = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [subLedger, setSubLedger] = useState(null);

  const [showVoucherDetails, setShowVoucherDetails] = useState(false);

  const [totalDrAmount, setTotalDrAmount] = useState(0);
  const [totalCrAmount, setTotalCrAmount] = useState(0);

  const [subLedgerTableData, setSubLedgerTableData] = useState([]);

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    branch: yup.string().required("Branch is required"),
    subLedger: yup.string().required("Sub ledger is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      formDate: null,
      toDate: null,
      branch: branchId,
      subLedger: "",
    },
  });

  const { control } = form;

  const { branch } = useWatch({ control });

  const handleSubmit = (values) => {
    getSubLedgerReportApiCall(values);
    setFromDate(format(values.fromDate, "dd-MM-yyyy"));
    setToDate(format(values.toDate, "dd-MM-yyyy"));
    setSubLedger(values.subLedger);
  };

  const handleShowVoucherDetails = (txnId) => {
    if (orgId && txnId) {
      getReportVoucherDetailsApiCall(orgId, txnId);
      setShowVoucherDetails(true);
    }
  };

  const calculateTotal = (data, field) => {
    return (
      data &&
      data.reduce((total, item) => {
        const value = item[field];
        // Convert value to number, treating null or empty as 0
        const numericValue = value ? parseFloat(value) : 0;
        return total + numericValue;
      }, 0)
    );
  };

  const totalDebit = calculateTotal(subLedgerTableData, "Debit");
  const totalCredit = calculateTotal(subLedgerTableData, "Credit");

  const getSubLedgerReportApiCall = async (item) => {
    setLoading(true);

    const fromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const toDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getSubLedgerReportAPI(
        orgId,
        item.subLedger,
        fromDate,
        toDate,
      );
      console.log(res);
      if (res.message === "Data Found") {
        setSubLedgerTableData(res?.details[0]?.transaction_data);
      } else {
        setSubLedgerTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setSubLedgerTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const getReportVoucherDetailsApiCall = async (orgId, txnId) => {
    setLoading(true);

    try {
      const res = await getReportVoucherDetailsAPI(orgId, txnId);

      if (res.message === "Data Found") {
        dispatch(getVoucherDetailsData(res.details));

        let newTotalDrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "D"),
          "Amount",
        );
        let newTotalCrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "C"),
          "Amount",
        );

        setTotalDrAmount(newTotalDrAmount);
        setTotalCrAmount(newTotalCrAmount);
      } else {
        dispatch(getVoucherDetailsData([]));
        setTotalDrAmount(0);
        setTotalCrAmount(0);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getVoucherDetailsData([]));
      setTotalDrAmount(0);
      setTotalCrAmount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (branchId) form.setValue("branch", branchId);
  }, [branchId]);

  return {
    loading,
    form,
    handleSubmit,
    subLedgerTableData,
    fromDate,
    toDate,
    subLedger,
    totalDebit,
    totalCredit,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    branch,
  };
};
