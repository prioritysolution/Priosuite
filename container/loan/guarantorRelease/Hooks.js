"use client";
import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getGuarranterSecurityAPI,
  getLoanAccountDetailsByAccountNoAPI,
} from "../repayment/RepaymentApis";
import { deleteGuarantorAPI } from "./GuarantorReleaseApis";

export const useGuarantorRealease = () => {
  const orgId = getCookieData("orgId");

  const [loading, setLoading] = useState("");
  const [deleteGuarantorLoading, setDeleteGuarantorLoading] = useState("");
  const [visibleBlock, setVisibleBlock] = useState(false);

  const [loanProduct, setLoanProduct] = useState(null);
  const [tempDeleteGuarantor, setTempDeleteGuarantor] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [guarantorDetails, setGuarantorDetails] = useState(null);

  const formSchema = yup.object({
    accountNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    mobile: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      accountNo: "",
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
    },
  });

  const handleAccountFormSubmit = (values) => {
    getLoanAccountDetailsByAccountNoApiCall(values);
  };

  const handleShowDeleteDialog = (guarantor) => {
    setTempDeleteGuarantor(guarantor);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteGuarantorApiCall();
  };

  const handleCancelDelete = () => {
    setTempDeleteGuarantor(null);
    setShowDeleteDialog(false);
  };

  const deleteGuarantorApiCall = async () => {
    let data = {
      acct_id: loanProduct?.Acct_Id || "",
      member_id: tempDeleteGuarantor?.Id || "",
      org_id: orgId,
    };

    setDeleteGuarantorLoading(true);

    try {
      const res = await deleteGuarantorAPI(data);

      if (res.message === "Success") {
        setTempDeleteGuarantor(null);
        setShowDeleteDialog(false);
        getGuarantorApiCall(orgId, loanProduct?.Acct_Id);
        toast.success(res?.details);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeleteGuarantorLoading(false);
    }
  };

  const getLoanAccountDetailsByAccountNoApiCall = async (item) => {
    setLoading(true);

    try {
      const res = await getLoanAccountDetailsByAccountNoAPI(
        orgId,
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
      );
      if (res.message === "Data Found") {
        form.setValue("accountNo", res.details[0].Account_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Mem_Mob || "");
        getGuarantorApiCall(orgId, res.details[0].Acct_Id);
        setLoanProduct(res.details[0]);
        setVisibleBlock(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("accountNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        setLoanProduct(null);
        setVisibleBlock(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("accountNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      setLoanProduct(null);
      setVisibleBlock(false);
    } finally {
      setLoading(false);
    }
  };

  const getGuarantorApiCall = async (orgId, accountId) => {
    setLoading(true);

    try {
      const res = await getGuarranterSecurityAPI(orgId, accountId);
      if (res.message === "Data Found") {
        setGuarantorDetails(res.details?.GurrantorDetails || []);
      } else {
        setGuarantorDetails([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setGuarantorDetails([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    deleteGuarantorLoading,
    form,
    handleAccountFormSubmit,
    visibleBlock,
    guarantorDetails,
    handleShowDeleteDialog,
    handleCancelDelete,
    handleConfirmDelete,
    showDeleteDialog,
    setShowDeleteDialog,
  };
};
