"use client";
import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { postUploadSpecimenAPI } from "./UploadSpecimenApis";
import { getAccountDetailsByAccountNoAPI } from "../deposit/DepositApis";
import { getSpecimenAPI } from "../withdrawn/WithdrawnApis";

export const useUploadSpecimen = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [getUploadSpecimenLoading, setGetUploadSpecimenLoading] =
    useState(false);
  const [postUploadSpecimenLoading, setPostUploadSpecimenLoading] =
    useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [visibleBlock, setVisibleBlock] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [depositProduct, setDepositProduct] = useState(null);
  const [photoLink, setPhotoLink] = useState(null);
  const [signatureLink, setSignatureLink] = useState(null);

  const formSchema = yup.object({
    memberNo: yup.string().nullable(),
    cifNo: yup.string().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    photo: yup.mixed(),
    signature: yup.mixed(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      photo: "",
      signature: "",
    },
  });

  const handleSubmit = async (values) => {
    postUploadSpecimenApiCall(values);
  };

  const handleAccountFormSubmit = (values) => {
    getAccountDetailsByAccountNoApiCall(values);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postUploadSpecimenApiCall = async (item) => {
    setPostUploadSpecimenLoading(true);

    // Create a new FormData object
    const formData = new FormData();

    formData.append("org_id", orgId);
    formData.append("branch_Id", branchId);
    formData.append("acct_Id", depositProduct.Acct_Id);

    if (item.photo) {
      formData.append("spec_image", item.photo);
    }
    if (item.signature) {
      formData.append("spec_sing", item.signature);
    }

    try {
      const res = await postUploadSpecimenAPI(formData, "multipart/form-data");

      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setResetTrigger((prev) => prev + 1);
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
      setPostUploadSpecimenLoading(false);
    }
  };

  const getSpecimenApiCall = async (orgId, acctId) => {
    setPostUploadSpecimenLoading(true);

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
      setPostUploadSpecimenLoading(false);
    }
  };

  const getAccountDetailsByAccountNoApiCall = async (item) => {
    setGetUploadSpecimenLoading(true);

    try {
      const res = await getAccountDetailsByAccountNoAPI(
        item.accountNo,
        "C",
        format(item.date, "yyyy-MM-dd"),
        orgId,
      );
      if (res.message === "Data Found") {
        form.setValue("memberNo", res.details[0].Member_No || "");
        form.setValue("cifNo", res.details[0].CIF_No || "");
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        getSpecimenApiCall(orgId, res.details[0].Acct_Id);
        setDepositProduct(res.details[0]);
        setVisibleBlock(true);
      } else {
        toast.error(res.details || res.message);
        form.setValue("memberNo", "");
        form.setValue("cifNo", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        setDepositProduct(null);
        setVisibleBlock(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberNo", "");
      form.setValue("cifNo", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      setDepositProduct(null);
      setVisibleBlock(false);
    } finally {
      setGetUploadSpecimenLoading(false);
    }
  };

  return {
    loading,
    getUploadSpecimenLoading,
    postUploadSpecimenLoading,
    form,
    handleSubmit,
    handleAccountFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    photoLink,
    signatureLink,
    resetTrigger,
  };
};
