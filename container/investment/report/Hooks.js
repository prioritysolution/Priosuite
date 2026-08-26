"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getReportTypeData } from "@/container/membership/report/MemberReportReducer";
import {
  getInvestmentReportDataAPI,
  getInvestmentReportTypeAPI,
} from "./InvestmentRepostApis";
import { useInvestmentLedger } from "@/common/ledger/investmentLedger/Hooks";

export const useInvestmentReport = () => {
  const dispatch = useDispatch();

  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [showData, setShowData] = useState("");

  const {
    loading: getLedgerLoading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn: totalLedgerWithdrawn,
    totalDeposit: totalLedgerDeposit,
    userName: ledgerUserName,
    currentDate: currentLedgerDate,
    currentTime: currentLedgerTime,
    getInvestLedgerHeaderApiCall,
  } = useInvestmentLedger();

  const formSchema = yup.object({
    fromDate: yup.date().required("From date is required"),
    toDate: yup.date().required("To date is required"),
    reportType: yup.string().required("Report type is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fromDate: null,
      toDate: null,
      reportType: "",
      branch: branchId,
    },
  });

  const handleSubmit = (values) => {
    getInvestmentReportDataApiCall(values);
    setShowData(values.reportType);
    setFromDate(format(values.fromDate, "yyyy-MM-dd"));
    setToDate(values.toDate);
  };

  const handleShowLedger = (id) => {
    if (id) {
      getInvestLedgerHeaderApiCall(id, toDate, fromDate);
      setShowLedger(true);
    } else {
      toast.error("Select member and date first");
    }
  };

  const getInvestmentReportDataApiCall = async (item) => {
    setLoading(true);

    const postFromDate = item.fromDate && format(item.fromDate, "yyyy-MM-dd");
    const postToDate = item.toDate && format(item.toDate, "yyyy-MM-dd");

    try {
      const res = await getInvestmentReportDataAPI(
        item.reportType,
        orgId,
        item.branch,
        postFromDate,
        postToDate
      );

      if (res.message === "Data Found") {
        let grandTotalInvest = 0; // Use let
        let grandTotalProvIntt = 0; // Use let

        const groupedData = res.details.reduce((acc, current) => {
          const groupIndex = acc.findIndex(
            (group) => group.prnGl === current.Prn_Gl
          );

          // Parse numeric values for accurate calculations
          const invest = parseFloat(current.Invest_Amt) || 0;
          const provIntt = parseFloat(current.Prov_Intt) || 0;

          if (groupIndex !== -1) {
            // Add to existing group
            const group = acc[groupIndex];
            group.transactions.push(current);
            group.subtotalInvest += invest;
            group.subtotalProvIntt += provIntt;
          } else {
            // Create a new group
            acc.push({
              prnGl: current.Prn_Gl,
              transactions: [current],
              subtotalInvest: invest,
              subtotalProvIntt: provIntt,
            });
          }

          // Update grand totals
          grandTotalInvest += invest;
          grandTotalProvIntt += provIntt;

          return acc;
        }, []);

        groupedData.push({
          isGrandTotal: true,
          grandTotalInvest,
          grandTotalProvIntt,
        });

        // Set tableData for rendering
        setTableData(groupedData);
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

  const getInvestmentReportTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getInvestmentReportTypeAPI();
      console.log(res);
      if (res.message === "Data Found") {
        dispatch(getReportTypeData(res.details));
      } else {
        dispatch(getReportTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getReportTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    tableData,
    toDate,
    getInvestmentReportTypeApiCall,
    showData,
    handleShowLedger,
    showLedger,
    setShowLedger,
    getLedgerLoading,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerWithdrawn,
    totalLedgerDeposit,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    fromDate,
  };
};
