"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { getShareIssueDataByIdAPI } from "../shareIssue/ShareIssueApis";
import { postMembershipWithdrawAPI } from "./MemberShipWithdrawApis";
import { format } from "date-fns";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";
import { useShareLedger } from "@/common/ledger/shareLedger/Hooks";
import { alphanumericWithHyphenUnderscoreRegex } from "@/utils/validationRegex";

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

export const useMembershipWithdrawn = () => {
  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const {
    loading: getLedgerLoading,
    showLedger: showLedgerDialog,
    setShowLedger: setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalIssue,
    userName,
    currentDate,
    currentTime,
    getShareLedgerHeaderApiCall,
    getShareLedgerDataApiCall,
    fromDate,
  } = useShareLedger();

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const [resetTrigger, setResetTrigger] = useState(0);

  const [loading, setLoading] = useState(false);
  const [postMembershipWithdrawnLoading, setPostMembershipWithdrawnLoading] =
    useState(false);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);

  const [showLedger, setShowLedger] = useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [memberProduct, setMemberProduct] = useState(null);
  const [transferMember, setTransferMember] = useState(null);
  const [transferList, setTransferList] = useState([]);
  const [transferSearchLoading, setTransferSearchLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
    nomineeName: yup.string().nullable(),
    nomineeRelation: yup.string().nullable(),
    nomineeAge: yup.string().nullable(),
    date: yup
      .date()
      .test(
        "is-between",
        "Date must be between financial start and end date",
        function (value) {
          if (!value) return false;
          if (!startDate || !endDate) return true;
          const sDate = parseDateHelper(startDate);
          const eDate = parseDateHelper(endDate);
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
        },
      ),
    ledgerFolio: yup.string().nullable(),
    shareBalance: yup.string().nullable(),
    divBalance: yup.string().nullable(),
    reason: yup.string().required("Withdraw reason is required"),
    transMode: yup.string().required("Transanction mode is required"),
    refVouchNo: yup
      .string()
      .transform((value) => (value === "" ? null : value))
      .nullable()
      .when("transMode", {
        is: "bank",
        then: (schema) =>
          schema
            .required("Reference voucher number is required")
            .test(
              "is-valid-ref-vouch-no",
              "Reference voucher number is invalid",
              (value) =>
                value != null &&
                alphanumericWithHyphenUnderscoreRegex.test(value),
            ),
        otherwise: (schema) =>
          schema.test(
            "is-valid-ref-vouch-no",
            "Reference voucher number is invalid",
            (value) => {
              if (value == null) return true;
              return alphanumericWithHyphenUnderscoreRegex.test(value);
            },
          ),
      }),
    bank: yup.string().when("transMode", {
      is: "bank",
      then: (schema) => schema.required("Bank is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    savings: yup.string().when("transMode", {
      is: "savings",
      then: (schema) => schema.required("Savings is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    savingsName: yup.string(),
    transferAmount: yup.string().nullable(),
    transferMemberNo: yup.string(),
    transferMemberName: yup.string(),
    transferCifNo: yup.string(),
    transferShareId: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      nomineeName: "",
      nomineeRelation: "",
      nomineeAge: "",
      date: null,
      ledgerFolio: "",
      shareBalance: "",
      divBalance: "",
      reason: "",
      refundAmt: "",
      transMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
      savingsName: "",
      transferAmount: "",
      transferMemberNo: "",
      transferMemberName: "",
      transferCifNo: "",
      transferShareId: "",
    },
  });

  const { control } = form;

  const {
    transMode,
    date,
    savings,
    bank,
    refVouchNo,
    shareBalance,
    divBalance,
  } = useWatch({ control });

  const handleSubmit = (values) => {
    if (values.transMode === "transfer") {
      const total = transferList.reduce(
        (sum, row) => sum + Number(row.trf_amount || 0),
        0,
      );
      if (!transferList.length) {
        toast.error("Add at least one transfer");
        return;
      }
      if (total > Number(values.shareBalance || 0)) {
        toast.error("Total transfer amount cannot exceed share balance");
        return;
      }
    }
    postMembershipWithdrawApiCall(values);
  };

  const handleTransferMemberSearch = async (values) => {
    const currentDate = form.getValues("date");
    if (!currentDate) {
      toast.error("Select transaction date first");
      return;
    }

    setTransferSearchLoading(true);
    try {
      const res = await getShareIssueDataByIdAPI(
        orgId,
        values.memberNo,
        format(currentDate, "yyyy-MM-dd"),
      );
      if (res.message === "Data Found") {
        const member = res.details[0];
        if (!member?.Share_Id) {
          setTransferMember(null);
          toast.error("Share account not found for this member");
          return;
        }
        if (
          memberProduct?.Share_Id &&
          String(member.Share_Id) === String(memberProduct.Share_Id)
        ) {
          setTransferMember(null);
          toast.error("Cannot transfer to the same member");
          return;
        }
        setTransferMember(member);
        form.setValue("transferMemberNo", member.Cust_No || "");
        form.setValue("transferMemberName", member.Full_Name || "");
        form.setValue("transferCifNo", member.CIF_No || "");
        form.setValue("transferShareId", String(member.Share_Id || ""));
        form.setValue("transferAmount", "");
      } else {
        setTransferMember(null);
        form.setValue("transferMemberNo", "");
        form.setValue("transferMemberName", "");
        form.setValue("transferCifNo", "");
        form.setValue("transferShareId", "");
        toast.error(res.details || res.message);
      }
    } catch (error) {
      console.error(error);
      setTransferMember(null);
      toast.error("Something went wrong");
    } finally {
      setTransferSearchLoading(false);
    }
  };

  const handleAddTransfer = () => {
    if (!transferMember?.Share_Id) {
      toast.error("Search a member first");
      return;
    }

    const rawAmount = String(form.getValues("transferAmount") ?? "").trim();
    if (!rawAmount) {
      form.setError("transferAmount", {
        type: "required",
        message: "Transfer amount is required",
      });
      return;
    }

    const amount = Number(rawAmount);
    const balance = Number(shareBalance || 0);
    if (!amount || amount <= 0) {
      form.setError("transferAmount", {
        type: "required",
        message: "Enter a transfer amount greater than 0",
      });
      return;
    }
    form.clearErrors("transferAmount");
    if (amount > balance) {
      toast.error("Transfer amount cannot exceed share balance");
      return;
    }

    const used = transferList.reduce(
      (sum, row) => sum + Number(row.trf_amount || 0),
      0,
    );
    if (used + amount > balance) {
      toast.error("Total transfer amount cannot exceed share balance");
      return;
    }
    if (
      transferList.some(
        (row) => String(row.sh_acct_id) === String(transferMember.Share_Id),
      )
    ) {
      toast.error("This member is already added");
      return;
    }

    setTransferList((prev) => [
      ...prev,
      {
        sh_acct_id: transferMember.Share_Id,
        trf_amount: amount,
        memberNo: transferMember.Cust_No || "",
        memberName: transferMember.Full_Name || "",
        cifNo: transferMember.CIF_No || "",
      },
    ]);
    setTransferMember(null);
    form.setValue("transferMemberNo", "");
    form.setValue("transferMemberName", "");
    form.setValue("transferCifNo", "");
    form.setValue("transferShareId", "");
    form.setValue("transferAmount", "");
    form.clearErrors("transferAmount");
  };

  const handleRemoveTransfer = (shareId) => {
    setTransferList((prev) =>
      prev.filter((row) => String(row.sh_acct_id) !== String(shareId)),
    );
  };

  const handleMemberFormSubmit = (values) => {
    form.setValue("date", values.date);

    getMembershipWithdrawDataByIdApiCall(
      orgId,
      values.memberNo,
      format(values.date, "yyyy-MM-dd"),
    );
  };

  // console.log("memberProduct=", memberProduct, "date=", date);

  const handleShowLedger = () => {
    const currentDate = form.getValues("date");
    console.log(
      "handleShowLedger called, memberProduct=",
      memberProduct,
      "currentDate=",
      currentDate,
    );
    if (memberProduct && memberProduct.Share_Id && currentDate) {
      console.log("Condition passed, calling APIs");
      getShareLedgerHeaderApiCall(memberProduct.Share_Id, currentDate);
      setShowLedgerDialog(true);
    } else {
      console.log("Condition failed");
      toast.error("Select member and date first");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postMembershipWithdrawApiCall = async (item) => {
    setPostMembershipWithdrawnLoading(true);
    const cashDetails = cashDenomData.map((note, idx) => {
      return {
        note_id: note.Id,
        in_qnty: inDenominators[idx] || 0,
        out_qnty: outDenominators[idx] || 0,
        tot_amount:
          (Number(outDenominators[idx] || 0) -
            Number(inDenominators[idx] || 0)) *
          note.Note_Value,
      };
    });
    let data = {
      trans_date: format(item.date, "yyyy-MM-dd"),
      share_id: memberProduct.Share_Id,
      mem_id: memberProduct.Id,
      share_gl: memberProduct.Share_Gl,
      dividend_gl: memberProduct.Div_Gl,
      ledg_fol: item.ledgerFolio,
      share_amt: item.shareBalance,
      dividend_amt: item.divBalance,
      tot_amt:
        item.shareBalance && item.divBalance
          ? Number(item.shareBalance) + Number(item.divBalance)
          : null,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      sb_id: item.transMode === "savings" ? item.savings || null : null,
      bank_id: item.transMode === "bank" ? item.bank || null : null,
      share_trf_details:
        item.transMode === "transfer"
          ? transferList.map((row) => ({
              sh_acct_id: row.sh_acct_id,
              trf_amount: row.trf_amount,
            }))
          : [],
    };
    try {
      const res = await postMembershipWithdrawAPI(data);
      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setResetTrigger((prev) => prev + 1);
        setTransferMember(null);
        setTransferList([]);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostMembershipWithdrawnLoading(false);
    }
  };

  const getMembershipWithdrawDataByIdApiCall = async (
    orgId,
    memberId,
    date,
  ) => {
    setGetMemberDataLoading(true);
    try {
      const res = await getShareIssueDataByIdAPI(orgId, memberId, date);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        setMemberProduct(res.details[0]);
        form.setValue("memberNo", res.details[0].Cust_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("branchName", res.details[0].Branch_Name || "");
        form.setValue("BranchId", res.details[0].Branch_Id || "");
        form.setValue("nomineeName", res.details[0].Nom_Name || "");
        form.setValue("nomineeRelation", res.details[0].Nom_Rel || "");
        form.setValue("nomineeAge", res.details[0].Nom_Age || "");
        form.setValue("shareBalance", res.details[0].Balance || "0");
        form.setValue("divBalance", res.details[0].Div_Bal || "0");
        form.setValue("ledgerFolio", res.details[0].Ledg_fol || "");
        getDepositEcsAccountApiCall(orgId, res.details[0].Id);
        setShowLedger(true);
        setTransferMember(null);
        setTransferList([]);
      } else {
        setVisibleBlock(false);
        setMemberProduct(null);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("branchName", "");
        form.setValue("BranchId", "");
        form.setValue("nomineeName", "");
        form.setValue("nomineeRelation", "");
        form.setValue("nomineeAge", "");
        form.setValue("shareBalance", "");
        form.setValue("divBalance", "");
        form.setValue("ledgerFolio", "");
        toast.error(res.details);
        setShowLedger(false);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      setMemberProduct(null);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("branchName", "");
      form.setValue("BranchId", "");
      form.setValue("nomineeName", "");
      form.setValue("nomineeRelation", "");
      form.setValue("nomineeAge", "");
      form.setValue("shareBalance", "");
      form.setValue("divBalance", "");
      form.setValue("ledgerFolio", "");
      setShowLedger(false);
    } finally {
      setGetMemberDataLoading(false);
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
    if (savings)
      form.setValue(
        "savingsName",
        savingsAccountData?.find(
          (account) => String(account?.Id) === String(savings),
        )?.Full_Name || "",
      );
    else form.setValue("savingsName", "");
  }, [savings, savingsAccountData, form]);

  const errors = form.formState.errors;
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Membership Withdrawn Form Validation Errors:", errors);
      const firstError = Object.values(errors)[0];
      if (firstError && firstError.message) {
        toast.error(`Validation Error: ${firstError.message}`);
      }
    }
  }, [errors]);

  return {
    savings,
    bank,
    refVouchNo,
    shareBalance,
    divBalance,
    loading,
    getMemberDataLoading,
    postMembershipWithdrawnLoading,
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
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    transMode,
    transferMember,
    transferList,
    transferSearchLoading,
    handleTransferMemberSearch,
    handleAddTransfer,
    handleRemoveTransfer,
    handleShowLedger,
    showLedger,
    setShowLedger,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalRefund,
    totalIssue,
    userName,
    currentDate,
    currentTime,
    fromDate,
    getLedgerLoading,
    resetTrigger,
  };
};
