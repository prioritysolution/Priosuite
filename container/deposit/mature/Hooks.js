"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parse } from "date-fns";
import {
  getDepositCloseAccountAPI,
  getDepositMatureAccountAPI,
  getDepositMaturityBonusInterestAPI,
  getDepositMaturityInterestAPI,
  getSavingsAccountListAPI,
  postDepositCloseAccountAPI,
  postDepositMatureAccountAPI,
  getCalClosingInterestAPI,
} from "./MatureApis";
import { getSpecimenAPI } from "../withdrawn/WithdrawnApis";
import {
  getAccountDetailsByAccountNoAPI,
  getOperateProductAPI,
} from "../deposit/DepositApis";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import { getSearchAccountData } from "../deposit/DepositReducer";
import { useOpenDepositAccount } from "../openDepositAccount/Hooks";
import { getCheckBalanceAPI } from "@/container/membership/issueMembership/IssueMembershipApis";
import { getOperateProductData } from "./MatureReducer";
import { useDepositLedger } from "@/common/ledger/depositLedger/Hooks";

export const useMature = () => {
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
    fromDate,
  } = useDepositLedger();

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const [loading, setLoading] = useState(false);
  const [getSpecimenLoading, setGetSpecimenLoading] = useState(false);
  const [getMatureLoading, setGetMatureLoading] = useState(false);
  const [postMatureLoading, setPostMatureLoading] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [activeTab, setActiveTab] = useState("memberNo");

  const [currentSavingsPage, setCurrentSavingsPage] = useState(1);
  const [lastSavingsPage, setLastSavingsPage] = useState(1);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);
  const [accountFormData, setAccountFormData] = useState(null);
  const [showLedger, setShowLedger] = useState(false);
  const [photoLink, setPhotoLink] = useState(null);
  const [signatureLink, setSignatureLink] = useState(null);
  const [disableOperationTypeForm, setDisableOperationTypeForm] =
    useState(false);
  const [showSearchAccountForm, setShowSearchAccountForm] = useState(false);
  const [dialougeOpen, setDialougeOpen] = useState(false);
  const [savingsAccountFullName, setSavingsAccountFullName] = useState(null);
  const [savingsAccountBalance, setSavingsAccountBalance] = useState(null);
  const [showMatureDialog, setShowMatureDialog] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [showPayoutInterestDialog, setShowPayoutInterestDialog] =
    useState(false);

  const [bonusInterestInput, setBonusInterestInput] = useState(false);
  const [isInterestCalculated, setIsInterestCalculated] = useState(false);

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
    refAcNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    mobile: yup.string().nullable(),
    panNo: yup.string().nullable(),
    rateOfInterest: yup.string().nullable(),
    maturityDate: yup.string().nullable(),
    maturityAmount: yup.string().nullable(),
    availableBalance: yup.string().nullable(),
    closeDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    amount: yup.string().nullable(),
    interest: yup.string().nullable(),
    bonusInterest: yup.string(),
    totalAmount: yup.string(),
    Joint_1: yup.string(),
    Joint_2: yup.string(),
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
    savingsAccountType: yup.string(),
    savingsAccountNo: yup.string(),
    savingsAccountId: yup.string(),
    savings: yup.string(),
    savingsName: yup.string(),
    savingsBalance: yup.string(),
    findAmount: yup.string(),
  });

  const optionFormSchema = yup.object({
    operationType: yup.string().required("Operation type is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productId: "",
      memberNo: "",
      cifNo: "",
      refAcNo: "",
      memberName: "",
      gurdianName: "",
      mobile: "",
      panNo: "",
      rateOfInterest: "",
      maturityDate: "",
      maturityAmount: "",
      availableBalance: "",
      closeDate: null,
      amount: "",
      interest: "",
      bonusInterest: "",
      totalAmount: "",
      Joint_1: "",
      Joint_2: "",
      transMode: "cash",
      refVouchNo: "",
      savingsAccountType: "own",
      savings: "",
      savingsAccountNo: "",
      savingsAccountId: "",
      savingsName: "",
      savingsBalance: "",
      findAmount: "",
    },
  });

  const optionForm = useForm({
    resolver: yupResolver(optionFormSchema),
    defaultValues: {
      operationType: "close",
    },
  });

  const { control } = form;
  const {
    transMode,
    amount,
    interest,
    bonusInterest,
    savings,
    maturityDate,
    closeDate,
    savingsAccountType,
    findAmount,
  } = useWatch({ control });

  const { operationType } = useWatch({ control: optionForm.control });

  const getOperateProductAPICall = async (orgId, screen) => {
    console.log("getOperateProductAPICall screen=", screen);
    try {
      const res = await getOperateProductAPI(orgId, screen);
      console.log("getOperateProductAPICall res=", res);
      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(getOperateProductData(res.details));
      }
    } catch (error) {
      console.error(error);
      dispatch(getOperateProductData([]));
    }
  };

  useEffect(() => {
    if (orgId && operationType === "close") {
      getOperateProductAPICall(orgId, "C");
    } else if (orgId && operationType === "mature") {
      getOperateProductAPICall(orgId, "M");
    }
  }, [orgId, operationType]);

  const handleSubmit = async (values) => {
    console.log("handleSubmit", values);
    operationType === "close"
      ? postDepositCloseAccountApiCall(values)
      : postDepositMatureAccountApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    if (operationType === "close") {
      getAccountDetailsByAccountNoApiCall(values);
    } else {
      getMatureAccountDetailsByAccountNoApiCall(values);
    }
    form.setValue("closeDate", values.date);
    if (values.productId) {
      form.setValue("productId", values.productId);
    }
    setAccountFormData(values);
  };

  const handleOptionFormSubmit = () => {
    setShowSearchAccountForm(true);
    setDisableOperationTypeForm(true);
    if (operationType === "close") form.setValue("savingsAccountType", "other");
    else form.setValue("savingsAccountType", "own");
  };

  const handleSeeSpecimen = () => {
    getSpecimenApiCall(orgId, depositProduct.Acct_Id);
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
        form.getValues("closeDate"),
      );
    } else {
      toast.error("Enter a valid account number.");
    }
  };

  const handleCancelPremature = () => {
    form.reset();
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    setShowMatureDialog(false);
    setVisibleBlock(false);
    setIsInterestCalculated(false);
    setShowLedger(false);
    setAccountFormData(null);
  };

  const handleResetOperation = () => {
    console.log("handleResetOperation triggered!");
    optionForm.reset({ operationType: "close" });
    form.reset();
    setIsInterestCalculated(false);
    const defaultDenominators = Array(cashDenomData?.length || 0).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    setDisableOperationTypeForm(false);
    setShowSearchAccountForm(false);
    setVisibleBlock(false);
    setShowLedger(false);
    setDepositProduct(null);
    setAccountFormData(null);
    console.log("disableOperationTypeForm set to false");
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
  };

  const getCalClosingInterestApiCall = async () => {
    setLoading(true);
    try {
      const res = await getCalClosingInterestAPI(
        orgId,
        depositProduct.Acct_Id,
        format(form.getValues("closeDate"), "yyyy-MM-dd"),
      );
      if (res.message === "Data Found") {
        form.setValue("interest", res.details);
        setIsInterestCalculated(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("interest", "");
        setIsInterestCalculated(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("interest", "");
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateMaturityInterest = () => {
    if (optionForm.getValues("operationType") === "mature") {
      if (
        format(form.getValues("closeDate"), "yyyy-MM-dd") <
        depositProduct.Maturity_Date
      ) {
        setShowPayoutInterestDialog(true);
      } else {
        setShowBonusDialog(true);
        getDepositMaturityInterestApiCall(null);
      }
    } else if (optionForm.getValues("operationType") === "close") {
      getCalClosingInterestApiCall();
    }
  };

  const postDepositCloseAccountApiCall = async (item) => {
    console.log("postDepositCloseAccountApiCall", item);
    setPostMatureLoading(true);
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
      trans_date: format(item.closeDate, "yyyy-MM-dd"),
      intt_amt: item.interest || 0,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      sb_id:
        item.transMode === "savings"
          ? item.savingsAccountType === "own"
            ? item.savings || null
            : item.savingsAccountId || null
          : null,
      bank_id: item.transMode === "bank" ? item.bank || null : null,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      prod_id: item.productId ? item.productId : 0,
    };

    try {
      const res = await postDepositCloseAccountAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        optionForm.reset();
        form.reset();
        setIsInterestCalculated(false);
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        // toast.success(res.details || res.message);
        setDisableOperationTypeForm(false);
        setShowSearchAccountForm(false);
        setResetTrigger((prev) => prev + 1);
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
      setPostMatureLoading(false);
    }
  };

  const postDepositMatureAccountApiCall = async (item) => {
    

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
      trans_date: format(item.closeDate, "yyyy-MM-dd"),
      account_id: depositProduct.Acct_Id,
      member_id: depositProduct.Mem_Id,
      principal_amt: item.amount,
      intt_amt: item.interest,
      bonus_amt: item.bonusInterest || 0,
      bonus_rate: bonusInterestInput || 0,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      sb_id:
        item.transMode === "savings"
          ? item.savingsAccountType === "own"
            ? item.savings || null
            : item.savingsAccountId || null
          : null,
      bank_id: item.transMode === "bank" ? item.bank || null : null,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      prod_id: item.productId ? item.productId : 0,
      fine_amt: item.findAmount || 0,
    };

  

    setLoading(true);

    try {
      const res = await postDepositMatureAccountAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        optionForm.reset();
        form.reset();
        setIsInterestCalculated(false);
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        // toast.success(res.details || res.message);
        setDisableOperationTypeForm(false);
        setShowSearchAccountForm(false);
        setResetTrigger((prev) => prev + 1);
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
      setLoading(false);
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
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setPhotoLink(null);
      setSignatureLink(null);
    } finally {
      setGetSpecimenLoading(false);
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

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    setGetMatureLoading(true);

    try {
      const res = await getDepositCloseAccountAPI(
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        orgId,
        item.productId || 0,
      );
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("refAcNo", res.details[0].Ref_Ac_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("panNo", res.details[0].Mem_Pan || "");
        form.setValue("rateOfInterest", res.details[0].ROI || "");
        form.setValue("availableBalance", res.details[0].Avail_Bal || "");
        form.setValue("amount", res.details[0].Avail_Bal || "");
        form.setValue("joint1", res.details[0].Joint_1);
        form.setValue("joint2", res.details[0].Joint_2);
        form.setValue("interest", "");
        form.setValue("bonusInterest", "");
        setIsInterestCalculated(false);

        getDepositEcsAccountApiCall(orgId, res.details[0].Mem_Id);

        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        setDepositProduct(res.details[0]);
        setVisibleBlock(true);
        setShowLedger(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("refAcNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("mobile", "");
        form.setValue("panNo", "");
        form.setValue("rateOfInterest", "");
        form.setValue("availableBalance", "");
        form.setValue("amount", "");
        form.setValue("joint1", "");
        form.setValue("joint2", "");
        form.setValue("interest", "");
        form.setValue("bonusInterest", "");
        setDepositProduct(null);
        setVisibleBlock(false);
        setShowLedger(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("refAcNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("mobile", "");
      form.setValue("panNo", "");
      form.setValue("rateOfInterest", "");
      form.setValue("availableBalance", "");
      form.setValue("amount", "");
      form.setValue("joint1", "");
      form.setValue("joint2", "");
      form.setValue("interest", "");
      form.setValue("bonusInterest", "");
      setDepositProduct(null);
      setVisibleBlock(false);
      setShowLedger(false);
    } finally {
      setGetMatureLoading(false);
    }
  };

  const getMatureAccountDetailsByAccountNoApiCall = async (item) => {
    setGetMatureLoading(true);

    try {
      const res = await getDepositMatureAccountAPI(
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        orgId,
        item.productId || 0,
      );
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("refAcNo", res.details[0].Ref_Ac_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("panNo", res.details[0].Mem_Pan || "");
        form.setValue("rateOfInterest", res.details[0].ROI || "");
        form.setValue(
          "maturityDate",
          res.details[0].Maturity_Date
            ? format(res.details[0].Maturity_Date, "dd-MM-yyyy")
            : "",
        );
        form.setValue("maturityAmount", res.details[0].Maturity_Amount || "");
        form.setValue("availableBalance", res.details[0].Avail_Bal || "");
        form.setValue("amount", res.details[0].Avail_Bal || "");
        form.setValue("joint1", res.details[0].Joint_1);
        form.setValue("joint2", res.details[0].Joint_2);
        form.setValue("interest", "");
        form.setValue("bonusInterest", "");
        setIsInterestCalculated(false);
        getDepositEcsAccountApiCall(orgId, res.details[0].Mem_Id);

        if (res.details[0].Maturity_Date > format(item.date, "yyyy-MM-dd")) {
          setShowMatureDialog(true);
        }

        setDepositProduct(res.details[0]);
        setVisibleBlock(true);
        setShowLedger(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("refAcNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("mobile", "");
        form.setValue("panNo", "");
        form.setValue("rateOfInterest", "");
        form.setValue("maturityDate", "");
        form.setValue("maturityAmount", "");
        form.setValue("availableBalance", "");
        form.setValue("amount", "");
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
      form.setValue("refAcNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("mobile", "");
      form.setValue("panNo", "");
      form.setValue("rateOfInterest", "");
      form.setValue("maturityDate", "");
      form.setValue("maturityAmount", "");
      form.setValue("availableBalance", "");
      form.setValue("amount", "");
      form.setValue("joint1", "");
      form.setValue("joint2", "");
      setDepositProduct(null);
      setVisibleBlock(false);
      setShowLedger(false);
    } finally {
      setGetMatureLoading(false);
    }
  };

  const getDepositMaturityInterestApiCall = async (value) => {
    setLoading(true);

    try {
      const res = await getDepositMaturityInterestAPI(
        depositProduct.Acct_Id,
        format(form.getValues("closeDate"), "yyyy-MM-dd"),
        value || null,
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("interest", res.details);
        setShowPayoutInterestDialog(false);
        setIsInterestCalculated(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("interest", "");
        setIsInterestCalculated(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("interest", "");
    } finally {
      setLoading(false);
    }
  };

  const getDepositMaturityBonusInterestApiCall = async (roi) => {
    setLoading(true);

    try {
      const res = await getDepositMaturityBonusInterestAPI(
        depositProduct.Acct_Id,
        format(form.getValues("closeDate"), "yyyy-MM-dd"),
        roi || 0,
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("bonusInterest", res.details);
        setShowBonusDialog(false);
        setBonusInterestInput(roi);
      } else {
        toast.error(res.details || res.message);
        form.setValue("bonusInterest", "");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("bonusInterest", "");
    } finally {
      setLoading(false);
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

  const getCheckBalanceApiCall = async () => {
    setLoading(true);

    const postDate =
      optionForm.getValues("operationType") === "close"
        ? form.getValues("closeDate")
          ? format(form.getValues("closeDate"), "yyyy-MM-dd")
          : null
        : form.getValues("maturityDate")
          ? format(
              parse(form.getValues("maturityDate"), "dd-MM-yyyy", new Date()),
              "yyyy-MM-dd",
            )
          : null;

    try {
      const res = await getCheckBalanceAPI(
        form.getValues("savings"),
        postDate,
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
    let totalAmount =
      (amount ? Number(amount) : 0) +
      (interest ? Number(interest) : 0) +
      (bonusInterest ? Number(bonusInterest) : 0);
    if (optionForm.getValues("operationType") === "mature") {
      totalAmount = totalAmount - (findAmount ? Number(findAmount) : 0);
    }
    form.setValue("totalAmount", totalAmount);
  }, [amount, interest, bonusInterest, findAmount]);

  const prevSavings = useRef();
  const prevDate = useRef();
  const prevCloseDate = useRef();

  useEffect(() => {
    const currentSavings = form.getValues("savings");
    const currentDate = form.getValues("maturityDate");
    const currentCloseDate = form.getValues("closeDate");

    if (
      currentSavings &&
      (currentDate || currentCloseDate) &&
      (currentSavings !== prevSavings.current ||
        currentDate !== prevDate.current ||
        currentCloseDate !== prevCloseDate.current)
    ) {
      getCheckBalanceApiCall();
    }

    prevSavings.current = currentSavings;
    prevDate.current = currentDate;
    prevCloseDate.current = currentCloseDate;
  }, [savings, maturityDate, closeDate]);

  useEffect(() => {
    if (interest) form.trigger("interest");
  }, [interest]);

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
    form.setValue("savingsName", "");
    form.setValue("savingsBalance", "");
    form.setValue("savingsAccountId", "");
    form.setValue("savingsAccountNo", "");
    setSavingsAccountFullName("");
    setSavingsAccountBalance("");
  }, [savingsAccountType]);

  return {
    loading,
    getMatureLoading,
    getSpecimenLoading,
    postMatureLoading,
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
    handleSeeSpecimen,
    photoLink,
    signatureLink,
    optionForm,
    handleOptionFormSubmit,
    showSearchAccountForm,
    disableOperationTypeForm,
    transMode,
    showMatureDialog,
    setShowMatureDialog,
    handleCancelPremature,
    handleResetOperation,
    handleCalculateMaturityInterest,
    isInterestCalculated,
    getDepositMaturityInterestApiCall,
    getDepositMaturityBonusInterestApiCall,
    showBonusDialog,
    setShowBonusDialog,
    showPayoutInterestDialog,
    setShowPayoutInterestDialog,
    resetTrigger,
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
    getLedgerLoading,
  };
};
