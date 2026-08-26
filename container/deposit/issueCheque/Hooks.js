"use client";
import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getChequeAccountDetailsByAccountNoAPI,
  postIssueChequeAPI,
} from "./IssueChequeApi";
import { useEffect } from "react";
import convertToWords from "@/utils/numberToWords";

export const useIssueCheque = () => {
  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [getAccountLoading, setGetAccountLoading] = useState(false);
  const [postIssueChequeLoading, setPostIssueChequeLoading] = useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);
  const [issueDate, setIssueDate] = useState(null);

  const [resetTrigger, setResetTrigger] = useState(0);

  const formSchema = yup.object({
    accountNo: yup.string().nullable(),
    refAccountNo: yup.string().nullable(),
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    guardianName: yup.string().nullable(),
    mobile: yup.string().nullable(),
    availableBalance: yup.string().nullable(),
    operationMode: yup.string().nullable(),
    fromNo: yup
      .string()
      .required("From no. is required")
      .test("is-greater", "From No. must be greater than 0.", function (value) {
        if (!value) return true; // avoid error on type issues, let yup handle that
        return Number(value) > 0;
      }),
    toNo: yup
      .string()
      .required("To no. is required")
      .test(
        "is-greater",
        "To no. must be greater than From no.",
        function (value) {
          const { fromNo } = this.parent;
          if (!value || !fromNo) return true; // avoid error on type issues, let yup handle that
          return Number(value) > Number(fromNo);
        },
      ),
    noOfLeaves: yup.string().nullable(),
    chargeAmount: yup.string().nullable(),
    amountInWords: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountNo: "",
      refAccountNo: "",
      memberNo: "",
      cifNo: "",
      memberName: "",
      guardianName: "",
      mobile: "",
      availableBalance: "",
      operationMode: "",
      fromNo: "",
      toNo: "",
      noOfLeaves: "",
      chargeAmount: "",
      amountInWords: "",
    },
  });

  const { control } = form;

  const { fromNo, toNo, chargeAmount } = useWatch({ control });

  const handleSubmit = async (values) => {
    postIssueChequeApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    getAccountDetailsByAccountNoApiCall(values);
    setIssueDate(values.date);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postIssueChequeApiCall = async (item) => {
    setPostIssueChequeLoading(true);

    let data = {
      issue_date: issueDate ? format(issueDate, "yyyy-MM-dd") : "",
      acct_id: depositProduct?.Acct_Id || "",
      frm_no: item.fromNo || "",
      to_no: item.toNo || "",
      amount: item.chargeAmount || 0,
      org_id: orgId,
      fin_id: finId,
      branch_id: branchId,
    };

    try {
      const res = await postIssueChequeAPI(data);

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
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
      setPostIssueChequeLoading(false);
    }
  };

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    setGetAccountLoading(true);

    try {
      const res = await getChequeAccountDetailsByAccountNoAPI(
        orgId,
        format(item.date, "yyyy-MM-dd"),
        item.accountNo,
      );
      if (res.message === "Data Found") {
        form.setValue("accountNo", res.details[0].Account_No || "");
        form.setValue("refAccountNo", res.details[0].Ref_Ac_No || "");
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("guardianName", res.details[0].Relation_Name || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("availableBalance", res.details[0].Avail_Bal || "");
        form.setValue("operationMode", res.details[0].Oper_Mode || "");
        setDepositProduct(res.details[0]);
        setVisibleBlock(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("accountNo", "");
        form.setValue("refAccountNo", "");
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("guardianName", "");
        form.setValue("mobile", "");
        form.setValue("availableBalance", "");
        form.setValue("operationMode", "");
        setDepositProduct(null);
        setVisibleBlock(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      toast.error(res.details || res.message);
      form.setValue("accountNo", "");
      form.setValue("refAccountNo", "");
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("guardianName", "");
      form.setValue("mobile", "");
      form.setValue("availableBalance", "");
      form.setValue("operationMode", "");
      setDepositProduct(null);
      setVisibleBlock(false);
    } finally {
      setGetAccountLoading(false);
    }
  };

  useEffect(() => {
    if (!fromNo || !toNo) form.setValue("noOfLeaves", "");
    else
      form.setValue(
        "noOfLeaves",
        (Number(toNo) || 0) - (Number(fromNo) || 0) + 1,
      );
  }, [fromNo, toNo]);

  useEffect(() => {
    if (!!chargeAmount)
      form.setValue(
        "amountInWords",
        "Rupees " + convertToWords(Number(chargeAmount)) + " Only",
      );
    else form.setValue("amountInWords", "");
  }, [chargeAmount]);

  return {
    loading,
    getAccountLoading,
    postIssueChequeLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
  };
};
