"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getCheckChequeAPI,
  getSpecimenAPI,
  postWithdrawnAPI,
} from "./WithdrawnApis";
import {
  getAccountDetailsByAccountNoAPI,
  getOperateProductAPI,
} from "../deposit/DepositApis";
import { getOperateProductData } from "../deposit/DepositReducer";
import { useOpenDepositAccount } from "../openDepositAccount/Hooks";
import {
  alphanumericWithHyphenUnderscoreRegex,
  integerRegex,
  maxTwoDecimalPlaces,
} from "@/utils/validationRegex";
import { useDepositLedger } from "@/common/ledger/depositLedger/Hooks";
import convertToWords from "@/utils/numberToWords";

export const useWithdrawn = () => {
  const dispatch = useDispatch();
  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

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
    if (orgId) {
      getOperateProductAPICall(orgId, "W");
    }
  }, [orgId]);

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
  const [getWithdrawnLoading, setGetWithdrawnLoading] = useState(false);
  const [getSpecimenLoading, setGetSpecimenLoading] = useState(false);
  const [postWithdrawnLoading, setPostWithdrawnLoading] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);
  const [accountFormData, setAccountFormData] = useState(null);
  const [showLedger, setShowLedger] = useState(false);
  const [photoLink, setPhotoLink] = useState(null);
  const [signatureLink, setSignatureLink] = useState(null);

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

  const formSchema = yup.object({
    productId: yup.string().nullable(),
    memberNo: yup.string().nullable(),
    accountNo: yup.string().nullable(),
    refAcNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    mobile: yup.string().nullable(),
    panNo: yup.string().nullable(),
    operationMode: yup.string().nullable(),
    chequeFacility: yup.string().nullable(),
    lastWithdrawnDate: yup.string().nullable(),
    lastWithdrawnAmount: yup.string().nullable(),
    availableBalance: yup.string().nullable(),
    withdrawnDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    withdrawnAmount: yup
      .string()
      .test(
        "is-required-on-submit",
        "Withdrawn amount is required",
        function (value) {
          // Only validate as required when submit has been attempted
          // This prevents showing the error immediately on form load
          if (!submitAttempted) return true; // Don't validate until submit is attempted
          return value && value.trim() !== "";
        },
      )
      .test(
        "is-greater-than-zero",
        "Withdrawn amount must be greater than 0",
        (value) => {
          if (!value || value.trim() === "") return true; // Skip if empty (handled by required test)
          const numberValue = parseFloat(value);
          return numberValue > 0; // Ensure value is greater than 0
        },
      )
      .test(
        "is-valid-withdrawn-amount",
        "Invalid withdrawn amount",
        function (value) {
          if (!value || value.trim() === "") return true; // Skip validation if empty
          const { transMode } = this.parent; // Access the transMode field
          if (transMode === "cash") {
            return integerRegex.test(value); // Allow only integers for cash
          }
          return maxTwoDecimalPlaces.test(value); // Allow decimals with up to 2 decimal places otherwise
        },
      )
      .test(
        "is-less-than-balance",
        "Withdrawn amount must be less than available balance",
        function (value) {
          if (!value || value.trim() === "") return true; // Skip validation if empty
          const { availableBalance } = this.parent;
          if (!availableBalance) return true; // If no balance, skip validation
          const numberValue = parseFloat(value);
          const balanceValue = parseFloat(availableBalance);
          return numberValue < balanceValue;
        },
      ),
    instrumentNo: yup
      .string()
      .test("is-required", "Instrument no. is required", function (value) {
        const { chequeFacility } = this.parent;
        if (chequeFacility !== "Yes") return true;
        else return !!value;
      })
      .test(
        "is-greater-than-zero",
        "Instrument no. must be greater than 0",
        (value) => {
          if (!value) return true; // Required validation already handles null/empty
          const numberValue = parseFloat(value);
          return numberValue > 0; // Ensure value is greater than 0
        },
      ),
    totalWithdrawnInWords: yup.string().nullable(),
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
    bank: yup
      .string()
      .nullable()
      .test("is-required", "Bank is required", function (value) {
        const { transMode } = this.parent;
        if (transMode === "bank") return !!value;
        else return true;
      }),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    mode: "onSubmit", // Only show validation errors when form is submitted
    reValidateMode: "onSubmit", // Re-validate only when form is submitted again
    defaultValues: {
      productId: "",
      memberNo: "",
      accountNo: "",
      refAcNo: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      mobile: "",
      panNo: "",
      operationMode: "",
      chequeFacility: "",
      lastWithdrawnDate: "",
      lastWithdrawnAmount: "",
      availableBalance: "",
      withdrawnDate: "",
      withdrawnAmount: "",
      instrumentNo: "",
      joint1: "",
      joint2: "",
      transMode: "cash",
      refVouchNo: "",
    },
  });

  const { control } = form;

  const { transMode, withdrawnAmount, availableBalance } = useWatch({
    control,
  });

  const handleSubmit = async (values) => {
    setSubmitAttempted(true); // Mark that submit has been attempted
    if (values.chequeFacility === "Yes") getCheckChequeApiCall(values);
    else postWithdrawnApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    getAccountDetailsByAccountNoApiCall(values);
    form.setValue("withdrawnDate", values.date);
    if (values.productId) {
      form.setValue("productId", values.productId);
    }
    setAccountFormData(values);
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

  const handleSeeSpecimen = () => {
    getSpecimenApiCall(orgId, depositProduct.Acct_Id);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postWithdrawnApiCall = async (item) => {
    setPostWithdrawnLoading(true);

    const cashDetails = cashOutDenomArray.map((outItem, idx) => {
      return {
        note_id: outItem.note_id,
        in_qnty: outItem.denominator,
        out_qnty: cashInDenomArray.filter(
          (inItem) => outItem.note_id === inItem.note_id,
        )[0].denominator,
        tot_amount: cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
      };
    });
    let data = {
      member_id: depositProduct.Mem_Id,
      account_id: depositProduct.Acct_Id,
      trans_date: format(item.withdrawnDate, "yyyy-MM-dd"),
      pamount: item.withdrawnAmount,
      fine_amt: 0,
      Cheque_No: item.instrumentNo || null,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item?.transMode === "cash" ? cashDetails : [],
      sb_id: null,
      bank_id: item?.transMode === "bank" ? item.bank : null,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    try {
      const res = await postWithdrawnAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setSubmitAttempted(false); // Reset submit attempt after successful submission
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setResetTrigger((prev) => prev + 1);
        setShowLedger(false);
        // toast.success(res.details || res.message);
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
      setPostWithdrawnLoading(false);
    }
  };

  const getSpecimenApiCall = async (orgId, acctId) => {
    setGetSpecimenLoading(true);

    try {
      const res = await getSpecimenAPI(orgId, acctId);
      if (res.image_link) {
        setPhotoLink(res.image_link);
      } else {
        setPhotoLink(null);
      }
      if (res.sing_url) {
        setSignatureLink(res.sing_url);
      } else {
        setSignatureLink(null);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setPhotoLink(null);
      setSignatureLink(null);
    } finally {
      setGetSpecimenLoading(false);
    }
  };

  const getCheckChequeApiCall = async (values) => {
    setLoading(true);

    try {
      const res = await getCheckChequeAPI(
        orgId,
        depositProduct.Acct_Id,
        values.instrumentNo,
      );
      if (res.message === "Success") {
        postWithdrawnApiCall(values);
      } else {
        toast.error(res.details);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    console.log("getAccountDetailsByAccountNoApiCall", item);
    setGetWithdrawnLoading(true);

    try {
      const res = await getAccountDetailsByAccountNoAPI(
        item.accountNo,
        "C",
        format(item.date, "yyyy-MM-dd"),
        orgId,
        item.productId,
      );
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("accountNo", res.details[0].Account_No || "");
        form.setValue("refAcNo", res.details[0].Ref_Ac_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("panNo", res.details[0].Mem_Pan || "");
        form.setValue("operationMode", res.details[0].Oper_Mode || "");
        form.setValue("branchName", res.details[0].Branch_Name || "");
        form.setValue("BranchId", res.details[0].Branch_Id || "");
        form.setValue(
          "chequeFacility",
          res.details[0].Is_Cheque === 0 ? "No" : "Yes",
        );
        form.setValue(
          "lastWithdrawnDate",
          res.details[0].Last_Date
            ? format(res.details[0].Last_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue(
          "lastWithdrawnAmount",
          res.details[0].Last_Amt ? res.details[0].Last_Amt : "",
        );
        form.setValue("availableBalance", res.details[0].Avail_Bal || "");
        form.setValue("joint1", res.details[0].Joint_1);
        form.setValue("joint2", res.details[0].Joint_2);
        getDepositEcsAccountApiCall(orgId, res.details[0].Mem_Id);
        setDepositProduct(res.details[0]);
        getSpecimenApiCall(orgId, res.details[0].Acct_Id);
        setVisibleBlock(true);
        setShowLedger(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("accountNo", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("mobile", "");
        form.setValue("panNo", "");
        form.setValue("operationMode", "");
        form.setValue("chequeFacility", "");
        form.setValue("lastWithdrawnDate", "");
        form.setValue("lastWithdrawnAmount", "");
        form.setValue("availableBalance", "");
        form.setValue("withdrawnAmount", "");
        form.setValue("joint1", "");
        form.setValue("joint2", "");
        form.setValue("branchName", "");
        form.setValue("BranchId", "");
        setDepositProduct(null);
        setVisibleBlock(true);
        setVisibleBlock(false);
        setShowLedger(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("accountNo", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("mobile", "");
      form.setValue("panNo", "");
      form.setValue("operationMode", "");
      form.setValue("chequeFacility", "");
      form.setValue("lastWithdrawnDate", "");
      form.setValue("lastWithdrawnAmount", "");
      form.setValue("availableBalance", "");
      form.setValue("withdrawnAmount", "");
      form.setValue("joint1", "");
      form.setValue("joint2", "");
      setDepositProduct(null);
      setVisibleBlock(false);
      setShowLedger(false);
    } finally {
      setGetWithdrawnLoading(false);
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
    if (availableBalance) form.trigger("withdrawnAmount");
  }, [availableBalance, withdrawnAmount]);

  useEffect(() => {
    if (withdrawnAmount)
      form.setValue(
        "totalWithdrawnInWords",
        "Rupees " + convertToWords(Number(withdrawnAmount)) + " Only" || "",
      );
    else form.setValue("totalAmountInWords", "");
  }, [withdrawnAmount]);

  return {
    loading,
    getWithdrawnLoading,
    getSpecimenLoading,
    postWithdrawnLoading,
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
    handleSeeSpecimen,
    photoLink,
    signatureLink,
    transMode,
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
    getLedgerLoading,
  };
};
