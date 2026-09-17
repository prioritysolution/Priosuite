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
  getDepositPayoutAccountAPI,
  postDepositBulkPayoutAccountAPI,
  postDepositSinglePayoutAccountAPI,
} from "./InterestPayoutApis";
import {
  getBulkAccountData,
  getSingleAccountData,
} from "./InterestPayoutReducer";
import { useOpenDepositAccount } from "../openDepositAccount/Hooks";

export const useInterestPayout = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [postInterestPayoutLoading, setPostInterestPayoutLoading] =
    useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [disablePayoutTypeForm, setDisablePayoutTypeForm] = useState(false);
  const [showSearchAccountForm, setShowSearchAccountForm] = useState(false);
  const [showBulkAccountTable, setShowBulkAccountTable] = useState(false);

  const [accountId, setAccountId] = useState(null);
  const [singlePayoutData, setSinglePayoutData] = useState([]);
  const [bulkPayoutData, setBulkPayoutData] = useState([]);

  const [optionFormValue, setOptionFormValue] = useState(null);

  const [resetTrigger, setResetTrigger] = useState(0);

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

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const cashDenomData = useSelector(
    (state) => state?.issueMembership?.noteDenomData,
  );

  const startDate = getCookieData("fin_start_date");

  const endDate = getCookieData("fin_end_date");

  const formSchema = yup.object({
    paidDate: yup.date(),
    interestAmount: yup.string(),
    transMode: yup.string().required("Transanction mode is required"),
    refVouchNo: yup.string(),
    bank: yup.string(),
    savings: yup.string(),
  });

  const optionFormSchema = yup.object({
    payoutOn: yup.string().required("Payout on is required"),
    postingType: yup.string().required("Posting type is required"),
    payoutDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .nullable()
      .test("is-between", "Invalid date", function (value) {
        if (!value) return true;
        const maxDate =
          new Date(endDate) > new Date()
            ? format(new Date(), "yyyy-MM-dd")
            : endDate;
        return (
          format(value, "yyyy-MM-dd") >= startDate &&
          format(value, "yyyy-MM-dd") <= maxDate
        );
      }),
    month: yup.string(),
    year: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      paidDate: "",
      interestAmount: "",
      transMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
    },
  });

  const optionForm = useForm({
    resolver: yupResolver(optionFormSchema),
    defaultValues: {
      payoutOn: "fixed",
      postingType: "single",
      payoutDate: null,
      month: "",
      year: "",
    },
  });

  const { control } = form;
  const { transMode } = useWatch({ control });

  const { postingType } = useWatch({ control: optionForm.control });

  const handleSubmit = async (values) => {
    postDepositSinglePayoutAccountaApiCall(values);
  };

  const handleBulkAccountSubmit = async () => {
    postDepositBulkPayoutAccountaApiCall(optionFormValue);
  };

  const handleAccountFormSubmit = (values) => {
    if (postingType === "single") {
      getDepositPayoutSingleAccountApiCall(optionFormValue, values);
    } else {
      toast.error("Select different posting type");
    }

    form.setValue("paidDate", values.date);
  };

  const handleOptionFormSubmit = (values) => {
    if (values.postingType === "single") {
      setShowSearchAccountForm(true);
      setShowBulkAccountTable(false);
      setOptionFormValue(values);
      setDisablePayoutTypeForm(true);
    } else {
      if (values.payoutDate && values.month && values.year) {
        setShowSearchAccountForm(false);
        setShowBulkAccountTable(true);
        setOptionFormValue(values);
        form.setValue("paidDate", values.payoutDate);
        setDisablePayoutTypeForm(true);
        getDepositPayoutBulkAccountApiCall(values);
      } else {
        toast.error("Please select date , month and year.");
        setOptionFormValue(null);
        setDisablePayoutTypeForm(false);
      }
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postDepositSinglePayoutAccountaApiCall = async (item) => {
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
      trans_date: format(item.paidDate, "yyyy-MM-dd"),
      acct_id: accountId,
      payout_data: singlePayoutData,
      ref_vouch: item.refVouchNo ? item.refVouchNo : null,
      cash_details: item.transMode === "cash" ? cashDetails : [],
      sb_id: item.transMode === "savings" ? item.savings : null,
      bank_id: item.transMode === "bank" ? item.bank : null,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setPostInterestPayoutLoading(true);

    try {
      const res = await postDepositSinglePayoutAccountAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        // form.reset();
        const defaultDenominators = Array(cashDenomData.length).fill("");
        setInDenominators(defaultDenominators);
        setOutDenominators(defaultDenominators);
        // toast.success(res.details || res.message);
        setDisablePayoutTypeForm(false);
        dispatch(getSingleAccountData([]));
        setResetTrigger((prev) => prev + 1);
        optionForm.reset();
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
      setPostInterestPayoutLoading(false);
    }
  };

  const postDepositBulkPayoutAccountaApiCall = async (item) => {
    let data = {
      trans_date: format(item.payoutDate, "yyyy-MM-dd"),
      payout_data: bulkPayoutData,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
    };

    setPostInterestPayoutLoading(true);

    try {
      const res = await postDepositBulkPayoutAccountAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setDisablePayoutTypeForm(false);
        dispatch(getBulkAccountData([]));
        optionForm.reset();
        setShowBulkAccountTable(false);
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
      setPostInterestPayoutLoading(false);
    }
  };

  const getDepositPayoutBulkAccountApiCall = async (item) => {
    setLoading(true);

    const type = item.payoutOn === "fixed" ? 1 : 2;

    try {
      const res = await getDepositPayoutAccountAPI(
        null,
        null,
        item.month,
        item.year,
        1,
        type,
        orgId,
      );
      if (res.message === "Data Found") {
        dispatch(getBulkAccountData(res.details));

        setBulkPayoutData(
          res?.details?.map((item) => ({
            sch_id: item.Id,
            acct_id: item.Acct_Id,
            ecs_id: item.Ecs_Id,
            amount: item.Ins_Amount,
          })),
        );
        setVisibleBlock(true);
      } else {
        toast.error(res.details || res.message);
        dispatch(getBulkAccountData([]));
        setVisibleBlock(false);
        setAccountId(null);
        setBulkPayoutData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getBulkAccountData([]));
      setVisibleBlock(false);
      setAccountId(null);
      setBulkPayoutData([]);
    } finally {
      setLoading(false);
    }
  };

  const getDepositPayoutSingleAccountApiCall = async (
    optionFormValue,
    item,
  ) => {
    setLoading(true);

    const type = optionFormValue.payoutOn === "fixed" ? 1 : 2;

    try {
      const res = await getDepositPayoutAccountAPI(
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        optionFormValue.month,
        optionFormValue.year,
        2,
        type,
        orgId,
      );
      if (res.message === "Data Found") {
        dispatch(getSingleAccountData(res.details));

        let totalAmount = 0;
        if (res.details.length > 0) {
          totalAmount = res.details.reduce((total, item) => {
            return total + parseFloat(item.Ins_Amount);
          }, 0);
        }

        setAccountId(res.details[0].Acct_Id);
        setSinglePayoutData(
          res?.details?.map((item) => ({
            sch_id: item.Id,
            acct_id: item.Acct_Id,
            ecs_id: null,
            amount: item.Ins_Amount,
          })),
        );

        form.setValue("interestAmount", totalAmount);
        setVisibleBlock(true);
        getDepositEcsAccountApiCall(orgId, res.details[0].Mem_Id);
      } else {
        toast.error(res.details || res.message);
        dispatch(getSingleAccountData([]));
        setVisibleBlock(false);
        setAccountId(null);
        setSinglePayoutData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getSingleAccountData([]));
      setVisibleBlock(false);
      setAccountId(null);
      setSinglePayoutData([]);
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

  return {
    loading,
    postInterestPayoutLoading,
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
    handleBulkAccountSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    optionForm,
    handleOptionFormSubmit,
    showSearchAccountForm,
    showBulkAccountTable,
    disablePayoutTypeForm,
    transMode,
    postingType,
    resetTrigger,
  };
};
