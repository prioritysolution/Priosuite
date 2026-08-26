"use client";
import { useEffect, useState, useRef } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getAccountDetailsByAccountNoAPI,
  getAccountListAPI,
  getOperateProductAPI,
  postDepositAPI,
} from "./DepositApis";
import { format, parse } from "date-fns";
import { getOperateProductData, getSearchAccountData } from "./DepositReducer";
import { useOpenDepositAccount } from "../openDepositAccount/Hooks";
import { getCheckBalanceAPI } from "@/container/membership/issueMembership/IssueMembershipApis";
import { useDepositLedger } from "@/common/ledger/depositLedger/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
  positiveIntegerRegex,
} from "@/utils/validationRegex";
import convertToWords from "@/utils/numberToWords";

export const useDeposit = (skipProductFetch = false) => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const {
    loading: getLedgerLoading,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    userName,
    currentDate,
    currentTime,
    getDepositLedgerHeaderApiCall,
    getDepositLedgerDataApiCall,
    fromDate,
  } = useDepositLedger();

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const [loading, setLoading] = useState(false);
  const [getDepositLoading, setGetDepositLoading] = useState(false);
  const [postDepositLoading, setPostDepositLoading] = useState(false);

  const [showLedger, setShowLedger] = useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [insufficientBalanceDisable, setInsufficientBalanceDisable] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);
  const [accountFormData, setAccountFormData] = useState(null);

  const [getAccountLoading, setGetAccountLoading] = useState(false);

  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [lastAccountPage, setLastAccountPage] = useState(1);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [depositReceiptData, setDepositReceiptData] = useState(null);

  // denominators
  const [inDenominators, setInDenominators] = useState([]);
  const [outDenominators, setOutDenominators] = useState([]);

  // cash Transaction Total
  const [cashInTransactionTotal, setCashInTransactionTotal] = useState([]);
  const [cashOutTransactionTotal, setCashOutTransactionTotal] = useState([]);

  const [cashInTransactionGrandTotal, setCashInTransactionGrandTotal] =
    useState(0);

  const [cashOutTransactionGrandTotal, setCashOutTransactionGrandTotal] =
    useState(0);

  const [cashInDenomArray, setCashInDenomArray] = useState([]);
  const [cashOutDenomArray, setCashOutDenomArray] = useState([]);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const savingsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );

  const formSchema = yup.object({
    productId: yup.string().nullable(),
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    accountNo: yup.string().nullable(),
    refAcNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    mobile: yup.string().nullable(),
    panNo: yup.string().nullable(),
    operationMode: yup.string().nullable(),
    chequeFacility: yup.string().nullable(),
    lastDepositDate: yup.string().nullable(),
    lastDepositAmount: yup.string().nullable(),
    installmentAmount: yup.string().nullable(),
    maturityDate: yup.string().nullable(),
    maturityAmount: yup.string().nullable(),
    availableBalance: yup.string().nullable(),
    rateOfInterest: yup.string().nullable(),
    Inst_No: yup.string().nullable(),
    Pending_Amt: yup.string().nullable(),
    depositDate: yup.string().nullable(),
    depositAmount: yup
      .string()
      .required("Deposit amount is required") // Required validation
      .test(
        "is-integer",
        "Deposit amount must be an integer",
        (value) => positiveIntegerRegex.test(value), // Validate as integer
      )
      .test(
        "is-greater-than-zero",
        "Deposit amount must be greater than 0",
        (value) => parseInt(value, 10) > 0, // Validate greater than 0
      ),
    paidUpto: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable()
      .test("is-required", "Paid upto is required", (value) => {
        if (depositProduct?.Prod_Type !== 3) return true;
        return !!value;
      }),
    fineAmount: yup
      .string()
      .nullable() // Not required
      .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
      .test(
        "is-integer",
        "Fine amount must be an integer",
        (value) => value === null || integerRegex.test(value), // Allow null and validate as integer
      )
      .test(
        "is-zero-or-greater",
        "Fine amount must be 0 or greater",
        (value) => value === null || parseInt(value, 10) >= 0, // Validate 0 or greater
      ),
    totalAmount: yup.string().nullable(),
    totalAmountInWords: yup.string().nullable(),
    transMode: yup.string().required("Transanction mode is required"),
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
    bank: yup.string(),
    savings: yup.string(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productId: "",
      memberNo: "",
      cifNo: "",
      accountNo: "",
      refAcNo: "",
      memberName: "",
      gurdianName: "",
      mobile: "",
      panNo: "",
      operationMode: "",
      chequeFacility: "",
      lastDepositDate: null,
      lastDepositAmount: "",
      installmentAmount: "",
      maturityDate: null,
      maturityAmount: "",
      availableBalance: "",
      rateOfInterest: "",
      Inst_No: "",
      Pending_Amt: "",
      depositDate: "",
      depositAmount: "",
      fineAmount: "",
      totalAmount: "",
      joint1: "",
      joint2: "",
      transMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
    },
  });

  const { control } = form;

  const {
    depositAmount,
    fineAmount,
    transMode,
    depositDate,
    totalAmount,
    savings,
    savingsBalance,
  } = useWatch({ control });

  const handleSubmit = async (values) => {
    postDepositApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    console.log("handleAccountFormSubmit triggered with values:", values);
    try {
      getAccountDetailsByAccountNoApiCall(values);
      form.setValue("depositDate", values.date);
      if (values.productId) {
        form.setValue("productId", values.productId);
      }
      setAccountFormData(values);
    } catch (e) {
      console.error("Error in handleAccountFormSubmit:", e);
    }
  };

  const handleShowLedger = () => {
    if (
      accountFormData &&
      depositProduct &&
      depositProduct.Acct_Id &&
      accountFormData.date
    ) {
      getDepositLedgerHeaderApiCall(
        depositProduct.Acct_Id,
        accountFormData.date,
      );
      setShowLedgerDialog(true);
    } else {
      toast.error("Enter account and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setDepositReceiptData(null);
  };

  const handleGenerateDepositReceipt = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setIsReceiptOpen(true);
  };

  const postDepositApiCall = async (item) => {
    setPostDepositLoading(true);
    const cashDetails = cashInDenomArray.map((inItem, idx) => {
      return {
        note_id: inItem.note_id,
        in_qnty: inItem.denominator,
        out_qnty: cashOutDenomArray.filter(
          (outItem) => inItem.note_id === outItem.note_id,
        )[0].denominator,
        tot_amount: cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
      };
    });
    let data = {
      member_id: depositProduct.Mem_Id,
      account_id: depositProduct.Acct_Id,
      trans_date: format(item.depositDate, "yyyy-MM-dd"),
      pamount: item.depositAmount,
      fine_amt: item.fineAmount,
      paid_upto:
        depositProduct?.Prod_Type === 3 && item.paidUpto
          ? format(item.paidUpto, "yyyy-MM-dd")
          : null,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      sb_id: item.transMode === "savings" ? item.savings : null,
      bank_id: item.transMode === "bank" ? item.bank : null,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    try {
      const res = await postDepositAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setResetTrigger((prev) => prev + 1);
        setDepositReceiptData(res.Data[0]);
        setShowLedger(false);
      } else {
        toast.error(res.details || res.message);
        setSuccessMessage(null);
        setVisibleBlock(true);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
      setVisibleBlock(true);
    } finally {
      setPostDepositLoading(false);
    }
  };

  const getAccountListApiCall = async (type, value, page) => {
    setGetAccountLoading(true);

    try {
      const res = await getAccountListAPI(orgId, type, value, page);
      if (res.message === "Data Found") {
        dispatch(getSearchAccountData(res.data.data));
        setLastAccountPage(res.data.last_page);
      } else {
        dispatch(getSearchAccountData([]));
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getSearchAccountData([]));
    } finally {
      setGetAccountLoading(false);
    }
  };

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    console.log(
      "getAccountDetailsByAccountNoApiCall triggered with item:",
      item,
    );
    setGetDepositLoading(true);

    try {
      const formattedDate = format(item.date, "yyyy-MM-dd");
      console.log("Requesting account details API with args:", {
        accountNo: item.accountNo,
        type: "D",
        formattedDate,
        orgId,
      });
      const res = await getAccountDetailsByAccountNoAPI(
        item.accountNo,
        "D",
        formattedDate,
        orgId,
        item.productId ? item.productId : 0,
      );
      console.log("Account details API response:", res);
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("operationMode", res.details[0].Oper_Mode || "");
        form.setValue(
          "chequeFacility",
          res.details[0].Is_Cheque === 0 ? "No" : "Yes",
        );
        form.setValue("accountNo", res.details[0].Account_No || "");
        form.setValue("refAcNo", res.details[0].Ref_Ac_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("panNo", res.details[0].Mem_Pan || "");
        form.setValue(
          "lastDepositDate",
          res.details[0].Last_Date
            ? format(res.details[0].Last_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("branchName", res.details[0].Branch_Name || "");
        form.setValue("BranchId", res.details[0].Branch_Id || "");
        form.setValue("lastDepositAmount", res.details[0].Last_Amt || "");
        form.setValue(
          "installmentAmount",
          res.details[0].Installment_Amount || "",
        );
        form.setValue(
          "maturityDate",
          res.details[0].Maturity_Date
            ? format(res.details[0].Maturity_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("maturityAmount", res.details[0].Maturity_Amount || "");
        form.setValue("availableBalance", res.details[0].Avail_Bal || "");
        form.setValue("rateOfInterest", res.details[0].ROI || "");
        form.setValue(
          "depositAmount",
          res.details[0].Pending_Amt && Number(res.details[0].Pending_Amt) > 0
            ? parseInt(res.details[0].Pending_Amt)
            : "",
        );
        form.setValue(
          "fineAmount",
          res.details[0].Fine_Amt && Number(res.details[0].Fine_Amt)
            ? res.details[0].Fine_Amt
            : "",
        );
        form.setValue("joint1", res.details[0].Joint_1);
        form.setValue("joint2", res.details[0].Joint_2);
        getDepositEcsAccountApiCall(orgId, res.details[0].Mem_Id);
        setDepositProduct(res.details[0]);
        setVisibleBlock(true);
        setShowLedger(true);
        form.setFocus("depositAmount");
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("operationMode", "");
        form.setValue("chequeFacility", "");
        form.setValue("accountNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("mobile", "");
        form.setValue("panNo", "");
        form.setValue("lastDepositDate", "");
        form.setValue("lastDepositAmount", "");
        form.setValue("installmentAmount", "");
        form.setValue("maturityDate", "");
        form.setValue("maturityAmount", "");
        form.setValue("availableBalance", "");
        form.setValue("rateOfInterest", "");
        form.setValue("depositAmount", "");
        form.setValue("fineAmount", "");
        form.setValue("joint1", "");
        form.setValue("joint2", "");
        setDepositProduct(null);
        setVisibleBlock(false);
        setShowLedger(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("operationMode", "");
      form.setValue("chequeFacility", "");
      form.setValue("accountNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("mobile", "");
      form.setValue("panNo", "");
      form.setValue("lastDepositDate", "");
      form.setValue("lastDepositAmount", "");
      form.setValue("installmentAmount", "");
      form.setValue("maturityDate", "");
      form.setValue("maturityAmount", "");
      form.setValue("availableBalance", "");
      form.setValue("rateOfInterest", "");
      form.setValue("depositAmount", "");
      form.setValue("fineAmount", "");
      form.setValue("joint1", "");
      form.setValue("joint2", "");
      form.setValue("branchName", "");
      form.setValue("BranchId", "");
      setDepositProduct(null);
      setVisibleBlock(false);
      setShowLedger(false);
    } finally {
      setGetDepositLoading(false);
    }
  };

  const getCheckBalanceApiCall = async () => {
    setLoading(true);

    try {
      const res = await getCheckBalanceAPI(
        form.getValues("savings"),
        format(form.getValues("depositDate"), "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue(
          "savingsBalance",
          res.details ? Number(res.details)?.toFixed(2) : "",
        );
      } else {
        toast.error(res.details || res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //handle in denominators change
  const handleInDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...inDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setInDenominators(newDenominators);
    }
  };
  //handle in denominators change
  const handleOutDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...outDenominators];

    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setOutDenominators(newDenominators);
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

  const getOperateProductAPICall = async (orgId, screen) => {
    try {
      const res = await getOperateProductAPI(orgId, screen);
      if (res.message === "Data Found") {
        dispatch(getOperateProductData(res.details));
      }
    } catch (error) {
      console.error(error);
      dispatch(getOperateProductData([]));
    }
  };

  useEffect(() => {
    if (orgId && !skipProductFetch) {
      getOperateProductAPICall(orgId, "D");
    }
  }, [orgId, skipProductFetch]);

  // set denominators
  useEffect(() => {
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
    setCashInTransactionTotal(defaultTotalAmounts);
    setCashOutTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        inDenominators[index],
      ),
    );

    setCashInTransactionTotal(newTotalAmounts);
  }, [inDenominators, cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        outDenominators[index],
      ),
    );

    setCashOutTransactionTotal(newTotalAmounts);
  }, [outDenominators, cashDenomData]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashInTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashInTransactionGrandTotal(newGrandTotal);
  }, [cashInTransactionTotal]);

  useEffect(() => {
    // Calculate grand total
    const newGrandTotal = cashOutTransactionTotal.reduce(
      (acc, curr) => acc + curr,
      0,
    );
    setCashOutTransactionGrandTotal(newGrandTotal);
  }, [cashOutTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(inDenominators[idx]) || 0,
        totalAmount: cashInTransactionTotal[idx],
      };
    });
    setCashInDenomArray(postData);
  }, [inDenominators, cashInTransactionTotal]);

  useEffect(() => {
    let postData = cashDenomData.map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(outDenominators[idx]) || 0,
        totalAmount: cashOutTransactionTotal[idx],
      };
    });
    setCashOutDenomArray(postData);
  }, [outDenominators, cashOutTransactionTotal]);

  useEffect(() => {
    if (depositAmount || fineAmount) {
      const total = Number(depositAmount) + Number(fineAmount);
      form.setValue("totalAmount", total);
      form.setValue(
        "totalAmountInWords",
        "Rupees " + convertToWords(total) + " Only" || "",
      );
    } else {
      form.setValue("totalAmount", "");
      form.setValue("totalAmountInWords", "");
    }
  }, [depositAmount, fineAmount]);

  const prevSavings = useRef();
  const prevDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("depositDate");

    if (
      currentSavings &&
      currentDate &&
      (currentSavings !== prevSavings.current ||
        currentDate !== prevDate.current)
    ) {
      getCheckBalanceApiCall();
    }

    prevSavings.current = currentSavings;
    prevDate.current = currentDate;
  }, [savings, depositDate]);

  useEffect(() => {
    if (savings)
      form.setValue(
        "savingsName",
        savingsAccountData?.find(
          (account) => account?.Id?.toString() === savings,
        )?.Full_Name || "",
      );
  }, [savings]);

  useEffect(() => {
    form.setValue("savings", "");
    form.setValue("bank", "");
  }, [transMode]);

  useEffect(() => {
    if (transMode === "savings") {
      if (
        savingsBalance &&
        totalAmount &&
        Number(savingsBalance) >= Number(totalAmount)
      )
        setInsufficientBalanceDisable(false);
      else setInsufficientBalanceDisable(true);
    }
  }, [transMode, savingsBalance, totalAmount]);

  return {
    loading,
    getDepositLoading,
    postDepositLoading,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    showLedger,
    getAccountLoading,
    getAccountListApiCall,
    transMode,
    insufficientBalanceDisable,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalDeposit,
    totalWithdrawn,
    totalInterest,
    userName,
    currentDate,
    currentTime,
    fromDate,
    resetTrigger,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
    isReceiptOpen,
    setIsReceiptOpen,
    depositReceiptData,
    handleGenerateDepositReceipt,
    depositProduct,
    getLedgerLoading,
  };
};
