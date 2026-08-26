"use client";
import { useState } from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { formatDateForApi } from "@/utils/dateHelpers";
import {
  getOpeningMemberDataByIdAPI,
  postOpeningMembershipAPI,
} from "./MembershipOpeningApis";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";

export const useMembershipOpening = () => {
  const startDate = getCookieData("fin_start_date");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [addOpeningLoading, setAddOpeningLoading] = useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);

  const [resetTrigger, setResetTrigger] = useState(0);

  const [memberProduct, setMemberProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const formSchema = yup.object({
    memberName: yup.string(),
    gurdianName: yup.string(),
    address: yup.string(),
    mobile: yup.string().nullable(),
    date: yup
      .date()
      .typeError("Admission date is required")
      .required("Admission date is required") // Ensures required error works
      .test("is-between", "Invalid Date", function (value) {
        if (!value) return false;
        return format(value, "yyyy-MM-dd") < startDate;
      }),
    admissionNo: yup.string(),
    ledgerFolio: yup.string(),
    memberType: yup.string().required("Member type is required"),
    nomineeName: yup.string(),
    nomineeRelation: yup.string(),
    nomineeAge: yup.string(),
    nomineeAddress: yup.string(),
    openingShare: yup
      .number()
      .nullable() // Allow null values
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      ) // Treat empty string as null
      .typeError("Opening share must be a valid number") // Show type error only when it's not a valid number
      .test(
        "is-positive",
        "Opening share must be greater than 0",
        (value) => value > 0,
      )
      .test(
        "max-two-decimals",
        "Opening share can have at most two decimal places",
        (value) => maxTwoDecimalPlaces.test(value),
      )
      .required("Opening share is required"), // Show required error when it's null or undefined
    openingDividend: yup
      .number()
      .nullable() // Allow null values
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      ) // Treat empty string as null
      .typeError("Opening dividend must be a valid number") // Show type error only when it's not a valid number
      .test(
        "is-not-negative",
        "Opening dividend cannot be negative",
        (value) => value >= 0,
      )
      .test(
        "max-two-decimals",
        "Opening dividend can have at most two decimal places",
        (value) => maxTwoDecimalPlaces.test(value),
      )
      .required("Opening dividend is required"), // Show required error when it's null or undefined
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberName: "",
      gurdianName: "",
      address: "",
      mobile: "",
      date: "",
      admissionNo: "",
      ledgerFolio: "",
      memberType: "",
      nomineeName: "",
      nomineeRelation: "",
      nomineeAge: "",
      nomineeAddress: "",
      openingShare: "",
      openingDividend: "",
    },
  });

  const handleSubmit = (values) => {
    postOpeningMembershipApiCall(values);
  };

  const handleMemberFormSubmit = (values) => {
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postOpeningMembershipApiCall = async (item) => {
    const date = new Date(startDate);

    // Subtract one day (setDate modifies the day of the month)
    date.setDate(date.getDate() - 1);

    // Format back to a string (if needed)
    const openDate = formatDateForApi(date);

    let data = {
      open_date: openDate,
      mem_id: memberProduct.Id,
      adm_no: item.admissionNo,
      adm_date: formatDateForApi(item.date),
      ledg_no: item.ledgerFolio,
      mem_type: item.memberType,
      nom_name: item.nomineeName,
      nom_rel: item.nomineeRelation,
      nom_age: item.nomineeAge,
      nom_add: item.nomineeAddress,
      open_share: item.openingShare,
      open_div: item.openingDividend,
      branch_Id: branchId,
      org_id: orgId,
    };
    setAddOpeningLoading(true);

    try {
      const res = await postOpeningMembershipAPI(data);
      if (res.message === "Success") {
        form.reset();
        setVisibleBlock(false);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        setResetTrigger((prev) => prev + 1);
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setAddOpeningLoading(false);
    }
  };

  const getMemberDataByIdApiCall = async (orgId, memberNo) => {
    setLoading(true);
    try {
      const res = await getOpeningMemberDataByIdAPI(orgId, memberNo);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        form.setValue("memberName", res.details[0].Full_Name || "");
        form.setValue("gurdianName", res.details[0].Relation_Name || "");
        form.setValue("address", res.details[0].Address || "");
        form.setValue("mobile", res.details[0].Cust_Mob || "");
        setMemberProduct(res.details[0]);
      } else {
        setVisibleBlock(false);
        form.setValue("memberName", "");
        form.setValue("gurdianName", "");
        form.setValue("address", "");
        form.setValue("mobile", "");
        setMemberProduct(null);
        toast.error(res.details);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      form.setValue("memberName", "");
      form.setValue("gurdianName", "");
      form.setValue("address", "");
      form.setValue("mobile", "");
      setMemberProduct(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addOpeningLoading,
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
