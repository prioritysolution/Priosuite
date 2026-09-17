"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { getLoanLedgerAPI } from "@/container/loan/repayment/RepaymentApis";

export const useLoanLedger = () => {
  const orgId = getCookieData("orgId");

  const userName = getCookieData("userName");

  const [fromDate, setFromDate] = useState(
    getCookieData("fin_start_date"),
  );
  const [toDate, setToDate] = useState(
    useSelector((state) => state.footer.footerData.End_Date),
  );

  const tempFromDate = useSelector(
    (state) => state.footer.footerData.Start_Date,
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

  const totalDisburse = calculateTotal("Disb_Amt");
  const totalPrincipalRefund = calculateTotal("Prn_Ref");
  const totalInterestRefund = calculateTotal("Intt_Ref");

  const pendingRequest = useRef(null);

  const getLoanLedgerApiCall = async (
    account,
    toArgDate = null,
    fromArgDate = null,
  ) => {
    const postFromDate = fromArgDate
      ? format(fromArgDate, "yyyy-MM-dd")
      : fromDate;
    const postToDate = toArgDate ? format(toArgDate, "yyyy-MM-dd") : toDate;

    const requestKey = `${account}_${postFromDate}_${postToDate}`;
    if (pendingRequest.current === requestKey) {
      return;
    }
    pendingRequest.current = requestKey;
    setLoading(true);

    if (fromArgDate) setFromDate(fromArgDate);
    if (toArgDate) setToDate(toArgDate);

    try {
      const res = await getLoanLedgerAPI(
        orgId,
        account,
        postFromDate,
        postToDate,
      );
      if (res.message === "Data Found" && res.details && res.details[0]) {
        setLedgerHeaderData(res.details[0].Result?.basic_details?.[0] || null);
        setLedgerTableData(res.details[0].Result?.transaction_details || null);
      } else {
        setLedgerHeaderData(null);
        setLedgerTableData(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
      pendingRequest.current = null;
    }
  };

  const getLoanLedgerHeaderApiCall = async (
    account,
    toArgDate = null,
    fromArgDate = null,
  ) => {
    await getLoanLedgerApiCall(account, toArgDate, fromArgDate);
  };

  const getLoanLedgerDataApiCall = async (
    account,
    toArgDate = null,
    fromArgDate = null,
  ) => {
    await getLoanLedgerApiCall(account, toArgDate, fromArgDate);
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
    getLoanLedgerHeaderApiCall,
    getLoanLedgerDataApiCall,
    fromDate,
    toDate,
  };
};
