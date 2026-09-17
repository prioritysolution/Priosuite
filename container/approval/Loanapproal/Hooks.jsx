"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { getLoanListAPI, getLoanDetailsAPI, GetDeductionListAPI, LoanApprvRejectAPI } from "./LoanapproalApi";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { getBankAccountAPI } from "@/container/banking/bankDeposit/BankDepositApis";
import { getBankAccountData } from "@/container/banking/bankDeposit/BankDepositReducer";
import { getDepositEcsAccountAPI } from "@/container/deposit/openDepositAccount/OpenDepositAccountApis";
import { getEcsAccountData } from "@/container/deposit/openDepositAccount/OpenDepositAccountReducer";
import { getCheckBalanceAPI, getCashDenomAPI } from "@/container/membership/issueMembership/IssueMembershipApis";
import { useDispatch, useSelector } from "react-redux";

const alphanumericWithHyphenUnderscoreRegex = /^[a-zA-Z0-9-_]*$/;

const parseDateHelper = (dStr) => {
  if (!dStr) return null;
  if (dStr instanceof Date) return dStr;

  if (typeof dStr === "string" && (dStr.includes("-") || dStr.includes("/"))) {
    const parts = dStr.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
      if (parts[2].split("T")[0].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2].split("T")[0], 10);
        return new Date(year, month, day);
      }
    }
  }
  const d = new Date(dStr);
  return isNaN(d.getTime()) ? null : d;
};

