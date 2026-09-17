"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { postBankTransferAPI } from "./TransferApis";
import { getBankBalanceAPI } from "../bankDeposit/BankDepositApis";
import { useBankLedger } from "@/common/ledger/bankLedger/Hooks";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import { useSelector } from "react-redux";
import { formatDateForApi } from "@/utils/dateHelpers";
import convertToWords from "@/utils/numberToWords";

const parseFlexDate = (dStr) => {
  if (!dStr) return new Date();
  if (dStr instanceof Date) return dStr;
  const parts = dStr.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2].split("T")[0], 10),
      );
    }
    if (parts[2].split("T")[0].length === 4) {
      return new Date(
        parseInt(parts[2].split("T")[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[0], 10),
      );
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? new Date() : d;
};

export const useBankTransfer = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const {
    loading: getBankLoading,
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
  } = useBankLedger();

  const [loading, setLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sendersAvailableBalance, setSendersAvailableBalance] = useState(null);

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    transferDate: yup.date().required("Transfer date is required"),
    senderBankAccount: yup
      .string()
      .required("Sender's bank account is required"),
    receiverBankAccount: yup
      .string()
      .required("Receiver's bank account is required"),
    transferAmount: yup
      .string()
      .required("Transfer amount is required") // Required validation
      .test(
        "is-valid-number",
        "Transfer amount must be a valid number with up to 2 decimal places",
        (value) => {
          if (!value) return false; // Required validation already handles null/empty
          return maxTwoDecimalPlaces.test(value); // Validate format with regex
        },
      )
      .test(
        "is-greater-than-zero",
        "Transfer amount must be greater than 0",
        (value) => {
          if (!value) return false; // Required validation already handles null/empty
          const numberValue = parseFloat(value);
          return numberValue > 0; // Ensure value is greater than 0
        },
      )
      .test(
        "is-less-than-or-equal-to-balance",
        "Transfer amount must be less than or equal to senders available balance",
        function (value) {
          if (!value) return false; // Required validation already handles null/empty
          if (!senderBankAccount) return false; // Ensure availableBalance is defined
          const withdrawn = parseFloat(value);
          const balance = parseFloat(sendersAvailableBalance);
          return withdrawn <= balance; // Validate that withdrawn amount is <= available balance
        },
      ),
    totalTransferInWords: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      transferDate: beg_date ? parseFlexDate(beg_date) : new Date(),
      senderBankAccount: "",
      receiverBankAccount: "",
      transferAmount: "",
    },
  });

  const { control } = form;
  const { transferDate, senderBankAccount, transferAmount } = useWatch({
    control,
  });

  const handleSubmit = async (values) => {
    postBankTransferApiCall(values);
  };

  const handleShowLedger = () => {
    if (senderBankAccount && transferDate) {
      getBankLedgerHeaderApiCall(senderBankAccount, transferDate);
      getBankLedgerDataApiCall(senderBankAccount, transferDate);
      setShowLedger(true);
    } else {
      toast.error("Select senders bank account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postBankTransferApiCall = async (item) => {
    let data = {
      trans_date: item.transferDate
        ? formatDateForApi(item.transferDate)
        : null,
      Account_Id: item.senderBankAccount,
      Amount: item.transferAmount,
      to_account_id: item.receiverBankAccount,
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postBankTransferAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setSendersAvailableBalance(null);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getBankBalanceApiCall = async (orgId) => {
    setLoading(true);

    try {
      const res = await getBankBalanceAPI(
        orgId,
        form.getValues("senderBankAccount"),
        formatDateForApi(form.getValues("transferDate")),
      );
      if (res.message === "Data Found") {
        setSendersAvailableBalance(parseFloat(res.details).toFixed(2));
      } else {
        setSendersAvailableBalance(0);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setSendersAvailableBalance(0);
    } finally {
      setLoading(false);
    }
  };

  const prevSenderBankAccount = useRef();
  const prevTransferDate = useRef();

  useEffect(() => {
    const currentSenderBankAccount = form.getValues("senderBankAccount");
    const currentTransferDate = form.getValues("transferDate");

    if (
      currentSenderBankAccount &&
      currentTransferDate &&
      (currentSenderBankAccount !== prevSenderBankAccount.current ||
        currentTransferDate !== prevTransferDate.current)
    ) {
      getBankBalanceApiCall(orgId);
    }

    prevSenderBankAccount.current = currentSenderBankAccount;
    prevTransferDate.current = currentTransferDate;
  }, [senderBankAccount, transferDate]);

  useEffect(() => {
    if (transferAmount)
      form.setValue(
        "totalTransferInWords",
        "Rupees " + convertToWords(transferAmount) + " Only" || "",
      );
    else form.setValue("totalTransferInWords", "");
  }, [transferAmount]);

  return {
    loading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    sendersAvailableBalance,
    handleShowLedger,
    showLedger,
    setShowLedger,
    ledgerHeaderData,
    ledgerTableData,
    totalWithdrawn,
    totalDeposit,
    userName,
    currentDate,
    currentTime,
    fromDate,
    getBankLoading,
  };
};
