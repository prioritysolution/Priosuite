"use client";
import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getStatusAccountDetailsByAccountNoAPI,
  getStatusListAPI,
  updateAccountStatusAPI,
} from "./ChangeAccountStatusApis";

export const useChangeAccountStatus = () => {
  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [getDepositLoading, setGetDepositLoading] = useState(false);
  const [updateAccountStatusLoading, setUpdateAccountStatusLoading] =
    useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);
  const [statusListData, setStatusListData] = useState([]);

  const [resetTrigger, setResetTrigger] = useState(0);

  const formSchema = yup.object({
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    accountNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    mobile: yup.string().nullable(),
    currentStatus: yup.string().nullable(),
    availableBalance: yup.string().nullable(),
    newStatus: yup.string().required("New status is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      cifNo: "",
      accountNo: "",
      memberName: "",
      gurdianName: "",
      mobile: "",
      currentStatus: "",
      availableBalance: "",
      newStatus: "",
    },
  });

  const handleSubmit = async (values) => {
    updateAccountStatusApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    getAccountDetailsByAccountNoApiCall(values);
    form.setValue("depositDate", values.date);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
    setDepositReceiptData(null);
  };

  const updateAccountStatusApiCall = async (item) => {
    setUpdateAccountStatusLoading(true);
    let data = {
      acct_id: depositProduct.Acct_Id,
      status: item?.newStatus || "",
      org_id: orgId,
    };

    try {
      const res = await updateAccountStatusAPI(data);

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
      setUpdateAccountStatusLoading(false);
    }
  };

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    setGetDepositLoading(true);

    try {
      const res = await getStatusAccountDetailsByAccountNoAPI(
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("accountNo", res.details[0].Account_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        form.setValue("currentStatus", res.details[0].Account_Status || "");
        form.setValue("availableBalance", res.details[0].Avail_Bal || "");
        setDepositProduct(res.details[0]);
        setVisibleBlock(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("accountNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("mobile", "");
        form.setValue("currentStatus", "");
        form.setValue("availableBalance", "");
        setDepositProduct(null);
        setVisibleBlock(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("accountNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("mobile", "");
      form.setValue("currentStatus", "");
      form.setValue("availableBalance", "");
      setDepositProduct(null);
      setVisibleBlock(false);
    } finally {
      setGetDepositLoading(false);
    }
  };

  const getStatusListApiCall = async () => {
    setLoading(true);

    try {
      const res = await getStatusListAPI();
      if (res.message === "Data Found") {
        setStatusListData(res.details);
      } else {
        setStatusListData([]);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setStatusListData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getDepositLoading,
    updateAccountStatusLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
    depositProduct,
    getStatusListApiCall,
    statusListData,
  };
};
