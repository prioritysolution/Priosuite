"use client";

import { useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getAccountStatementAPI } from "./AccountStatementApis";
import { useRepayment } from "../repayment/Hooks";
import { useEffect } from "react";
import { getLoanAccountSearchData } from "../repayment/RepaymentReducer";
import { useDispatch } from "react-redux";

export const useAccountStatement = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [dialougeOpen, setDialougeOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("memberNo");

  const {
    getLoanAccountLoading,
    getLoanAccountListApiCall,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
  } = useRepayment();

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    accountNo: yup.string().required("Account no. is required"),
    dialougeMemberNo: yup.string(),
    dialougeMemberName: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      accountNo: "",
      dialougeMemberNo: "",
      dialougeMemberName: "",
    },
  });

  const handleSubmit = (values) => {
    getAccountStatementApiCall(values);
    setFromDate(values.fromDate);
    setToDate(values.toDate);
  };

  const handleSearchAccountListByMemberNo = () => {
    if (form.getValues("dialougeMemberNo")) {
      getLoanAccountListApiCall(2, form.getValues("dialougeMemberNo"), 1);
      setCurrentAccountPage(1);
    } else toast.error("Please enter member no.");
  };

  const handleSearchAccountListByName = () => {
    if (form.getValues("dialougeMemberName")) {
      getLoanAccountListApiCall(1, form.getValues("dialougeMemberName"), 1);
      setCurrentAccountPage(1);
    } else toast.error("Please enter name");
  };

  const handleSelectClick = (data) => {
    form.setValue("accountNo", data.Account_No);
    setDialougeOpen(false);
  };

  const getAccountStatementApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getAccountStatementAPI(
        orgId,
        item.accountNo,
        postFromDate,
        postToDate,
      );

      if (res.message === "Data Found") {
        // Safeguard against undefined or unexpected res.details
        const transactions = Array.isArray(res.details?.Trans_Data)
          ? res.details?.Trans_Data
          : [];

        const groupedData = transactions.reduce(
          (acc, current) => {
            const disburse = parseFloat(current.Disb_Amt) || 0;
            const dueIntt = parseFloat(current.Due_Intt) || 0;
            const curPrn = parseFloat(current.Cur_Prn) || 0;
            const currIntt = parseFloat(current.Curr_Intt) || 0;
            const odPrn = parseFloat(current.Od_Prn) || 0;
            const odIntt = parseFloat(current.Od_Intt) || 0;
            const currOuts = parseFloat(current.Curr_Outs) || 0;
            const odOuts = parseFloat(current.Od_Outs) || 0;

            // Collect each row in transactions
            acc.transactions.push(current);

            // Update totals
            acc.grandTotalDisburse += disburse;
            acc.grandTotalDueIntt += dueIntt;
            acc.grandTotalCurrPrn += curPrn;
            acc.grandTotalCurrIntt += currIntt;
            acc.grandTotalOdPrn += odPrn;
            acc.grandTotalOdIntt += odIntt;
            acc.grandTotalCurrOuts += currOuts;
            acc.grandTotalOdOuts += odOuts;

            return acc;
          },
          {
            transactions: [],
            grandTotalDisburse: 0,
            grandTotalDueIntt: 0,
            grandTotalCurrPrn: 0,
            grandTotalCurrIntt: 0,
            grandTotalOdPrn: 0,
            grandTotalOdIntt: 0,
            grandTotalCurrOuts: 0,
            grandTotalOdOuts: 0,
          },
        );

        // Construct final object with separate totals object
        const finalData = {
          basicData: res?.details?.Basic_Data[0],
          transactions: groupedData.transactions,
          grandTotal: {
            disburse: groupedData.grandTotalDisburse,
            dueIntt: groupedData.grandTotalDueIntt,
            currPrn: groupedData.grandTotalCurrPrn,
            currIntt: groupedData.grandTotalCurrIntt,
            odPrn: groupedData.grandTotalOdPrn,
            odIntt: groupedData.grandTotalOdIntt,
            currOuts: groupedData.grandTotalCurrOuts,
            odOuts: groupedData.grandTotalOdOuts,
          },
        };

        setTableData(finalData);
        console.log(finalData);
      } else {
        setTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setValue("dialougeMemberName", "");
    form.setValue("dialougeMemberNo", "");
    dispatch(getLoanAccountSearchData([]));
    setCurrentAccountPage(1);
  }, [dialougeOpen]);

  useEffect(() => {
    if (
      form.getValues("dialougeMemberNo") ||
      form.getValues("dialougeMemberName")
    ) {
      const value =
        activeTab === "memberNo"
          ? form.getValues("dialougeMemberNo")
          : form.getValues("dialougeMemberName");
      const type = activeTab === "memberNo" ? 2 : 1;
      getLoanAccountListApiCall(type, value, currentAccountPage);
    }
  }, [currentAccountPage]);

  return {
    loading,
    form,
    handleSubmit,
    tableData,
    fromDate,
    toDate,
    dialougeOpen,
    setDialougeOpen,
    activeTab,
    setActiveTab,
    getLoanAccountLoading,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
    handleSearchAccountListByMemberNo,
    handleSearchAccountListByName,
    handleSelectClick,
  };
};
