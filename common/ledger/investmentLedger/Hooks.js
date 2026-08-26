"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { getInvestmentLedgerAPI } from "@/container/investment/investmentInterest/InvestmentInterestApis";

export const useInvestmentLedger = () => {
  const orgId = getCookieData("orgId");

  const userName = getCookieData("userName");

  const fromDate = useSelector((state) => state.footer.footerData.Start_Date);

  const [loading, setLoading] = useState(false);

  const [showLedger, setShowLedger] = useState(false);

  const [ledgerHeaderData, setLedgerHeaderData] = useState(null);
  const [ledgerTableData, setLedgerTableData] = useState(null);

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    let hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    setCurrentDate(`${day}-${month}-${year}`);
    setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
  }, []);

  const calculateTotal = (field) => {
    return (
      ledgerTableData &&
      ledgerTableData.reduce((total, item) => {
        const value = item[field];
        // Convert value to number, treating null or empty as 0
        const numericValue = value ? parseFloat(value) : 0;
        return total + numericValue;
      }, 0)
    );
  };

  const totalWithdrawn = calculateTotal("Withdrwan");
  const totalDeposit = calculateTotal("Deposit");

  const pendingRequest = useRef(null);

  const formatApiDate = (value, fallback) => {
    const dateValue = value || fallback;
    if (!dateValue) return dateValue;

    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return format(dateValue, "yyyy-MM-dd");
    }

    if (typeof dateValue === "string") {
      if (/^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
        return dateValue.slice(0, 10);
      }
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateValue)) {
        return format(parse(dateValue, "dd-MM-yyyy", new Date()), "yyyy-MM-dd");
      }
      const parsed = new Date(dateValue);
      if (!isNaN(parsed.getTime())) {
        return format(parsed, "yyyy-MM-dd");
      }
    }

    return dateValue;
  };

  const getInvestLedgerApiCall = async (
    account,
    toArgDate,
    fromArgDate = null,
  ) => {
    const postFromDate = formatApiDate(fromArgDate, fromDate);
    const postToDate = formatApiDate(toArgDate);
    const requestKey = `${account}_${postFromDate}_${postToDate}`;

    if (pendingRequest.current?.key === requestKey) {
      return pendingRequest.current.promise;
    }

    setLoading(true);
    const promise = (async () => {
      try {
        const res = await getInvestmentLedgerAPI(
          orgId,
          account,
          postFromDate,
          postToDate,
        );
        if (res.message === "Data Found" && res.details?.[0]?.Result) {
          const result = res.details[0].Result;
          setLedgerHeaderData(result.basic_details?.[0] || null);
          setLedgerTableData(result.transaction_details || null);
        } else {
          setLedgerHeaderData(null);
          setLedgerTableData(null);
        }
        return res;
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        setLedgerHeaderData(null);
        setLedgerTableData(null);
      } finally {
        setLoading(false);
        pendingRequest.current = null;
      }
    })();

    pendingRequest.current = { key: requestKey, promise };
    return promise;
  };

  const getInvestLedgerHeaderApiCall = async (
    account,
    toArgDate,
    fromArgDate = null,
  ) => {
    await getInvestLedgerApiCall(account, toArgDate, fromArgDate);
  };

  const getInvestLedgerDataApiCall = async (
    account,
    toArgDate,
    fromArgDate = null,
  ) => {
    await getInvestLedgerApiCall(account, toArgDate, fromArgDate);
  };

  return {
    loading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn,
    totalDeposit,
    userName,
    currentDate,
    currentTime,
    getInvestLedgerHeaderApiCall,
    getInvestLedgerDataApiCall,
    fromDate,
  };
};