export const useLoanapproal = () => {
  const [loanList, setLoanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("year_id") || getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const dispatch = useDispatch();

  // Transaction Block States
  const bankAccountData = useSelector(
    (state) => state?.bankDeposit?.bankAccountData,
  );
  const ecsAccountData = useSelector(
    (state) => state?.openDepositAccount?.ecsAccountData,
  );
  const [cashDenomData, setCashDenomData] = useState([]);
  
  const [inDenominators, setInDenominators] = useState([]);
  const [outDenominators, setOutDenominators] = useState([]);
  const [cashInTransactionTotal, setCashInTransactionTotal] = useState([]);
  const [cashOutTransactionTotal, setCashOutTransactionTotal] = useState([]);
  const [cashInTransactionGrandTotal, setCashInTransactionGrandTotal] = useState(0);
  const [cashOutTransactionGrandTotal, setCashOutTransactionGrandTotal] = useState(0);
  const [cashInDenomArray, setCashInDenomArray] = useState([]);
  const [cashOutDenomArray, setCashOutDenomArray] = useState([]);
  const [insufficientBalanceDisable, setInsufficientBalanceDisable] = useState(false);

  // Form Schema & Instance
  const formSchema = yup.object({
    transMode: yup.string().required("Transaction mode is required"),
    refVouchNo: yup
      .string()
      .transform((value) => (value === "" ? null : value))
      .nullable()
      .test(
        "is-valid-ref-vouch-no",
        "Reference voucher number is invalid",
        (value) => {
          if (value === null) return true;
          return alphanumericWithHyphenUnderscoreRegex.test(value);
        },
      ),
    bank: yup.string().nullable(),
    savings: yup.string().nullable(),
    savingsName: yup.string().nullable(),
    savingsBalance: yup.string().nullable(),
    approveDate: yup.mixed().nullable(),
    approvedAmount: yup.mixed().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      transMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
      savingsName: "",
      savingsBalance: "",
      approveDate: "",
      approvedAmount: "",
    },
  });

  const { control } = form;
  const { transMode, savings, savingsBalance, approveDate, approvedAmount } = useWatch({ control });

  // Reset fields when transMode changes
  useEffect(() => {
    form.setValue("savings", "");
    form.setValue("bank", "");
    form.setValue("savingsName", "");
    form.setValue("savingsBalance", "");
  }, [transMode, form]);

  const setApproveDate = useCallback((val) => form.setValue("approveDate", val), [form]);
  const setApprovedAmount = useCallback((val) => form.setValue("approvedAmount", val), [form]);

  const fetchTransactionData = async (memberId) => {
    console.log("DEBUG: fetchTransactionData starting with memberId =", memberId);
    try {
      const denomRes = await getCashDenomAPI();
      if (denomRes?.message === "Data Found") {
        setCashDenomData(denomRes.details || []);
      }
      
      const bankRes = await getBankAccountAPI(orgId, branchId);
      if (bankRes?.message === "Data Found") {
        dispatch(getBankAccountData(bankRes.details || []));
      } else {
        dispatch(getBankAccountData([]));
      }

      if (memberId) {
        const ecsRes = await getDepositEcsAccountAPI(orgId, memberId);
        console.log("DEBUG: getDepositEcsAccountAPI response =", ecsRes);
        if (ecsRes?.message === "Data Found") {
          dispatch(getEcsAccountData(ecsRes.details || []));
        } else {
          dispatch(getEcsAccountData([]));
        }
      }
    } catch (error) {
      console.error("Error fetching transaction data for approval:", error);
    }
  };

  const getCheckBalanceApiCall = useCallback(async (acNo, date, organizationId) => {
    try {
      const accountNo = acNo || form.getValues("savings");
      const targetDate = date || form.getValues("approveDate") || new Date();
      const currentOrgId = organizationId || orgId;

      if (!accountNo || !targetDate) return;

      const res = await getCheckBalanceAPI(
        accountNo,
        format(new Date(targetDate), "yyyy-MM-dd"),
        currentOrgId,
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
      toast.error("Something went wrong checking savings balance");
      console.error(error);
    }
  }, [form, orgId]);

  // Watch savings changes to populate name and query balance
  useEffect(() => {
    if (savings) {
      form.setValue(
        "savingsName",
        ecsAccountData?.find(
          (account) => account?.Id?.toString() === savings.toString(),
        )?.Full_Name || "",
      );
      getCheckBalanceApiCall(savings);
    } else {
      form.setValue("savingsName", "");
      form.setValue("savingsBalance", "");
    }
  }, [savings, ecsAccountData, getCheckBalanceApiCall, form]);

  // Denominators Totals Calculation logic
  const handleInDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...inDenominators];
    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setInDenominators(newDenominators);
    }
  };

  const handleOutDenominatorChange = (event, rowIndex) => {
    const { value } = event.target;
    const newDenominators = [...outDenominators];
    if (Number(value) > -1 && /^\d*$/.test(value)) {
      newDenominators[rowIndex] = value;
      setOutDenominators(newDenominators);
    }
  };

  const calculateCashTransactionTotalAmount = (note, denominator) => {
    const parsedNote = parseFloat(note);
    const parsedDenominators = parseFloat(denominator);
    if (!isNaN(parsedNote) && !isNaN(parsedDenominators)) {
      return parsedNote * parsedDenominators;
    }
    return 0;
  };

  useEffect(() => {
    if (cashDenomData && cashDenomData.length > 0) {
      const defaultDenominators = Array(cashDenomData.length).fill("");
      setInDenominators(defaultDenominators);
      setOutDenominators(defaultDenominators);
      const defaultTotalAmounts = Array(cashDenomData.length).fill(0);
      setCashInTransactionTotal(defaultTotalAmounts);
      setCashOutTransactionTotal(defaultTotalAmounts);
    }
  }, [cashDenomData]);

  useEffect(() => {
    if (!cashDenomData || cashDenomData.length === 0) return;
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        inDenominators[index],
      ),
    );
    setCashInTransactionTotal(newTotalAmounts);
  }, [inDenominators, cashDenomData]);

  useEffect(() => {
    if (!cashDenomData || cashDenomData.length === 0) return;
    const newTotalAmounts = cashDenomData.map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        outDenominators[index],
      ),
    );
    setCashOutTransactionTotal(newTotalAmounts);
  }, [outDenominators, cashDenomData]);

  useEffect(() => {
    const newGrandTotal = cashInTransactionTotal.reduce((acc, curr) => acc + curr, 0);
    setCashInTransactionGrandTotal(newGrandTotal);
  }, [cashInTransactionTotal]);

  useEffect(() => {
    const newGrandTotal = cashOutTransactionTotal.reduce((acc, curr) => acc + curr, 0);
    setCashOutTransactionGrandTotal(newGrandTotal);
  }, [cashOutTransactionTotal]);

  useEffect(() => {
    if (!cashDenomData) return;
    let postData = cashDenomData.map((cashDenom, idx) => ({
      note_id: cashDenom.Id,
      denominator: parseInt(inDenominators[idx]) || 0,
      totalAmount: cashInTransactionTotal[idx] || 0,
    }));
    setCashInDenomArray(postData);
  }, [inDenominators, cashInTransactionTotal, cashDenomData]);

  useEffect(() => {
    if (!cashDenomData) return;
    let postData = cashDenomData.map((cashDenom, idx) => ({
      note_id: cashDenom.Id,
      denominator: parseInt(outDenominators[idx]) || 0,
      totalAmount: cashOutTransactionTotal[idx] || 0,
    }));
    setCashOutDenomArray(postData);
  }, [outDenominators, cashOutTransactionTotal, cashDenomData]);

  useEffect(() => {
    if (transMode === "savings") {
      if (
        savingsBalance &&
        approvedAmount &&
        Number(savingsBalance) >= Number(approvedAmount)
      ) {
        setInsufficientBalanceDisable(false);
      } else {
        setInsufficientBalanceDisable(true);
      }
    } else {
      setInsufficientBalanceDisable(false);
    }
  }, [transMode, savingsBalance, approvedAmount]);

  const fetchLoanList = useCallback(async () => {
    if (!orgId || !branchId) return;
    setLoading(true);
    try {
      const res = await getLoanListAPI(orgId, branchId);
      if (res?.message === "Success" || res?.status === 200) {
        setLoanList(res.details || []);
      } else {
        setLoanList([]);
      }
    } catch (error) {
      toast.error("Failed to fetch loan applications");
      setLoanList([]);
    } finally {
      setLoading(false);
    }
  }, [orgId, branchId]);

  useEffect(() => {
    fetchLoanList();
  }, [fetchLoanList]);

  const filteredList = (loanList || []).filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.Appl_No?.toLowerCase().includes(searchLower) ||
      item.Loan_CaseNo?.toLowerCase().includes(searchLower) ||
      item.Full_Name?.toLowerCase().includes(searchLower) ||
      item.Prod_Name?.toLowerCase().includes(searchLower) ||
      item.Appl_Amount?.toString().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = async (item) => {
    if (!item?.Id) return;
    setDetailsLoading(true);
    try {
      const res = await getLoanDetailsAPI(orgId, item.Id, branchId);
      if (res?.message === "Success" || res?.status === 200) {
        setSelectedApplication(res.details);
        setOpenModal(true);
        console.log("DEBUG: selectedApplication =", res.details);
        // Load bank list, cash notes, and member's ECS accounts
        fetchTransactionData(res.details.Cust_Id);
      } else {
        toast.error("Failed to load details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading application details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const onApproveReject = async (status, payloadOrRemarks) => {
    if (!selectedApplication) return;
    setLoading(true);

    let payload = {};
    if (status === 1) {
      // Collect cash details if mode is cash
      const cashDetails = cashInDenomArray.map((inItem, idx) => {
        return {
          note_id: inItem.note_id,
          in_qnty: inItem.denominator,
          out_qnty: cashOutDenomArray.filter(
            (outItem) => inItem.note_id === outItem.note_id,
          )[0]?.denominator || 0,
          tot_amount: (cashInTransactionTotal[idx] || 0) - (cashOutTransactionTotal[idx] || 0),
        };
      });

      const transValues = form.getValues();
      const formattedSancDate = payloadOrRemarks.apprv_date instanceof Date
        ? format(payloadOrRemarks.apprv_date, "yyyy-MM-dd")
        : payloadOrRemarks.apprv_date;

      payload = {
        appl_id: selectedApplication.Id,
        apprv_status: 1,
        branch_id: Number(branchId),
        fin_id: Number(finId),
        org_id: Number(orgId),
        sanc_amt: Number(payloadOrRemarks.apprv_amount),
        sanc_date: formattedSancDate,
        remarks: "",
        ref_vouch: transValues.refVouchNo || null,
        ban_id: transValues.transMode === "bank" ? transValues.bank : null,
        sb_id: transValues.transMode === "savings" ? transValues.savings : null,
        charge_data: payloadOrRemarks.charge_data || [],
        cash_details: transValues.transMode === "cash" ? cashDetails : [],
      };
    } else {
      payload = {
        appl_id: selectedApplication.Id,
        apprv_status: 2,
        branch_id: Number(branchId),
        fin_id: Number(finId),
        org_id: Number(orgId),
        sanc_amt: 0,
        sanc_date: null,
        remarks: payloadOrRemarks || "",
        ref_vouch: null,
        ban_id: null,
        sb_id: null,
        charge_data: [],
      };
    }

    try {
      const res = await LoanApprvRejectAPI(payload);
      if (res?.status === 200 || res?.message === "Success") {
        let msgText =
          status === 1 ? "Approved Successfully" : "Rejected Successfully";

        if (typeof res?.details === "string") {
          msgText = res.details;
        } else if (Array.isArray(res?.details) && res?.details.length > 0) {
          msgText = res.details[0]?.Message || msgText;
        } else if (res?.details && typeof res.details === "object") {
          msgText = res.details.Message || msgText;
        }

        setSuccessMessageText(msgText);
        setShowSuccessModal(true);
        setOpenModal(false);
        form.reset();
      } else {
        let errText = "Process Failed";
        if (typeof res?.details === "string") {
          errText = res.details;
        } else if (Array.isArray(res?.details) && res?.details.length > 0) {
          errText = res.details[0]?.Message || errText;
        } else if (res?.details && typeof res.details === "object") {
          errText = res.details.Message || errText;
        }
        toast.error(errText);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting approval decision");
    } finally {
      setLoading(false);
    }
  };

  const getDeductionListForApproval = async (prodId, approvedAmount) => {
    if (!orgId) return null;
    const formattedDate = beg_date ? format(parseDateHelper(beg_date), "yyyy-MM-dd") : null;
    const memId = selectedApplication?.Cust_Id || "";
    return await GetDeductionListAPI(
      orgId,
      prodId,
      approvedAmount,
      "2",
      "",
      memId,
      formattedDate,
    );
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessModal(false);
    setSuccessMessageText("");
    fetchLoanList();
  };

  return {
    kycList: currentItems,
    totalItems: filteredList.length,
    loading: loading || detailsLoading,
    openModal,
    setOpenModal,
    handleView,
    selectedApplication,
    onApproveReject,
    getDeductionListForApproval,
    searchTerm,
    setSearchTerm,
    currentPage,
    itemsPerPage,
    paginate,
    totalPages,
    orgId,
    branchId,
    refreshList: fetchLoanList,
    showSuccessModal,
    successMessageText,
    handleCloseSuccessMessage,
    
    // Transaction Block Hook Props
    form,
    transMode,
    savings,
    savingsBalance,
    bankAccountData,
    ecsAccountData,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    insufficientBalanceDisable,
    approveDate,
    setApproveDate,
    approvedAmount,
    setApprovedAmount,
  };
};
