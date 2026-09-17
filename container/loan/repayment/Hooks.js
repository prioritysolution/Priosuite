"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { set, useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { formatDateForApi, formatDateForDisplay } from "@/utils/dateHelpers";
import {
  getGuarranterSecurityAPI,
  getLoanAccountDetailsByAccountNoAPI,
  getLoanAccountListAPI,
  postLoanRepaymentAPI,
} from "./RepaymentApis";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";
import { getCheckBalanceAPI } from "@/container/membership/issueMembership/IssueMembershipApis";
import { useLoanLedger } from "@/common/ledger/loanLedger/Hooks";
import { getLoanAccountSearchData } from "./RepaymentReducer";
import convertToWords from "@/utils/numberToWords";
import { getAccountDetailsByAccountNoAPI } from "@/container/deposit/deposit/DepositApis";
import { getSavingsAccountListAPI } from "@/container/deposit/mature/MatureApis";
import { getSearchAccountData } from "@/container/deposit/deposit/DepositReducer";

export const useRepayment = () => {
  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const dispatch = useDispatch();

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const {
    loading: getLoanLedgerLoading,
    showLedger: showLedgerDialog,
    setShowLedger: setShowLedgerDialog,
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
  } = useLoanLedger();

  const [loading, setLoading] = useState("");
  const [postRepaymentLoading, setPostRepaymentLoading] = useState("");
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [insufficientBalanceDisable, setInsufficientBalanceDisable] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [loanProduct, setLoanProduct] = useState(null);

  const [getLoanAccountLoading, setGetLoanAccountLoading] = useState(false);

  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [lastAccountPage, setLastAccountPage] = useState(1);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [showLedger, setShowLedger] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [collectionReceiptData, setCollectionReceiptData] = useState(null);

  const [activeTab, setActiveTab] = useState("memberNo");
  const [currentSavingsPage, setCurrentSavingsPage] = useState(1);
  const [lastSavingsPage, setLastSavingsPage] = useState(1);

  const [dialougeOpen, setDialougeOpen] = useState(false);
  const [savingsAccountFullName, setSavingsAccountFullName] = useState(null);
  const [savingsAccountBalance, setSavingsAccountBalance] = useState(null);
  const [showGuarantorSecurityDialog, setShowGuarantorSecurityDialog] =
    useState(false);
  const [guarantorSecurityDetails, setGuarantorSecurityDetails] =
    useState(null);

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
    accountNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    accountType: yup.string().nullable(),
    disburseDate: yup.string().nullable(),
    disburseAmount: yup.string().nullable(),
    roi: yup.string().nullable(),
    finalRepayDate: yup.string().nullable(),
    repayMode: yup.string().nullable(),
    installmentAmount: yup.string().nullable(),
    lastRepayDate: yup.string().nullable(),
    lastRepayPrincipal: yup.string().nullable(),
    LastRepayInterest: yup.string().nullable(),
    currentDays: yup.string().nullable(),
    overdueDays: yup.string().nullable(),
    currentAmount: yup.string().nullable(),
    overdueAmount: yup.string().nullable(),
    currentInterest: yup.string().nullable(),
    overdueInterest: yup.string().nullable(),
    totalInterest: yup.string().nullable(),
    prevDueInterest: yup.string().nullable(),
    demandPrincipal: yup.string().nullable(),
    repaymentDate: yup.string().nullable(),
    refVouchNo: yup.string().nullable(),
    currentBalance: yup.string().nullable(),
    principalAmount: yup
      .string()
      .test(
        "is-less-than-or-equal",
        "Principal amount must be less than or equal to current balance",
        function (value) {
          if (!value) return true; // Ensure value exists
          const { currentBalance } = this.parent; // Access currentBalance from the same object
          if (!currentBalance || !value) return false; // Ensure both values exist

          return Number(value) <= Number(currentBalance); // Comparison logic
        },
      ),
    interestAmount: yup.string(),
    totalAmount: yup
      .string()
      .required("Total amount is required")
      .test(
        "greater-than-zero",
        "Total amount must be greater than 0",
        (value) => {
          const number = parseFloat(value);
          return !isNaN(number) && number > 0;
        },
      ),
    totalAmountInWords: yup.string().nullable(),
    transMode: yup.string().required("Transanction mode is required"),
    bank: yup.string(),
    savingsAccountType: yup.string(),
    savingsAccountNo: yup.string(),
    savingsAccountId: yup.string(),
    savings: yup.string(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
    savingsAccountName: yup.string(),
    savings: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      accountType: "",
      disburseDate: "",
      disburseAmount: "",
      roi: "",
      finalRepayDate: "",
      repayMode: "",
      installmentAmount: "",
      lastRepayDate: "",
      lastRepayPrincipal: "",
      LastRepayInterest: "",
      currentBalance: "",
      currentDays: "",
      overdueDays: "",
      currentAmount: "",
      overdueAmount: "",
      currentInterest: "",
      overdueInterest: "",
      totalInterest: "",
      prevDueInterest: "",
      demandPrincipal: "",
      repaymentDate: null,
      refVouchNo: "",
      principalAmount: "",
      interestAmount: "",
      totalAmount: "",
      transMode: "cash",
      bank: "",
      savingsAccountType: "own",
      savings: "",
      savingsAccountNo: "",
      savingsAccountId: "",
      savingsName: "",
      savingsBalance: "",
    },
  });

  const { control } = form;

  const {
    transMode,
    principalAmount,
    interestAmount,
    repaymentDate,
    totalAmount,
    savings,
    savingsBalance,
    savingsAccountType,
  } = useWatch({
    control,
  });

  const handleSubmit = async (values) => {
    postRepaymentApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    getLoanAccountDetailsByAccountNoApiCall(values);
    form.setValue("repaymentDate", values.date);
    form.setValue("savings", "");
    form.setValue("savingsName", "");
    form.setValue("savingsBalance", "");
    form.setValue("savingsAccountId", "");
    form.setValue("savingsAccountNo", "");
    form.setValue("bank", "");
  };

  const handleGetGuarantorSecurity = () => {
    if (orgId) getGuarantorSecurityApiCall(orgId, loanProduct?.Acct_Id || "");
  };

  const handleShowLedger = () => {
    if (loanProduct.Acct_Id) {
      getLoanLedgerHeaderApiCall(
        loanProduct.Acct_Id,
        form.getValues("repaymentDate"),
      );
      getLoanLedgerDataApiCall(
        loanProduct.Acct_Id,
        form.getValues("repaymentDate"),
      );
      setShowLedgerDialog(true);
    } else {
      toast.error("Select account first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setCollectionReceiptData(null);
  };

  const handleGenerateCollectionReceipt = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setIsOpen(true);
  };

  const handleSearchAccountListByMemberNo = () => {
    if (form.getValues("dialougeMemberNo")) {
      getSavingsAccountListApiCall(2, form.getValues("dialougeMemberNo"), 1);
      setCurrentSavingsPage(1);
    } else toast.error("Please enter member no.");
  };

  const handleSearchAccountListByName = () => {
    if (form.getValues("dialougeAccountName")) {
      getSavingsAccountListApiCall(1, form.getValues("dialougeAccountName"), 1);
      setCurrentSavingsPage(1);
    } else toast.error("Please enter name");
  };

  useEffect(() => {
    if (activeTab === "memberNo") {
      getSavingsAccountListApiCall(
        2,
        form.getValues("dialougeMemberNo"),
        currentSavingsPage,
      );
    } else {
      getSavingsAccountListApiCall(
        1,
        form.getValues("dialougeAccountName"),
        currentSavingsPage,
      );
    }
  }, [currentSavingsPage]);

  const handleSelectClick = (data) => {
    form.setValue("savingsAccountNo", data.Account_No);
    form.setValue("savingsAccountId", data.Acct_Id);
    setDialougeOpen(false);
  };

  const handleFetchData = () => {
    if (form.getValues("savingsAccountNo")) {
      getSavingsAccountDetailsByAccountNoApiCall(
        form.getValues("savingsAccountNo"),
        form.getValues("repaymentDate"),
      );
    } else {
      toast.error("Enter a valid account number.");
    }
  };

  const postRepaymentApiCall = async (item) => {
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
      acct_id: loanProduct.Acct_Id,
      mem_id: loanProduct.Mem_Id,
      date: formatDateForApi(item.repaymentDate),
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      prn_amt: item.principalAmount || 0,
      intt_amt: item.interestAmount || 0,
      due_intt:
        Number(item.interestAmount) < Number(loanProduct.Tot_Intt)
          ? Number(loanProduct.Tot_Intt) - Number(item.interestAmount)
          : 0,
      prn_gl:
        loanProduct.Od_Days === 0
          ? loanProduct.Curr_prn_gl || 0
          : loanProduct.Od_Prn_Gl || 0,
      intt_gl:
        loanProduct.Od_Days === 0
          ? loanProduct.Intt_Curr_Gl || 0
          : loanProduct.Od_Intt_Gl || 0,
      od_days: item.overdueInterest || 0,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      sb_id:
        item.transMode === "savings"
          ? item.savingsAccountType === "own"
            ? item.savings || null
            : item.savingsAccountId || null
          : null,
      bank_id: item.transMode === "bank" ? item.bank : null,
      branch_Id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setPostRepaymentLoading(true);

    try {
      const res = await postLoanRepaymentAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setResetTrigger((prev) => prev + 1);
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        // toast.success(res.details || res.message);
        setCollectionReceiptData(res.data[0]);
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
      setPostRepaymentLoading(false);
    }
  };

  const clearLoanAccountDetails = () => {
    form.setValue("accountNo", "");
    form.setValue("memberName", "");
    form.setValue("gurdianName", "");
    form.setValue("address", "");
    form.setValue("mobile", "");
    form.setValue("accountType", "");
    form.setValue("disburseDate", "");
    form.setValue("disburseAmount", "");
    form.setValue("roi", "");
    form.setValue("finalRepayDate", "");
    form.setValue("repayMode", "");
    form.setValue("installmentAmount", "");
    form.setValue("lastRepayDate", "");
    form.setValue("lastRepayPrincipal", "");
    form.setValue("LastRepayInterest", "");
    form.setValue("currentBalance", "");
    form.setValue("currentDays", "");
    form.setValue("overdueDays", "");
    form.setValue("currentAmount", "");
    form.setValue("overdueAmount", "");
    form.setValue("currentInterest", "");
    form.setValue("overdueInterest", "");
    form.setValue("totalInterest", "");
    form.setValue("prevDueInterest", "");
    form.setValue("demandPrincipal", "");
    form.setValue("principalAmount", "");
    form.setValue("interestAmount", "");
    setLoanProduct(null);
    setVisibleBlock(false);
    setShowLedger(false);
  };

  const getLoanAccountDetailsByAccountNoApiCall = async (item) => {
    setLoading(true);

    try {
      const res = await getLoanAccountDetailsByAccountNoAPI(
        orgId,
        item.accountNo,
        formatDateForApi(item.date),
      );
      const row = res?.details?.[0];
      if (res.message === "Data Found" && row && Number(row.Err_No) === 0) {
        form.setValue("accountNo", row.Account_No || "");
        form.setValue("memberName", row.Full_Name || "");
        form.setValue("gurdianName", row.Relation_Name || "");
        form.setValue("address", row.Address || "");
        form.setValue("mobile", row.Cust_Mob || "");
        form.setValue("accountType", row.Acct_Type || "");
        form.setValue("disburseDate", formatDateForDisplay(row.Disb_Date));
        form.setValue("disburseAmount", row.Disb_Amt || "");
        form.setValue("roi", row.Roi || "");
        form.setValue("finalRepayDate", formatDateForDisplay(row.Repay_Within));
        form.setValue("repayMode", row.Repay_Mode || "");
        form.setValue("installmentAmount", row.Installment_Amt || "");
        form.setValue(
          "lastRepayDate",
          row.Last_Repay_Date === "1990-01-01"
            ? ""
            : formatDateForDisplay(row.Last_Repay_Date),
        );
        form.setValue("lastRepayPrincipal", row.Last_Prn_paid || "");
        form.setValue("LastRepayInterest", row.Last_Intt_paid || "");
        form.setValue("currentBalance", row.Balance || "");
        form.setValue("currentDays", row.Curr_Days ?? "");
        form.setValue("overdueDays", row.Od_Days ?? "");
        form.setValue("currentAmount", row.Curr_Amt || "");
        form.setValue("overdueAmount", row.Od_Amt || "");
        form.setValue("currentInterest", row.Curr_Intt || "");
        form.setValue("overdueInterest", row.Od_Intt || "");
        form.setValue("totalInterest", row.Tot_Intt || "");
        form.setValue("prevDueInterest", row.Due_Intt || "");
        form.setValue("demandPrincipal", row.Demand_Prn || "");
        form.setValue(
          "principalAmount",
          row.Demand_Prn && parseFloat(row.Demand_Prn) !== 0
            ? row.Demand_Prn
            : "",
        );
        form.setValue(
          "interestAmount",
          row.Tot_Intt && parseFloat(row.Tot_Intt) !== 0 ? row.Tot_Intt : "",
        );
        getDepositEcsAccountApiCall(orgId, row.Mem_Id);
        setLoanProduct(row);
        setVisibleBlock(true);
        setShowLedger(true);
      } else {
        toast.error(row?.Message || res.details || res.message);
        clearLoanAccountDetails();
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      clearLoanAccountDetails();
    } finally {
      setLoading(false);
    }
  };

  const getGuarantorSecurityApiCall = async (orgId, accountId) => {
    setLoading(true);

    try {
      const res = await getGuarranterSecurityAPI(orgId, accountId);
      if (res.message === "Data Found") {
        setShowGuarantorSecurityDialog(true);
        setGuarantorSecurityDetails(res.details);
      } else {
        setShowGuarantorSecurityDialog(false);
        setGuarantorSecurityDetails(null);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setShowGuarantorSecurityDialog(false);
      setGuarantorSecurityDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const getCheckBalanceApiCall = async () => {
    setLoading(true);

    try {
      const res = await getCheckBalanceAPI(
        form.getValues("savings"),
        format(form.getValues("repaymentDate"), "yyyy-MM-dd"),
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

  const getLoanAccountListApiCall = async (mode, value, page) => {
    setGetLoanAccountLoading(true);

    const memberName = mode === 1 ? value : null;
    const memberNo = mode === 2 ? value : null;

    try {
      const res = await getLoanAccountListAPI(
        orgId,
        mode,
        memberName,
        memberNo,
        page,
      );
      if (res.message === "Data Found") {
        dispatch(getLoanAccountSearchData(res.data.data));
        setLastAccountPage(res.data.last_page);
      } else {
        dispatch(getLoanAccountSearchData([]));
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLoanAccountSearchData([]));
    } finally {
      setGetLoanAccountLoading(false);
    }
  };

  const getSavingsAccountListApiCall = async (type, value, page) => {
    setLoading(true);

    try {
      const res = await getSavingsAccountListAPI(orgId, type, value, page);
      if (res.message === "Data Found") {
        dispatch(getSearchAccountData(res.data.data));
        setLastSavingsPage(res.data.last_page);
      } else {
        dispatch(getSearchAccountData([]));
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getSearchAccountData([]));
    } finally {
      setLoading(false);
    }
  };

  const getSavingsAccountDetailsByAccountNoApiCall = async (
    accountNo,
    date,
  ) => {
    setLoading(true);

    try {
      const res = await getAccountDetailsByAccountNoAPI(
        accountNo,
        "C",
        format(date, "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        setSavingsAccountFullName(res.details[0].Full_Name);
        setSavingsAccountBalance(res.details[0].Avail_Bal);
      } else {
        toast.error("Please enter another account");
        setSavingsAccountFullName(null);
        setSavingsAccountBalance(null);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setSavingsAccountFullName(null);
      setSavingsAccountBalance(null);
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

  const prevPrincipalRef = useRef(principalAmount);
  const prevInterestRef = useRef(interestAmount);
  const prevTotalRef = useRef(totalAmount);

  useEffect(() => {
    const principal = Number(principalAmount) || 0;
    const interest = Number(interestAmount) || 0;
    const total = Number(totalAmount) || 0;

    const principalChanged = principalAmount !== prevPrincipalRef.current;
    const interestChanged = interestAmount !== prevInterestRef.current;
    const totalChanged = totalAmount !== prevTotalRef.current;

    if (principalChanged || interestChanged) {
      const newTotal = principal + interest;
      if (total !== newTotal) {
        form.setValue("totalAmount", newTotal);
      }
    } else if (totalChanged) {
      const currentCombined = principal + interest;
      if (total !== currentCombined) {
        const maxInterest =
          (Number(form.getValues("currentInterest")) || 0) +
          (Number(form.getValues("overdueInterest")) || 0) +
          (Number(form.getValues("prevDueInterest")) || 0);

        if (total > currentCombined) {
          let increaseAmount = total - currentCombined;
          const possibleInterestIncrease = maxInterest - interest;
          const newInterest =
            interest + Math.min(increaseAmount, possibleInterestIncrease);
          const usedForInterest = newInterest - interest;

          increaseAmount -= usedForInterest;
          const newPrincipal = principal + increaseAmount;

          form.setValue("interestAmount", newInterest);
          form.setValue("principalAmount", newPrincipal);
        } else {
          let decreaseAmount = currentCombined - total;
          const newPrincipal = Math.max(principal - decreaseAmount, 0);
          const usedFromPrincipal = principal - newPrincipal;

          decreaseAmount -= usedFromPrincipal;
          const newInterest = Math.max(interest - decreaseAmount, 0);

          form.setValue("principalAmount", newPrincipal);
          form.setValue("interestAmount", newInterest);
        }
      }
    }

    if (totalAmount) {
      const words = "Rupees " + convertToWords(Number(totalAmount)) + " Only";
      if (form.getValues("totalAmountInWords") !== words) {
        form.setValue("totalAmountInWords", words);
      }
    } else {
      if (form.getValues("totalAmountInWords") !== "") {
        form.setValue("totalAmountInWords", "");
      }
    }

    prevPrincipalRef.current = principalAmount;
    prevInterestRef.current = interestAmount;
    prevTotalRef.current = totalAmount;
  }, [principalAmount, interestAmount, totalAmount]);

  const prevSavings = useRef();
  const prevDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("repaymentDate");

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
  }, [savings, repaymentDate]);

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
      if (savingsAccountType === "own") {
        if (
          savingsBalance &&
          totalAmount &&
          Number(savingsBalance) >= Number(totalAmount)
        )
          setInsufficientBalanceDisable(false);
        else setInsufficientBalanceDisable(true);
      } else if (savingsAccountType === "other") {
        if (
          savingsAccountBalance &&
          totalAmount &&
          Number(savingsAccountBalance) >= Number(totalAmount)
        )
          setInsufficientBalanceDisable(false);
        else setInsufficientBalanceDisable(true);
      }
    } else setInsufficientBalanceDisable(false);
  }, [
    transMode,
    savingsBalance,
    totalAmount,
    savingsAccountType,
    savingsAccountBalance,
  ]);

  useEffect(() => {
    form.setValue("savings", "");
    form.setValue("savingsName", "");
    form.setValue("savingsBalance", "");
    form.setValue("savingsAccountId", "");
    form.setValue("savingsAccountNo", "");
    setSavingsAccountFullName("");
    setSavingsAccountBalance("");
  }, [savingsAccountType]);

  return {
    loading,
    getLoanAccountLoading,
    getLoanAccountListApiCall,
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
    transMode,
    insufficientBalanceDisable,
    showLedger,
    handleShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalDisburse,
    totalPrincipalRefund,
    totalInterestRefund,
    userName,
    currentDate,
    currentTime,
    fromDate,
    toDate,
    resetTrigger,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
    isOpen,
    setIsOpen,
    collectionReceiptData,
    handleGenerateCollectionReceipt,
    postRepaymentLoading,
    getLoanLedgerLoading,
    handleSearchAccountListByMemberNo,
    handleSearchAccountListByName,
    handleSelectClick,
    dialougeOpen,
    setDialougeOpen,
    handleFetchData,
    savingsAccountFullName,
    savingsAccountBalance,
    currentSavingsPage,
    setCurrentSavingsPage,
    lastSavingsPage,
    activeTab,
    setActiveTab,
    handleGetGuarantorSecurity,
    showGuarantorSecurityDialog,
    setShowGuarantorSecurityDialog,
    guarantorSecurityDetails,
  };
};
