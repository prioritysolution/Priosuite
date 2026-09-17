"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { getBorrowingsLedgerAPI } from "@/container/borrowings/transaction/TansactionApis";

export const useBorrowingsLedger = () => {
  const orgId = getCookieData("orgId");

  const userName = getCookieData("userName");

  const [fromDate, setFromDate] = useState(
    useSelector((state) => state.footer.footerData.Start_Date)
  );
  const [toDate, setToDate] = useState(
    useSelector((state) => state.footer.footerData.End_Date)
  );

  const tempFromDate = useSelector(
    (state) => state.footer.footerData.Start_Date
  );
  const tempToDate = useSelector((state) => state.footer.footerData.End_Date);
  useEffect(() => {
    if (window !== undefined) {
      setToDate(tempToDate);
      setFromDate(tempFromDate);
    }
  }, [tempFromDate, tempToDate]);

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

  const totalDisburse = calculateTotal("Disburse");
  const totalPrincipalRefund = calculateTotal("Prn_Refund");
  const totalInterestRefund = calculateTotal("Intt_Refund");

  const pendingRequest = useRef(null);

  const getBorrowingsLedgerApiCall = async (
    account,
    toArgDate = null,
    fromArgDate = null
  ) => {
    const inputFormat = "dd-MM-yyyy";
    const parsedToDate =
      toArgDate && typeof toArgDate === "string"
        ? (toArgDate.includes("-") && toArgDate.split("-")[0].length === 2 ? parse(toArgDate, inputFormat, new Date()) : new Date(toArgDate))
        : toArgDate;

    const parsedFromDate =
      fromArgDate && typeof fromArgDate === "string"
        ? (fromArgDate.includes("-") && fromArgDate.split("-")[0].length === 2 ? parse(fromArgDate, inputFormat, new Date()) : new Date(fromArgDate))
        : fromArgDate;

    const postFromDate = parsedFromDate
      ? format(parsedFromDate, "yyyy-MM-dd")
      : (fromDate instanceof Date ? format(fromDate, "yyyy-MM-dd") : fromDate);

    const postToDate = parsedToDate
      ? format(parsedToDate, "yyyy-MM-dd")
      : (toDate instanceof Date ? format(toDate, "yyyy-MM-dd") : toDate);

    if (fromArgDate && parsedFromDate) setFromDate(parsedFromDate);
    if (toArgDate && parsedToDate) setToDate(parsedToDate);

    const cacheKey = `${account}_${postFromDate}_${postToDate}`;

    if (pendingRequest.current && pendingRequest.current.key === cacheKey) {
      return pendingRequest.current.promise;
    }

    setLoading(true);
    const promise = (async () => {
      try {
        const res = await getBorrowingsLedgerAPI(
          orgId,
          account,
          postFromDate,
          postToDate,
          2
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
        throw error;
      } finally {
        setLoading(false);
        pendingRequest.current = null;
      }
    })();

    pendingRequest.current = {
      key: cacheKey,
      promise,
    };

    return promise;
  };

  const getBorrowingsLedgerHeaderApiCall = async (
    account,
    toArgDate = null,
    fromArgDate = null
  ) => {
    await getBorrowingsLedgerApiCall(account, toArgDate, fromArgDate);
  };

  const getBorrowingsLedgerDataApiCall = async (
    account,
    toArgDate = null,
    fromArgDate = null
  ) => {
    await getBorrowingsLedgerApiCall(account, toArgDate, fromArgDate);
  };

  return {
    loading,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName,
    currentDate,
    currentTime,
    getBorrowingsLedgerHeaderApiCall,
    getBorrowingsLedgerDataApiCall,
    fromDate,
    toDate,
  };
};
