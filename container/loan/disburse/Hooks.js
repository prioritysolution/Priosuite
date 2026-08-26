"use client";

import { useEffect, useState, useCallback } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getDisburseListAPI,
  // getLoanDisburseNeedAmountAPI,
  // getLoanShareDepositBalanceAPI,
  postLoanDisburseAPI,
  getDeductionListAPI,
} from "./DisburseApis";
import { getDisburseData } from "./DisburseReducer";
import { useOpenDepositAccount } from "@/container/deposit/openDepositAccount/Hooks";
import { format, parse } from "date-fns";

export const useDisburse = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("finId");
  const beg_date = getCookieData("beg_date");

  const [loading, setLoading] = useState(false);
  const [getDisburseListLoading, setGetDisburseListLoading] = useState(false);
  const [postDisburseLoading, setPostDisburseLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [disburseData, setDisburseData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loanShareDepositBalanceData, setLoanShareDepositBalanceData] =
    useState(null);
  const [deductions, setDeductions] = useState([]);

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

  const { getDepositEcsAccountApiCall } = useOpenDepositAccount();

  const formSchema = yup.object({
    applicationNo: yup.string().nullable(),
    applicationDate: yup.string().nullable(),
    sanctionDate: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
    panNo: yup.string().nullable(),
    applicationAmount: yup.string().nullable(),
    accountNo: yup.string().nullable(),
    shareBalance: yup.string().nullable(),
    depositBalance: yup.string().nullable(),
    disburseDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Disburse date is required"),
    // .test(
    //   "is-after-application",
    //   "Sanction date must be between sanction date and current date",
    //   function (value) {
    //     const { sanctionDate } = this.parent;
    //     if (!sanctionDate || !value) return true; // skip if either is missing

    //     const today = new Date();
    //     today.setHours(23, 59, 59, 999);

    //     return (
    //       value >= parse(sanctionDate, "dd-MM-yyyy", new Date()) &&
    //       value <= today
    //     );
    //   },
    // ),
    disburseAmount: yup
      .string()
      .required("Disburse amount is required")
      .test(
        "max-disburse",
        "Disburse amount must be less than or equal to application amount",
        function (value) {
          const { applicationAmount } = this.parent;
          return (
            !applicationAmount ||
            !value ||
            parseFloat(value) <= parseFloat(applicationAmount)
          );
        },
      ),
    shareAmount: yup.string().nullable(),
    depositAmount: yup.string().nullable(),
    miscCharge: yup.string().nullable(),
    insuranceAmount: yup.string(),
    netDisburseAmount: yup.string(),
    transMode: yup.string().required("Transanction mode is required"),
    refVouchNo: yup.string(),
    bank: yup.string(),
    savings: yup.string(),
    bondNo: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    mode: "all",
    defaultValues: {
      applicationNo: "",
      applicationDate: "",
      sanctionDate: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      panNo: "",
      applicationAmount: "",
      accountNo:"",
      shareBalance: "",
      depositBalance: "",
      disburseDate: beg_date ? new Date(beg_date) : null,
      disburseAmount: "",
      shareAmount: "",
      depositAmount: "",
      miscCharge: "",
      insuranceAmount: "",
      netDisburseAmount: "",
      transMode: "cash",
      refVouchNo: "",
      bank: "",
      savings: "",
      bondNo: "",
    },
  });

  const { control } = form;
  const {
    transMode,
    shareBalance,
    disburseAmount,
    shareAmount,
    depositAmount,
    miscCharge,
    insuranceAmount,
    applicationAmount,
  } = useWatch({ control });

  const handleSubmit = (values) => {
    postLoanDisburseApiCall(values);
  };

  const handleOpenForm = (data) => {
    setDisburseData(data);
    getDepositEcsAccountApiCall(orgId, data.Mem_Id);
    setShowForm(true);
    // getLoanShareDepositBalanceApiCall(data);
    form.setValue("applicationNo", data.Appl_No || "");
    form.setValue(
      "applicationDate",
      data.Appl_Date ? format(new Date(data.Appl_Date), "dd-MM-yyyy") : "",
    );
    form.setValue(
      "sanctionDate",
      data.Sanc_Date ? format(new Date(data.Sanc_Date), "dd-MM-yyyy") : "",
    );
    form.setValue("memberName", data.Full_Name || "");
    form.setValue("gurdianName", data.Relation_Name || "");
    form.setValue("address", data.Address || "");
    form.setValue("mobile", data.Cust_Mob || "");
    // form.setValue("panNo", data.Mem_Pan || "");
    form.setValue("applicationAmount", data.Sanc_Amount || "");
    form.setValue("accountNo", data.Account_No || "");
    form.setValue("panNo", data.Cust_Pan || "");
    form.setValue("disburseDate", beg_date ? new Date(beg_date) : new Date());
    form.setValue("shareBalance", data.Share_Bal || "");
  };

  const handleBackToTable = () => {
    setDisburseData(null);
    setLoanShareDepositBalanceData(null);
    setDeductions([]);
    form.reset();
    const defaultDenominators = Array(cashDenomData.length).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    setShowForm(false);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setShowSuccessDialog(false);
  };

  const getDisburseListApiCall = useCallback(
    async (orgId, branchId) => {
      setGetDisburseListLoading(true);
      try {
        const res = await getDisburseListAPI(
          orgId,
          branchId,
          beg_date ? format(beg_date, "yyyy-MM-dd") : null,
        );
        if (res.message === "Data Found") {
          dispatch(getDisburseData(res.details));
        } else {
          dispatch(getDisburseData([]));
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
        dispatch(getDisburseData([]));
      } finally {
        setGetDisburseListLoading(false);
      }
    },
    [beg_date, dispatch],
  );

  const postLoanDisburseApiCall = useCallback(
    async (item) => {
      const cashDetails = cashOutDenomArray.map((outItem, idx) => {
        return {
          note_id: outItem.note_id,
          in_qnty: outItem.denominator,
          out_qnty: cashInDenomArray.filter(
            (inItem) => outItem.note_id === inItem.note_id,
          )[0].denominator,
          tot_amount:
            cashInTransactionTotal[idx] - cashOutTransactionTotal[idx],
        };
      });

      let data = {
        org_id: orgId,
        disb_date: format(item.disburseDate, "yyyy-MM-dd"),
        prod_id: disburseData.Prod_Id,
        act_id: disburseData.Id,
        mem_id: disburseData.Mem_Id,
        disb_amt: item.disburseAmount ? item.disburseAmount : 0,
        fin_id: finId,
        branch_Id: branchId,
        cash_details: item.transMode === "cash" ? cashDetails : [],
        charge_data:
          deductions && deductions.length > 0
            ? deductions.map((d) => ({
                ledg_id: d.Deduct_Gl || null,
                ded_amt: d.Charge_Amt || 0,
                ded_id: d.Id || null,
                ded_perc: d.Charg_Perc || 0,
                ded_type: d.Ded_Type || null,
              }))
            : [],
        ref_vouch: item.refVouchNo ? item.refVouchNo : null,
        sb_id: item.transMode === "savings" ? item.savings : null,
        bank_id: item.transMode === "bank" ? item.bank : null,
      };

      console.log("PostLoanDisburseApiCall=", data);

      setPostDisburseLoading(true);
      try {
        const res = await postLoanDisburseAPI(data);
        if (res.message === "Success") {
          form.reset();
          const len = cashDenomData?.length || 0;
          const defaultDenominators = Array(len).fill("");
          setInDenominators(defaultDenominators);
          setOutDenominators(defaultDenominators);
          setDisburseData(null);
          setLoanShareDepositBalanceData(null);
          setShowForm(false);
          setShowSuccessDialog(true);
          getDisburseListApiCall(orgId, branchId);
          setSuccessMessage(res.details);
        } else {
          toast.error(res.details);
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        setSuccessMessage(null);
      } finally {
        setPostDisburseLoading(false);
      }
    },
    [
      cashOutDenomArray,
      cashInDenomArray,
      cashInTransactionTotal,
      cashOutTransactionTotal,
      orgId,
      disburseData,
      finId,
      branchId,
      deductions,
      form,
      cashDenomData,
      getDisburseListApiCall,
    ],
  );

  // const getLoanShareDepositBalanceApiCall = async (item) => {
  //   setLoading(true);

  //   try {
  //     const res = await getLoanShareDepositBalanceAPI(
  //       orgId,
  //       item.Prod_Id,
  //       item.Mem_Id,
  //       format(new Date(), "yyyy-MM-dd"),
  //     );
  //     if (res.message === "Data Found") {
  //       setLoanShareDepositBalanceData(res.details[0]);
  //       form.setValue("shareBalance", res.details[0].Share_Balance || "");
  //       form.setValue("depositBalance", res.details[0].Dep_Balance || "");
  //     } else {
  //       toast.error(res.details);
  //       setLoanShareDepositBalanceData(null);
  //       form.setValue("shareBalance", "");
  //       form.setValue("depositBalance", "");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong");
  //     setLoanShareDepositBalanceData(null);
  //     form.setValue("shareBalance", "");
  //     form.setValue("depositBalance", "");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getDeductionListApiCall = useCallback(
    async (item) => {
      setLoading(true);
      try {
        const formattedDate = beg_date
          ? format(new Date(beg_date), "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");
        const res = await getDeductionListAPI(
          orgId,
          item.Prod_Id,
          form.getValues("disburseAmount"),
          "3",
          item.Share_Bal || form.getValues("shareBalance") || "0",
          item.Mem_Id,
          formattedDate,
        );
        if (res.message === "Data Found") {
          setDeductions(res.details || []);
          let shareAmt = 0;
          let depAmt = 0;
          let insAmt = 0;
          let misAmt = 0;
          let shareGl = null;
          let depGl = null;
          let misGl = null;

          (res.details || []).forEach((d) => {
            const amt = parseFloat(d.Charge_Amt || 0);
            if (d.Ded_Type === 1) {
              misAmt += amt;
              misGl = d.Deduct_Gl;
            } else if (d.Ded_Type === 2) {
              shareAmt += amt;
              shareGl = d.Deduct_Gl;
            } else if (d.Ded_Type === 3) {
              depAmt += amt;
              depGl = d.Deduct_Gl;
            } else if (d.Ded_Type === 4) {
              insAmt += amt;
            } else {
              misAmt += amt;
              misGl = d.Deduct_Gl;
            }
          });

          setLoanShareDepositBalanceData({
            Share_Gl: shareGl,
            Deposit_GL: depGl,
            Mis_Gl: misGl,
          });
        } else {
          setDeductions([]);
          toast.error(res.details || "No deductions found");
        }
      } catch (error) {
        console.error(error);
        setDeductions([]);
        toast.error("Something went wrong fetching deductions");
      } finally {
        setLoading(false);
      }
    },
    [orgId, beg_date, form],
  );

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
    const len = cashDenomData?.length || 0;
    const defaultDenominators = Array(len).fill("");
    setInDenominators(defaultDenominators);
    setOutDenominators(defaultDenominators);
    const defaultTotalAmounts = Array(len).fill(0);
    setCashInTransactionTotal(defaultTotalAmounts);
    setCashOutTransactionTotal(defaultTotalAmounts);
  }, [cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = (cashDenomData || []).map((cash, index) =>
      calculateCashTransactionTotalAmount(
        cash.Note_Value,
        inDenominators[index],
      ),
    );

    setCashInTransactionTotal(newTotalAmounts);
  }, [inDenominators, cashDenomData]);

  useEffect(() => {
    const newTotalAmounts = (cashDenomData || []).map((cash, index) =>
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
    let postData = (cashDenomData || []).map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(inDenominators[idx]) || 0,
        totalAmount: cashInTransactionTotal[idx],
      };
    });
    setCashInDenomArray(postData);
  }, [inDenominators, cashInTransactionTotal, cashDenomData]);

  useEffect(() => {
    let postData = (cashDenomData || []).map((cashDenom, idx) => {
      return {
        note_id: cashDenom.Id,
        denominator: parseInt(outDenominators[idx]) || 0,
        totalAmount: cashOutTransactionTotal[idx],
      };
    });
    setCashOutDenomArray(postData);
  }, [outDenominators, cashOutTransactionTotal, cashDenomData]);

  useEffect(() => {
    const isGreaterThanAppAmt =
      disburseAmount &&
      applicationAmount &&
      parseFloat(disburseAmount) > parseFloat(applicationAmount);

    if (disburseAmount && disburseData && orgId && !isGreaterThanAppAmt) {
      getDeductionListApiCall(disburseData);
    } else {
      setDeductions([]);
      form.setValue("shareAmount", "");
      form.setValue("depositAmount", "");
      form.setValue("insuranceAmount", "");
      form.setValue("miscCharge", "");
    }
  }, [
    disburseAmount,
    disburseData,
    orgId,
    applicationAmount,
    getDeductionListApiCall,
    form,
  ]);

  useEffect(() => {
    const totalDeductions = deductions.reduce(
      (acc, d) => acc + parseFloat(d.Charge_Amt || 0),
      0,
    );
    let amount =
      (disburseAmount ? Number(disburseAmount) : 0) - totalDeductions;
    form.setValue("netDisburseAmount", amount);
  }, [disburseAmount, deductions, form]);

  return {
    loading,
    getDisburseListLoading,
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
    getDisburseListApiCall,
    transMode,
    showForm,
    handleOpenForm,
    handleBackToTable,
    showSuccessDialog,
    postDisburseLoading,
    deductions,
  };
};
