"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format, parse } from "date-fns";
import { getBankLedgerAPI } from "@/container/banking/bankDeposit/BankDepositApis";

export const useBankLedger = () => {
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

  const activeRequestRef = useRef(null);

  const getBankLedgerData = async (account, date) => {
    const inputFormat = "dd-MM-yyyy"; // Format of the input string

    // Parse the date string
    const parsedToDate =
      date && typeof date === "string"
        ? parse(date, inputFormat, new Date())
        : date;
    const formattedDate = format(parsedToDate, "yyyy-MM-dd");

    const cacheKey = `${account}_${formattedDate}_${fromDate}`;

    if (activeRequestRef.current && activeRequestRef.current.key === cacheKey) {
      return activeRequestRef.current.promise;
    }

    setLoading(true);
    const promise = (async () => {
      try {
        const res = await getBankLedgerAPI(
          orgId,
          account,
          fromDate,
          formattedDate
        );
        if (res.message === "Data Found" && res.details?.[0]) {
          const detail = res.details[0];
          setLedgerHeaderData(detail.Result?.basic_details?.[0] || null);
          setLedgerTableData(detail.Result?.transaction_details || null);
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
        activeRequestRef.current = null;
      }
    })();

    activeRequestRef.current = {
      key: cacheKey,
      promise,
    };

    return promise;
  };

  const getBankLedgerHeaderApiCall = async (account, date) => {
    await getBankLedgerData(account, date);
  };

  const getBankLedgerDataApiCall = async (account, date) => {
    await getBankLedgerData(account, date);
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
    getBankLedgerHeaderApiCall,
    getBankLedgerDataApiCall,
    fromDate,
  };
};
