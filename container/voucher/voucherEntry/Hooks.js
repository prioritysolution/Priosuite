"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getLedgerListData,
  getSubHeadData,
  getSubLedgerListData,
} from "./VoucherEntryReducer";
import {
  addVoucherEntryAPI,
  getSubHeadAPI,
  getVoucherLedgerListAPI,
  getVoucherSubLedgerBalanceAPI,
  getVoucherSubLedgerListAPI,
  getLedgerAcctTypeAPI,
  getLedgerMainHeadAPI,
  getLedgerSubHeadAPI,
  searchLedgerAPI,
  getLedgerAPI,
} from "./VoucherEntryApis";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
  maxTwoDecimalPlaces,
} from "@/utils/validationRegex";

export const useVoucherEntry = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");
  const beg_date = getCookieData("beg_date");

  const [tableData, setTableData] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [loading, setLoading] = useState("");
  const [postVoucherLoading, setPostVoucherLoading] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isDateChecked, setIsDateChecked] = useState(false);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const [currentSubLedgerPage, setCurrentSubLedgerPage] = useState(1);
  const [lastSubLedgerPage, setLastSubLedgerPage] = useState(1);

  const [subLedgerInput, setSubLedgerInput] = useState("");

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

  const [glData, setGlData] = useState(null);

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const subLedgerListData = useSelector(
    (state) => state?.voucherEntry?.subLedgerList,
  );

  const formSchema = useMemo(() => {
    return yup.object({
      date: yup.date().required("Voucher date is required"),
      voucherType: yup.string().required("Voucher type no is required"),
      manVoucherNo: yup
        .string()
        .transform((value) => (value === "" ? null : value)) // Convert empty strings to null
        .nullable() // Allow null values
        .test(
          "is-valid-manual-vouch-no",
          "Manual voucher no. is invalid",
          (value) => {
            if (value === null) return true; // Skip validation if value is null or empty
            return alphanumericWithHyphenUnderscoreRegex.test(value); // Validate with regex
          },
        ),
      narration: yup.string().required("Narration is required"),
      gl: yup.string().required("Gl is required"),
      ledgerCode: yup.string().required("Ledger Code is required"),
      subLedger: yup
        .string()
        .nullable()
        .test(
          "is-required-when-data-exists",
          "Sub Ledger is required",
          function (value) {
            if (subLedgerListData.length > 0) {
              return !!value; // must not be empty
            }
            return true; // not required
          },
        ),
      amount: yup
        .string()
        .required("Amount is required")
        .test(
          "is-greater-than-zero",
          "Amount must be greater than 0",
          (value) => {
            if (!value) return false; // Handle required validation
            const numberValue = parseFloat(value);
            return numberValue > 0; // Ensure value is greater than 0
          },
        )
        .test("is-valid-amount", "Invalid amount", function (value) {
          const { voucherType } = this.parent; // Access voucherType field from the same form
          if (!value) return false; // Handle required validation

          // If voucherType is "J", check for decimal number with up to 2 places
          if (voucherType === "J") {
            return maxTwoDecimalPlaces.test(value); // Validate with decimal regex
          } else {
            // For other voucher types, check for integer value (non-decimal)
            return integerRegex.test(value); // Validate as integer
          }
        })
        .test(
          "amount-less-than-balance",
          "Amount must be less than sub ledger balance",
          function (value) {
            const { subLedgerBalance, voucherType, drCr } = this.parent;
            if (["P", "J"].includes(voucherType) && drCr === "D") {
              if (
                !value ||
                subLedgerBalance === undefined ||
                subLedgerBalance === null ||
                subLedgerBalance === ""
              )
                return true;
              const balanceNum = parseFloat(subLedgerBalance);
              if (isNaN(balanceNum) || balanceNum <= 0) return true;
              return parseFloat(value) < balanceNum;
            }
            return true;
          },
        ),
      ledgerNarration: yup.string(),
      drCr: yup.string().required("Dr/Cr is required"),
      subLedgerBalance: yup.string(),
      subHead: yup.string(),
    });
  }, [subLedgerListData]);

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: new Date(),
      voucherType: "",
      manVoucherNo: "",
      narration: "",
      gl: "",
      ledgerCode: "",
      subLedger: "",
      amount: "",
      ledgerNarration: "",
      drCr: "",
      subLedgerBalance: 0,
      subHead: "",
    },
  });

  useEffect(() => {
    if (beg_date) {
      form.setValue("date", new Date(beg_date));
    }
  }, [beg_date, form]);

  const { control } = form;

  const { gl, date, subLedger, subLedgerBalance, voucherType, ledgerCode } =
    useWatch({
      control,
    });

  // Fetch GL data when ledgerCode changes
  useEffect(() => {
    const fetchGLData = async () => {
      if (ledgerCode) {
        if (!voucherType) {
          toast.error("Please select voucher type");
          return;
        }
        try {
          const res = await getLedgerAPI(orgId, voucherType, ledgerCode);
          if (
            res.message === "Data Found" &&
            res.details &&
            res.details.length > 0
          ) {
            const glInfo = res.details[0];
            setGlData(glInfo);
            form.setValue("gl", glInfo.Id);
          } else {
            setGlData(null);
            form.setValue("gl", "");
          }
        } catch (error) {
          console.error("Error fetching GL data:", error);
          setGlData(null);
          form.setValue("gl", "");
        }
      } else {
        setGlData(null);
        form.setValue("gl", "");
        dispatch(getSubLedgerListData([]));
      }
    };

    fetchGLData();
  }, [ledgerCode, voucherType, orgId, form]);

  const handleSubmit = async (values) => {
    const { date, voucherType, manVoucherNo, narration, ...rest } = values;

    const newTableData = {
      ...rest,
      subLedger: values.subLedger ? values.subLedger : null,
      subLedgerName: values.subLedger
        ? (subLedgerListData.find((ledger) => ledger.Id == values.subLedger)?.Ledger_Name ||
           subLedgerListData.find((ledger) => ledger.Id == values.subLedger)?.Full_Name ||
           "")
        : null,
      subledg_type:
        subLedgerListData.length > 0
          ? subLedgerListData.filter(
              (ledger) => ledger.Id == values.subLedger,
            )[0]?.Type
          : "",
    };
    if (voucherType === "J") {
      setTableData([...tableData, newTableData]);
      form.setValue("ledgerCode", "");
      form.setValue("gl", "");
      form.setValue("subLedger", "");
      form.setValue("amount", "");
      form.setValue("ledgerNarration", "");
      form.setValue("subLedgerBalance", "");
      form.setValue("drCr", "");
    } else {
      postNonJournalVoucherEntryApiCall(newTableData);
    }
  };

  const handleDeleteTableData = async (idx) => {
    const newTableData = tableData.filter((_, index) => index !== idx);

    setTableData(newTableData);
  };

  const handlePostVoucherEntry = async () => {
    if (
      voucherType === "J" &&
      totalCredit === totalDebit &&
      tableData &&
      tableData.length > 0
    ) {
      postJournalVoucherEntryApiCall();
    }
  };

  const handleGenerateReceipt = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setIsReceiptOpen(true);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setReceiptData(null);
  };

  const handleResetForm = () => {
    if (isDateChecked) {
      form.reset({
        date: form.getValues("date"),
      });
    } else {
      form.reset({
        date: beg_date ? new Date(beg_date) : new Date(),
      });
    }
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    setTableData([]);
  };

  const postJournalVoucherEntryApiCall = async () => {
    const cashDetails = cashInDenomArray.map((inItem, idx) => {
      return {
        note_id: inItem.note_id,
        in_qnty: inItem.denominator,
        out_qnty: cashOutDenomArray.filter(
          (outItem) => inItem.note_id === outItem.note_id,
        )[0].denominator,
        tot_amount:
          voucherType === "P"
            ? cashOutTransactionTotal[idx] - cashInTransactionTotal[idx]
            : cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
      };
    });
    let data = {
      trans_date: form.getValues("date") && format(date, "yyyy-MM-dd"),
      vouch_type: form.getValues("voucherType"),
      narration: form.getValues("narration"),
      manual_vouch_no: form.getValues("manVoucherNo"),
      amount: totalDebit || 0,
      vouch_data: tableData,
      cash_details: cashDetails,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setPostVoucherLoading(true);

    try {
      const res = await addVoucherEntryAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        handleResetForm();
        // toast.success(res.details || res.message);
      } else {
        toast.error(res.details || res.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostVoucherLoading(false);
    }
  };

  const postNonJournalVoucherEntryApiCall = async (tableData) => {
    const cashDetails = cashInDenomArray.map((inItem, idx) => {
      return {
        note_id: inItem.note_id,
        in_qnty: inItem.denominator,
        out_qnty: cashOutDenomArray.filter(
          (outItem) => inItem.note_id === outItem.note_id,
        )[0].denominator,
        tot_amount:
          voucherType === "P"
            ? cashOutTransactionTotal[idx] - cashInTransactionTotal[idx]
            : cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
      };
    });
    let data = {
      trans_date: (form.getValues("date") && format(date, "yyyy-MM-dd")) || "",
      vouch_type: form.getValues("voucherType") || "",
      narration: form.getValues("narration") || "",
      manual_vouch_no: form.getValues("manVoucherNo") || "",
      amount: form.getValues("amount") || 0,
      vouch_data: [tableData],
      cash_details: cashDetails,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setPostVoucherLoading(true);

    try {
      const res = await addVoucherEntryAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        handleResetForm();
        setReceiptData(res?.Data ? res?.Data[0] : null);
        // toast.success(res.details || res.message);
      } else {
        toast.error(res.details || res.message);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostVoucherLoading(false);
    }
  };

  const getSubHeadApiCall = async (org_id) => {
    try {
      const res = await getSubHeadAPI(org_id);
      if (res.message === "Data Found") {
        dispatch(getSubHeadData(res.details));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getSubHeadData([]));
    }
  };

  const getVoucherLedgerListApiCall = async (org_id, sub_head_id) => {
    if (!org_id || !sub_head_id) return;
    setLoading(true);

    try {
      const res = await getVoucherLedgerListAPI(org_id, sub_head_id);
      if (res.message === "Data Found") {
        dispatch(getLedgerListData(res.details));
      } else {
        dispatch(getLedgerListData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLedgerListData([]));
    } finally {
      setLoading(false);
    }
  };

  const getVoucherSubLedgerListApiCall = async (orgId, glId, page, keyword) => {
    setLoading(true);

    try {
      const res = await getVoucherSubLedgerListAPI(orgId, glId, page, keyword);
      if (res.message === "Data Found") {
        const newData =
          page === 1 ? res.data.data : [...subLedgerListData, ...res.data.data];
        dispatch(getSubLedgerListData(newData));
        setLastSubLedgerPage(res.data.last_page);
      } else {
        dispatch(getSubLedgerListData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getSubLedgerListData([]));
    } finally {
      setLoading(false);
    }
  };

  const getVoucherSubLedgerBalanceApiCall = async () => {
    setLoading(true);

    const type = subLedgerListData.find(
      (ledger) => ledger.Id == form.getValues("subLedger"),
    ).Type;

    const date = form.getValues("date")
      ? format(form.getValues("date"), "yyyy-MM-dd")
      : "";

    try {
      const res = await getVoucherSubLedgerBalanceAPI(
        orgId,
        form.getValues("subLedger"),
        type,
        date,
      );
      if (res.message === "Data Found") {
        form.setValue("subLedgerBalance", parseFloat(res.details));
      } else {
        form.setValue("subLedgerBalance", 0);
      }
    } catch (error) {
      toast.error("Something went wrong");
      form.setValue("subLedgerBalance", 0);
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

  const prevDate = useRef();
  const prevSubLedger = useRef();

  useEffect(() => {
    const currentDate = form.getValues("date");
    const currentSubLedger = form.getValues("subLedger");

    if (
      currentDate &&
      currentSubLedger &&
      (currentDate !== prevDate.current ||
        currentSubLedger !== prevSubLedger.current)
    ) {
      getVoucherSubLedgerBalanceApiCall();
    }

    prevDate.current = currentDate;
    prevSubLedger.current = currentSubLedger;
  }, [date, subLedger]);

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      let newTotalCredit = tableData
        .filter((data) => data.drCr === "C")
        .reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);

      let newTotalDebit = tableData
        .filter((data) => data.drCr === "D")
        .reduce((total, item) => total + (parseFloat(item.amount) || 0), 0);

      setTotalCredit(newTotalCredit);
      setTotalDebit(newTotalDebit);
    } else {
      setTotalCredit(0);
      setTotalDebit(0);
    }
  }, [tableData]);

  useEffect(() => {
    if (voucherType) {
      if (voucherType === "R") form.setValue("drCr", "C");
      else if (voucherType === "P") form.setValue("drCr", "D");
      else form.setValue("drCr", "");
    }
  }, [voucherType]);

  return {
    loading,
    postVoucherLoading,
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
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getVoucherLedgerListApiCall,
    subLedgerBalance,
    voucherType,
    tableData,
    totalCredit,
    totalDebit,
    handleDeleteTableData,
    handlePostVoucherEntry,
    getVoucherSubLedgerListApiCall,
    gl,
    glData,
    currentSubLedgerPage,
    setCurrentSubLedgerPage,
    lastSubLedgerPage,
    subLedgerInput,
    setSubLedgerInput,
    handleGenerateReceipt,
    isReceiptOpen,
    setIsReceiptOpen,
    receiptData,
    isDateChecked,
    setIsDateChecked,
    getSubHeadApiCall,
    handleResetForm,
  };
};

export const useLedgerSearch = () => {
  const [acctTypeOptions, setAcctTypeOptions] = useState([]);
  const [mainHeadOptions, setMainHeadOptions] = useState([]);
  const [subHeadOptions, setSubHeadOptions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const orgId = getCookieData("orgId");

  // API call to get Account Types
  const fetchAcctTypes = useCallback(async () => {
    if (!orgId) return;
    try {
      console.log("Fetching account types for orgId:", orgId);
      const res = await getLedgerAcctTypeAPI(orgId);
      console.log("Account types response:", res);
      if (res.message == "Data Found") {
        setAcctTypeOptions(res.details);
      }
    } catch (error) {
      console.error("Error fetching account types:", error);
    }
  }, [orgId]);

  // API call to get Main Heads based on Account Type
  const fetchMainHeads = useCallback(
    async (acctTypeId) => {
      if (!orgId) return;
      try {
        console.log(
          "Fetching main heads for orgId:",
          orgId,
          "acctType:",
          acctTypeId,
        );
        const res = await getLedgerMainHeadAPI(orgId, acctTypeId);
        console.log("Main heads response:", res);
        if (res.message == "Data Found") {
          setMainHeadOptions(res.details);
        }
      } catch (error) {
        console.error("Error fetching main heads:", error);
      }
    },
    [orgId],
  );

  // API call to get Sub Heads based on Main Head
  const fetchSubHeads = useCallback(
    async (mainHeadId) => {
      if (!orgId) return;
      try {
        console.log(
          "Fetching sub heads for orgId:",
          orgId,
          "mainHead:",
          mainHeadId,
        );
        const res = await getLedgerSubHeadAPI(orgId, mainHeadId);
        console.log("Sub heads response:", res);
        if (res.message == "Data Found") {
          setSubHeadOptions(res.details);
        }
      } catch (error) {
        console.error("Error fetching sub heads:", error);
      }
    },
    [orgId],
  );

  // Pagination state
  const [currentLedgerPage, setCurrentLedgerPage] = useState(1);
  const [lastLedgerPage, setLastLedgerPage] = useState(1);
  // Store last search params to allow page change re-fetch
  const lastSearchParamsRef = useRef({
    acctCat: "",
    acctHead: "",
    acctSubHead: "",
    keyword: "",
  });

  // API call to search ledgers
  const searchLedgers = useCallback(
    async (acctCat, acctHead, acctSubHead, keyword, page = 1) => {
      if (!orgId) return;
      // Save params for pagination re-use
      lastSearchParamsRef.current = { acctCat, acctHead, acctSubHead, keyword };
      setCurrentLedgerPage(page);
      setSearchLoading(true);
      try {
        console.log("Searching ledgers with params:", {
          orgId,
          acctCat,
          acctHead,
          acctSubHead,
          keyword,
          page,
        });
        const res = await searchLedgerAPI(
          orgId,
          acctCat,
          acctHead,
          acctSubHead,
          keyword,
          page,
        );
        console.log("Search ledgers response:", res);
        if (res.message == "Data Found") {
          setSearchResults(res.details);
          setLastLedgerPage(res.pagination?.total_pages ?? 1);
        } else {
          setSearchResults([]);
          setLastLedgerPage(1);
        }
      } catch (error) {
        console.error("Error searching ledgers:", error);
        setSearchResults([]);
        setLastLedgerPage(1);
      } finally {
        setSearchLoading(false);
      }
    },
    [orgId],
  );

  // Called when user clicks a page number — re-fetches with saved params
  const goToLedgerPage = useCallback(
    (page) => {
      const { acctCat, acctHead, acctSubHead, keyword } =
        lastSearchParamsRef.current;
      searchLedgers(acctCat, acctHead, acctSubHead, keyword, page);
    },
    [searchLedgers],
  );

  return {
    acctTypeOptions,
    mainHeadOptions,
    subHeadOptions,
    searchResults,
    searchLoading,
    fetchAcctTypes,
    fetchMainHeads,
    fetchSubHeads,
    searchLedgers,
    currentLedgerPage,
    lastLedgerPage,
    goToLedgerPage,
  };
};
