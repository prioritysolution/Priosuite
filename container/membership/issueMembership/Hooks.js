"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getCashDenomAPI,
  getCheckBalanceAPI,
  getMemberDataByNameAPI,
  getMemberProductDataAPI,
  postIssueMembershipAPI,
} from "./IssueMembershipApis";
import {
  getMemberDataById,
  getMemberDataByName,
  getNoteDenomData,
} from "./IssueMembershipReducer";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";
import { getOpeningMemberDataByIdAPI } from "@/container/opening/membershipOpening/MembershipOpeningApis";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
  uptoFiveDigitRegex,
} from "@/utils/validationRegex";
import convertToWords from "@/utils/numberToWords";

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

export const useIssueMembership = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  console.log("startDate", startDate);
  console.log("endDate", endDate);

  const memberDataById = useSelector(
    (state) => state?.issueMembership?.memberDataById,
  );

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [currentMemberPage, setCurrentMemberPage] = useState(1);
  const [lastMemberPage, setLastMemberPage] = useState(1);

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const [resetTrigger, setResetTrigger] = useState(0);

  const [loading, setLoading] = useState(false);
  const [postIssueMembershipLoading, setPostIssueMembershipLoading] =
    useState(false);

  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);

  const [getMemberListDataLoading, setGetMemberListDataLoading] =
    useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [admissionDisable, setAdmissionDisable] = useState(true);
  const [insufficientBalanceDisable, setInsufficientBalanceDisable] =
    useState(false);
  const [memberProduct, setMemberProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [shareIssueReceiptData, setShareIssueReceiptData] = useState(null);

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
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    branchName: yup.string().nullable(),
    BranchId: yup.string().nullable(),
    date: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Admission date is required")
      .test("is-between", "Invalid date", function (value) {
        if (!value) return false;
        if (!startDate || !endDate) return true;

        const sDate = parseDateHelper(startDate);
        const eDate = parseDateHelper(endDate);
        
        console.log("Date Validation:", {
          startDateRaw: startDate,
          endDateRaw: endDate,
          parsedStart: sDate,
          parsedEnd: eDate,
          selectedValue: value,
        });

        if (!sDate || !eDate) return true;

        const beg_date = getCookieData("beg_date");
        const begDateParsed = parseDateHelper(beg_date);

        const today = new Date();
        const max = eDate > today ? today : eDate;
        const maxDate = (begDateParsed && !isNaN(begDateParsed.getTime()) && begDateParsed > max) ? begDateParsed : max;

        const valDate = new Date(value);
        valDate.setHours(0, 0, 0, 0);
        sDate.setHours(0, 0, 0, 0);
        maxDate.setHours(23, 59, 59, 999);

        return valDate >= sDate && valDate <= maxDate;
      }),
    admissionNo: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for not required
      .test(
        "is-valid-admissionNo",
        "Admission no. must be a number up to 5 digits and not start with 0",
        (value) => value === null || uptoFiveDigitRegex.test(value), // Validate using imported regex
      ),
    ledgerFolio: yup.string(),
    admissionFees: yup.string(),
    memberType: yup.string().required("Member type is required"),
    noOfShare: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null for handling missing fields
      .required("No. of share is required") // Required message
      .test(
        "is-integer",
        "No. of share must be an integer",
        (value) => value !== null && integerRegex.test(value), // Use regex for integer validation
      )
      .test(
        "is-greater-than-zero",
        "No. of share must be greater than 0",
        (value) => value !== null && parseInt(value, 10) > 0, // Ensure value is greater than 0
      ),
    ratePerShare: yup.string().nullable(),
    totalAmt: yup.string().nullable(),
    totalAmtInWords: yup.string().nullable(),
    nomineeName: yup.string().nullable(),
    nomineeRelation: yup.string().nullable(),
    nomineeAddress: yup.string().nullable(),
    nomineeAge: yup
      .string()
      .transform((value) => (value === "" ? null : value)) // Convert empty string to null
      .nullable() // Allow null values for non-required fields
      .test(
        "is-positive-integer",
        "Nominee age must be a positive integer greater than 0",
        (value) => {
          if (value === null) return true; // Skip validation if value is null or empty
          return integerRegex.test(value); // Use regex for validation
        },
      ),
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
    bank: yup.string().nullable(),
    savings: yup.string().nullable(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      memberId: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      date: new Date(),
      admissionNo: "",
      ledgerFolio: "",
      admissionFees: "",
      memberType: "",
      noOfShare: "",
      ratePerShare: "",
      totalAmt: "",
      nomineeName: "",
      nomineeRelation: "",
      nomineeAddress: "",
      nomineeAge: "",
      transMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
    },
  });

  const { control } = form;

  const {
    memberType,
    ratePerShare,
    admissionFees,
    noOfShare,
    transMode,
    date,
    totalAmt,
    savings,
    savingsBalance,
  } = useWatch({
    control,
  });

  const handleSubmit = (values) => {
    postIssueMembershipApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setShareIssueReceiptData(null);
  };

  const handleGenerateShareIssueReceipt = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setIsReceiptOpen(true);
  };

  const postIssueMembershipApiCall = async (item) => {
    setPostIssueMembershipLoading(true);
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
      // trans_date: item.date.toISOString().slice(0, 10),
      trans_date: format(item.date, "yyyy-MM-dd"),
      // member_id: item.memberNo,
      member_id: item.memberId,
      admm_No: item.admissionNo,
      ledg_fol: item.ledgerFolio,
      adm_fees: item.admissionFees,
      mem_type: item.memberType,
      nomin_name: item.nomineeName,
      nom_add: item.nomineeAddress,
      nom_rel: item.nomineeRelation,
      nom_age: item.nomineeAge,
      no_of_share: item.noOfShare,
      share_rate: item.ratePerShare,
      share_amt:
        item.ratePerShare &&
        item.noOfShare &&
        Number(item.ratePerShare) * Number(item.noOfShare),
      tot_amt: item.totalAmt,
      adm_gl: memberProduct[0].Admis_GL,
      share_gl: memberProduct[0].Share_GL,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item?.transMode === "cash" ? cashDetails : [],
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      sb_id: item.transMode === "savings" ? item.savings : null,
      bank_id: item.transMode === "bank" ? item.bank : null,
    };
    try {
      const res = await postIssueMembershipAPI(data);
      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setVisibleBlock(false);
        setResetTrigger((prev) => prev + 1);
        setShareIssueReceiptData(res.Data[0]);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostIssueMembershipLoading(false);
    }
  };

  const getMemberDataByIdApiCall = async (orgId, memberNo) => {
    setGetMemberDataLoading(true);
    try {
      const res = await getOpeningMemberDataByIdAPI(orgId, memberNo);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        dispatch(getMemberDataById(res.details[0]));
        form.setValue("memberNo", res.details[0].Cust_No || "");
        form.setValue("memberId", res.details[0].Id || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Cust_Mob || "");
        form.setValue("branchName", res.details[0].Branch_Name || "");
        form.setValue("BranchId", res.details[0].Branch_Id || "");
        getDepositEcsAccountApiCall(orgId, res.details[0].Id);
      } else {
        setVisibleBlock(false);
        form.setValue("memberNo", "");
        form.setValue("memberId", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("branchName", "");
        form.setValue("BranchId", "");
        toast.error(res.details);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("memberId", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("branchName", "");
      form.setValue("BranchId", "");
    } finally {
      setGetMemberDataLoading(false);
    }
  };

  const getMemberDataByNameApiCall = async (orgId, page, name, type = "A") => {
    console.log("getMemberDataByNameApiCall=", {
      orgId,
      page,
      name: name,
      type: type,
    });

    setGetMemberListDataLoading(true);
    try {
      const res = await getMemberDataByNameAPI(orgId, page, name, type);

      console.log("getMemberDataByNameApiCall res=", res);

      if (res && res.message === "Data Found" && res.data) {
        dispatch(getMemberDataByName(res.data.data || []));
        setLastMemberPage(res.data.last_page || 1);
      } else {
        dispatch(getMemberDataByName([]));
        setLastMemberPage(1);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getMemberDataByName([]));
      setLastMemberPage(1);
    } finally {
      setGetMemberListDataLoading(false);
    }
  };

  const getMemberProductDataApiCall = async (orgId, typeId, memberNo) => {
    setLoading(true);
    try {
      const res = await getMemberProductDataAPI(orgId, typeId, memberNo);
      if (res.message === "Data Found") {
        setAdmissionDisable(false);
        setMemberProduct(res.details);
        form.setValue("admissionFees", res.details[0].Adm_Amt);
        form.setValue("ratePerShare", res.details[0].Share_Amt);
      } else {
        setAdmissionDisable(true);
        setMemberProduct(null);
        form.setValue("admissionFees", "");
        form.setValue("ratePerShare", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setMemberProduct(null);
      setAdmissionDisable(true);
      form.setValue("admissionFees", "");
      form.setValue("ratePerShare", "");
    } finally {
      setLoading(false);
    }
  };

  const getCheckBalanceApiCall = async () => {
    setLoading(true);

    try {
      const res = await getCheckBalanceAPI(
        form.getValues("savings"),
        format(form.getValues("date"), "yyyy-MM-dd"),
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

  //note denom get api call
  const getNoteDenomApiCall = async () => {
    setLoading(true);
    try {
      const res = await getCashDenomAPI();
      if (res.message === "Data Found") {
        dispatch(getNoteDenomData(res.details));
      } else {
        dispatch(getNoteDenomData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getNoteDenomData([]));
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

  useEffect(() => {
    if (memberType && memberDataById)
      getMemberProductDataApiCall(orgId, memberType, memberDataById.Id);
  }, [memberType, memberDataById]);

  useEffect(() => {
    if (ratePerShare && admissionFees && noOfShare) {
      let total =
        Number(admissionFees) + Number(ratePerShare) * Number(noOfShare);
      form.setValue("totalAmt", total);
      form.setValue(
        "totalAmtInWords",
        "Rupees " + convertToWords(total) + " Only" || "",
      );
    } else {
      form.setValue("totalAmt", "");
      form.setValue("totalAmtInWords", "");
    }
  }, [ratePerShare, admissionFees, noOfShare]);

  const prevSavings = useRef();
  const prevDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("date");

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
  }, [savings, date]);

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
        totalAmt &&
        Number(savingsBalance) >= Number(totalAmt)
      )
        setInsufficientBalanceDisable(false);
      else setInsufficientBalanceDisable(true);
    } else {
      setInsufficientBalanceDisable(false);
    }
  }, [transMode, savingsBalance, totalAmt]);

  useEffect(() => {
    if (startDate && endDate) {
      const sDate = parseDateHelper(startDate);
      const eDate = parseDateHelper(endDate);
      if (sDate && eDate) {
        const currentDate = form.getValues("date");
        const parsedCurrent = parseDateHelper(currentDate);

        const beg_date = getCookieData("beg_date");
        const begDateParsed = parseDateHelper(beg_date);

        const today = new Date();
        const max = eDate > today ? today : eDate;
        const maxDate = (begDateParsed && !isNaN(begDateParsed.getTime()) && begDateParsed > max) ? begDateParsed : max;

        if (parsedCurrent) {
          parsedCurrent.setHours(0, 0, 0, 0);
          sDate.setHours(0, 0, 0, 0);
          maxDate.setHours(23, 59, 59, 999);
          if (parsedCurrent < sDate || parsedCurrent > maxDate) {
            form.setValue("date", maxDate);
          }
        } else {
          form.setValue("date", maxDate);
        }
      }
    }
  }, [startDate, endDate]);

  return {
    loading,
    getMemberListDataLoading,
    getMemberDataLoading,
    postIssueMembershipLoading,
    cashDenomData,
    inDenominators,
    outDenominators,
    cashInTransactionTotal,
    cashOutTransactionTotal,
    cashInTransactionGrandTotal,
    cashOutTransactionGrandTotal,
    getNoteDenomApiCall,
    handleInDenominatorChange,
    handleOutDenominatorChange,
    form,
    handleSubmit,
    getMemberDataByIdApiCall,
    getMemberDataByNameApiCall,
    handleMemberFormSubmit,
    visibleBlock,
    admissionDisable,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    transMode,
    insufficientBalanceDisable,
    resetTrigger,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
    resetTrigger,
    isReceiptOpen,
    setIsReceiptOpen,
    shareIssueReceiptData,
    handleGenerateShareIssueReceipt,
  };
};
