"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { getBankBalanceAPI } from "../bankDeposit/BankDepositApis";
import { postBankWithdrawnAPI } from "./BankWithdrawnApis";
import { useBankLedger } from "@/common/ledger/bankLedger/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
} from "@/utils/validationRegex";
import { format } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import { getVoucherSubLedgerBalanceAPI } from "@/container/voucher/voucherEntry/VoucherEntryApis";
import convertToWords from "@/utils/numberToWords";
import { getSubLedgerListData } from "@/container/voucher/voucherEntry/VoucherEntryReducer";

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

export const useBankWithdrawn = () => {
  const dispatch = useDispatch();

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

  const [subLedgerInput, setSubLedgerInput] = useState("");

  const [transferTableData, setTransferTableData] = useState([]);

  // denominators
  const [denominators, setDenominators] = useState([]);

  // cash Transaction Total
  const [cashTransactionTotal, setCashTransactionTotal] = useState([]);

  const [cashTransactionGrandTotal, setCashTransactionGrandTotal] = useState(0);

  const [cashDenomArray, setCashDenomArray] = useState([]);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const subLedgerListData = useSelector(
    (state) => state?.voucherEntry?.subLedgerList,
  );

  const formSchema = yup.object({
    bankAccount: yup.string().required("Bank account is required"),
    withdrawnDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      ),
    availableBalance: yup
      .string()
      .test("is-not-zero", "Available balance is 0", (value) => {
        if (value !== undefined && value !== null && parseFloat(value) <= 0) {
          return false;
        }
        return true;
      }),
    withdrawnAmount: yup
      .string()
      .required("Withdrawn amount is required") // Required validation
      .test(
        "is-valid-integer",
        "Withdrawn amount must be a valid integer",
        (value) => {
          if (!value) return false; // Required validation already handles null/empty
          return integerRegex.test(value); // Validate format as an integer
        },
      )
      .test(
        "is-greater-than-zero",
        "Withdrawn amount must be greater than 0",
        (value) => {
          if (!value) return false; // Required validation already handles null/empty
          const numberValue = parseFloat(value);
          return numberValue > 0; // Ensure value is greater than 0
        },
      )
      .test(
        "is-less-than-or-equal-to-balance",
        "Withdrawn amount must be less than or equal to available balance",
        function (value) {
          if (!value) return false; // Required validation already handles null/empty
          const { availableBalance } = this.parent; // Access the value of another field
          if (!availableBalance) return false; // Ensure availableBalance is defined
          const withdrawn = parseFloat(value);
          const balance = parseFloat(availableBalance);
          return withdrawn < balance; // Validate that withdrawn amount is <= available balance
        },
      ),
    totalWithdrawnInWords: yup.string().nullable(),
    transMode: yup.string().required("Transaction mode is required"),
    refVouchNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .nullable() // Allow null values
      .test(
        "is-valid-ref-vouch-no",
        "Reference voucher number is invalid",
        (value) => {
          if (value === null) return true; // Skip validation if value is null or empty
          return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
        },
      ),
    narration: yup
      .string()
      .test("is-required-narration", "Narration is required", function (value) {
        const { transMode } = this.parent;
        if (transMode !== "transfer") return true; // Skip validation if value is null or empty
        return !!value; // Validate with regex
      }),
    gl: yup.string().test("is-required-gl", "GL is required", function (value) {
      const { transMode } = this.parent;
      if (transMode !== "transfer") return true; // Skip validation if value is null or empty
      return !!value; // Validate with regex
    }),
    subGl: yup.string().nullable(),
    subLedgerNarration: yup.string(),
    subGlBalance: yup.string(),
    ledgerAmount: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      bankAccount: "",
      withdrawnDate: beg_date ? parseFlexDate(beg_date) : new Date(),
      availableBalance: "",
      withdrawnAmount: "",
      transMode: "cash",
      refVouchNo: "",
      narration: "",
      gl: "",
      subGl: "",
      subGlBalance: "",
      subLedgerNarration: "",
      ledgerAmount: "",
    },
  });

  const { control } = form;
  const {
    bankAccount,
    withdrawnDate,
    gl,
    subGl,
    subLedgerNarration,
    ledgerAmount,
    withdrawnAmount,
    availableBalance,
  } = useWatch({ control });

  const handleSubmit = async (values) => {
    if (
      values.transMode === "transfer" &&
      subLedgerListData.length > 0 &&
      transferTableData.length < 1
    )
      return toast.error("Add atleast one subledger in table");
    else if (
      values.transMode === "transfer" &&
      transferTableData &&
      transferTableData.length > 0 &&
      transferTableData.reduce(
        (sum, item) => sum + (Number(item.amount) || 0),
        0,
      ) !== Number(values.withdrawnAmount)
    )
      return toast.error("Total amount should match withdrawn amount");
    else postBankWithdrawnApiCall(values);
  };
  const handleShowLedger = () => {
    if (bankAccount && withdrawnDate) {
      getBankLedgerHeaderApiCall(bankAccount, withdrawnDate);
      getBankLedgerDataApiCall(bankAccount, withdrawnDate);
      setShowLedger(true);
    } else {
      toast.error("Select bank account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const handleAddTransferTable = () => {
    if (ledgerAmount) {
      // If subLedgerListData has items → check subGl & narration too
      if (
        subLedgerListData &&
        subLedgerListData.length > 0 &&
        (!subGl || !subLedgerNarration)
      ) {
        toast.error("Add subledger and narration first");
        return;
      }

      setTransferTableData((prev) => {
        const isDuplicate = prev.some(
          (item) => item.subGlId === form.getValues("subGl"),
        );

        if (isDuplicate) {
          toast.error("This subGL is already added!");
          return prev;
        }

        return [
          ...prev,
          {
            glId: form.getValues("gl"),
            subGlId: form.getValues("subGl"),
            subGlName: subLedgerListData.find(
              (ledger) => ledger.Id.toString() === form.getValues("subGl"),
            )?.Full_Name,
            type: subLedgerListData.find(
              (ledger) => ledger.Id.toString() === form.getValues("subGl"),
            )?.Type,
            narration: form.getValues("subLedgerNarration"),
            amount: form.getValues("ledgerAmount"),
          },
        ];
      });

      setSubLedgerInput("");

      form.setValue("subGl", "");
      form.setValue("subLedgerNarration", "");
      form.setValue("ledgerAmount", "");
    } else {
      toast.error("Amount is required");
    }
  };

  const handleDeleteTransferTable = (id) => {
    const newTransferTableData = transferTableData.filter(
      (data) => data.subGlId !== id,
    );
    setTransferTableData(newTransferTableData);
  };

  const postBankWithdrawnApiCall = async (item) => {
    const cashDetails = cashDenomArray.map((cash) => ({
      note_id: cash.note_id,
      in_qnty: 0,
      out_qnty: cash.denominator,
      tot_amount: cash.totalAmount,
    }));

    const ledgerData = transferTableData.map((data) => ({
      gl_id: data.glId,
      amount: data.amount,
      subgl_id: data.subGlId,
      subgl_narr: data.narration,
      subgl_type: data.type,
    }));

    let data = {
      trans_date: item.withdrawnDate
        ? formatDateForApi(item.withdrawnDate)
        : null,
      Account_Id: item.bankAccount,
      Amount: item.withdrawnAmount,
      to_account_id: null,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      narration: item.transMode === "cash" ? "" : item.narration,
      trans_mode: item.transMode === "cash" ? "C" : "O",
      ledger_data:
        item.transMode === "transfer" && subLedgerListData.length > 1
          ? ledgerData
          : [],
      fin_id: finId,
      branch_id: branchId,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postBankWithdrawnAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setSubLedgerInput("");
        setTransferTableData([]);
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setDenominators(defaultDenominators);
        dispatch(getSubLedgerListData([]));
      } else {
        toast.error(res.details);
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
        form.getValues("bankAccount"),
        formatDateForApi(form.getValues("withdrawnDate")),
      );
      if (res.message === "Data Found") {
        form.setValue("availableBalance", res.details || "");
      } else {
        form.setValue("availableBalance", "");
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("availableBalance", "");
    } finally {
      setLoading(false);
    }
  };

  const getSubLedgerBalanceApiCall = async () => {
    setLoading(true);

    const type = subLedgerListData.find(
      (ledger) => ledger.Id.toString() === form.getValues("subGl"),
    )?.Type;

    const date = form.getValues("withdrawnDate")
      ? formatDateForApi(form.getValues("withdrawnDate"))
      : "";

    try {
      const res = await getVoucherSubLedgerBalanceAPI(
        orgId,
        form.getValues("subGl"),
        type,
        date,
      );
      console.log(res.details);

      if (res.message === "Data Found") {
        form.setValue("subGlBalance", parseFloat(res.details));
      } else {
        form.setValue("subGlBalance", 0);
      }
    } catch (error) {
      toast.error("Something went wrong");
      form.setValue("subGlBalance", 0);
    } finally {
      setLoading(false);
    }
  };

  const prevBankAccount = useRef();
  const prevWithdrawnDate = useRef();

  useEffect(() => {
    const currentBankAccount = form.getValues("bankAccount");
    const currentWithdrawnDate = form.getValues("withdrawnDate");

    if (
      currentBankAccount &&
      currentWithdrawnDate &&
      (currentBankAccount !== prevBankAccount.current ||
        currentWithdrawnDate !== prevWithdrawnDate.current)
    ) {
      getBankBalanceApiCall(orgId);
    }

    prevBankAccount.current = currentBankAccount;
    prevWithdrawnDate.current = currentWithdrawnDate;
  }, [bankAccount, withdrawnDate]);

  //handle in denominators change
  const handleDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...denominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setDenominators(newDenominators);
    }
  };

  //handle cash transaction grand total
  const calculateCashTransactionTotalAmount = (note, denominator) => {
    const parsedNote = parseFloat(note);
    const parsedDenominators = parseFloat(denominator);
    if (!isNaN(parsedNote) && !isNaN(parsedDenominators)) {
      return parsedNote * parsedDenominators;
    }
    return 0;
  };

  // set denominators
  useEffect(() => {
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    setCashTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(cash.Note_Value, denominators[index]),
    );

    setCashTransactionTotal(newTotalAmounts);
  }, [denominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashTransactionGrandTotal(newGrandTotal);
  }, [cashTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(denominators[idx]) || 0,
        totalAmount: cashTransactionTotal[idx],
      };
    });
    setCashDenomArray(postData);
  }, [denominators, cashTransactionTotal]);

  useEffect(() => {
    if (subGl) getSubLedgerBalanceApiCall();
  }, [subGl]);

  useEffect(() => {
    if (withdrawnAmount && availableBalance) form.trigger("withdrawnAmount");
  }, [withdrawnAmount, availableBalance]);

  useEffect(() => {
    if (withdrawnAmount)
      form.setValue(
        "totalWithdrawnInWords",
        "Rupees " + convertToWords(withdrawnAmount) + " Only" || "",
      );
    else form.setValue("totalWithdrawnInWords", "");
  }, [withdrawnAmount]);

  return {
    loading,
    cashDenomData,
    denominators,
    cashTransactionTotal,
    cashTransactionGrandTotal,
    handleDenominatorChange,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
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
    subLedgerInput,
    setSubLedgerInput,
    gl,
    handleAddTransferTable,
    transferTableData,
    handleDeleteTransferTable,
  };
};
