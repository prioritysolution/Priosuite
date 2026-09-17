"use client";
import { useState } from "react";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getDepositDataByIdAPI,
  getRectifyTypeAPI,
  postDepositAPI,
} from "./DepositApis";
import { getRectifyTypeData } from "./DepositReducer";

export const useDeposit = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");

  const [resetTrigger, setResetTrigger] = useState(0);

  const [loading, setLoading] = useState(false);
  const [getDepositDataLoading, setGetDepositDataLoading] = useState(false);
  const [postDepositLoading, setPostDepositLoading] = useState(false);

  const [visibleBlock, setVisibleBlock] = useState(false);

  const [depositProduct, setDepositProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formSchema = yup.object({
    rectifyTypeId: yup.string().required("Rectify type is required"),
    depositProduct: yup.string().nullable(),
    transDate: yup.date().nullable(),
    memberName: yup.string().nullable(),
    gurdianName: yup.string().nullable(),
    accountNo: yup.string().nullable(),
    amount: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      rectifyTypeId: "",
      depositProductId: "",
      transDate: "",
      memberName: "",
      gurdianName: "",
      address: "",
      transMode: "",
      amount: "",
    },
  });

  const { rectifyTypeId, depositProductId } = form.watch();

  const handleSubmit = (values) => {
    postDepositApiCall(values);
  };

  const handleDepositFormSubmit = (values) => {
    if (rectifyTypeId) {
      if (
        (rectifyTypeId === "124" || rectifyTypeId === "127") &&
        !depositProductId
      )
        toast.error("Please select deposit product");
      else {
        const prodId =
          rectifyTypeId === "124" || rectifyTypeId === "127"
            ? depositProductId
            : null;
        getDepositDataByIdApiCall(
          orgId,
          values.accountNo,
          format(new Date(), "yyyy-MM-dd"),
          rectifyTypeId,
          prodId
        );
      }
    } else toast.error("Please select rectify type first");
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postDepositApiCall = async (item) => {
    setPostDepositLoading(true);

    let data = {
      acct_id: depositProduct.Id,
      trans_id: depositProduct.Trans_Id,
      type: item.rectifyTypeId,
      org_id: orgId,
    };
    try {
      const res = await postDepositAPI(data);
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
      setPostDepositLoading(false);
    }
  };

  const getDepositDataByIdApiCall = async (
    orgId,
    accountNo,
    date,
    type,
    prodId
  ) => {
    setGetDepositDataLoading(true);
    try {
      const res = await getDepositDataByIdAPI(
        orgId,
        accountNo,
        date,
        type,
        prodId
      );
      if (res.message === "Success") {
        setVisibleBlock(true);
        setDepositProduct(res.details[0]);
        form.setValue(
          "transDate",
          res.details[0].Opening_Date
            ? new Date(res.details[0].Opening_Date)
            : ""
        );
        form.setValue("memberName", res.details[0].Full_Name);
        form.setValue("gurdianName", res.details[0].Relation_Name);
        form.setValue("accountNo", res.details[0].Account_No);
        form.setValue("amount", res.details[0].Amount);
      } else {
        setVisibleBlock(false);
        setDepositProduct(null);
        form.setValue("transDate", "");
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("accountNo", "");
        form.setValue("amount", "");
        toast.error(res?.details);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      setDepositProduct(null);
      form.setValue("transDate", "");
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("accountNo", "");
      form.setValue("amount", "");
    } finally {
      setGetDepositDataLoading(false);
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
    getDepositDataLoading,
    postDepositLoading,
    getRectifyTypeApiCall,
    form,
    handleSubmit,
    handleDepositFormSubmit,
    visibleBlock,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    resetTrigger,
    rectifyTypeId,
  };
};
