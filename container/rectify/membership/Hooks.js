"use client";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getMembershipDataByIdAPI,
  getRectifyTypeAPI,
  postMembershipAPI,
} from "./MembershipApis";
import { getRectifyTypeData } from "./MembershipReducer";

export const useMembership = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  const [resetTrigger, setResetTrigger] = useState(0);

  const [loading, setLoading] = useState(false);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);
  const [postMembershipLoading, setPostMembershipLoading] = useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);

  const [memberProduct, setMemberProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formSchema = yup.object({
    rectifyTypeId: yup.string().required("Rectify type is required"),
    memberNo: yup.string().nullable(),
    transDate: yup.date().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    address: yup.string().nullable(),
    transMode: yup.string().nullable(),
    amount: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      rectifyTypeId: "",
      memberNo: "",
      transDate: "",
      memberName: "",
      gurdianName: "",
      address: "",
      transMode: "",
      amount: "",
    },
  });

  const { rectifyTypeId, transDate } = form.watch();

  const handleSubmit = (values) => {
    postMembershipApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    if (rectifyTypeId)
      getMembershipDataByIdApiCall(
        orgId,
        values.memberNo,
        format(new Date(), "yyyy-MM-dd"),
        rectifyTypeId
      );
    else toast.error("Please select rectify type first");
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postMembershipApiCall = async (item) => {
    setPostMembershipLoading(true);

    let data = {
      mem_id: memberProduct.Id,
      trans_id: memberProduct.Trans_Id,
      type: item.rectifyTypeId,
      org_id: orgId,
    };
    try {
      const res = await postMembershipAPI(data);
      if (res.message === "Success") {
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setResetTrigger((prev) => prev + 1);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setPostMembershipLoading(false);
    }
  };

  const getMembershipDataByIdApiCall = async (orgId, memberNo, date, type) => {
    setGetMemberDataLoading(true);
    try {
      const res = await getMembershipDataByIdAPI(orgId, memberNo, date, type);
      if (res.message === "Success") {
        setVisibleBlock(true);
        setMemberProduct(res.details[0]);
        form.setValue(
          "transDate",
          res.details[0].Adm_Date ? new Date(res.details[0].Adm_Date) : ""
        );
        form.setValue("memberName", res.details[0].Full_Name);
        form.setValue("gurdianName", res.details[0].Relation_Name);
        form.setValue("address", res.details[0].Address);
        form.setValue("transMode", res.details[0].Trans_Mode);
        form.setValue("amount", res.details[0].Amount);
      } else {
        setVisibleBlock(false);
        setMemberProduct(null);
        form.setValue("transDate", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        form.setValue("transMode", "");
        form.setValue("amount", "");
        toast.error(res?.details);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      setMemberProduct(null);
      form.setValue("transDate", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      form.setValue("transMode", "");
      form.setValue("amount", "");
    } finally {
      setGetMemberDataLoading(false);
    }
  };

  const getRectifyTypeApiCall = async () => {
    setLoading(true);

    try {
      const res = await getRectifyTypeAPI();
      if (res.message === "Data Found") {
        dispatch(getRectifyTypeData(res.details));
      } else {
        dispatch(getRectifyTypeData([]));
        toast.error(res.details || res.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getRectifyTypeData([]));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getMemberDataLoading,
    postMembershipLoading,
    getRectifyTypeApiCall,
    form,
    handleSubmit,
    handleMemberFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
  };
};
