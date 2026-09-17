"use client";

import { useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { getLoanGuarantorDetailsAPI } from "./GuarantorDetailsApis";
import { useEffect } from "react";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import { useDispatch } from "react-redux";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";

export const useGuarantorDetails = () => {
  const dispatch = useDispatch();

  const {
    getMemberListDataLoading,
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

  const orgId = getCookieData("orgId");

  const [date, setDate] = useState(null);

  const [loading, setLoading] = useState(false);

  const [dialougeOpen, setDialougeOpen] = useState(false);

  const [personalData, setPersonalData] = useState(null);
  const [ownTableData, setOwnTableData] = useState([]);
  const [guarantorTableData, setGuarantorTableData] = useState([]);

  const formSchema = yup.object({
    date: yup.date().required("Date date is required"),
    memberNo: yup.string().required("Member no is required"),
    dialougeMemberName: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: null,
      memberNo: "",
      dialougeMemberName: "",
    },
  });

  const handleSubmit = (values) => {
    getLoanGuarantorDetailsDataApiCall(values);
    setDate(values.date);
  };

  const handleSearchMember = () => {
    if (form.getValues("dialougeMemberName")) {
      getMemberDataByNameApiCall(
        orgId,
        1,
        form.getValues("dialougeMemberName"),
        "A",
      );
      setCurrentMemberPage(1);
    } else toast.error("Please enter name");
  };

  const handleSelectClick = (data) => {
    form.setValue("memberNo", data.CIF_No);
    setDialougeOpen(false);
  };

  const calculateTotal = (data, field) => {
    return (
      data &&
      data.reduce((total, item) => {
        const value = item[field];
        // Convert value to number, treating null or empty as 0
        const numericValue = value ? parseFloat(value) : 0;
        return total + numericValue;
      }, 0)
    );
  };

  const totalOwnIssueAmount = calculateTotal(ownTableData, "Loan_Amount");
  const totalOwnCurrentBalance = calculateTotal(ownTableData, "Curr_Balance");
  const totalOwnCurrentInterest = calculateTotal(ownTableData, "Curr_Intt");
  const totalOwnOdBalance = calculateTotal(ownTableData, "Od_Balance");
  const totalOwnOdInterest = calculateTotal(ownTableData, "Od_Intt");
  const totalGuarantorIssueAmount = calculateTotal(
    guarantorTableData,
    "Loan_Amount",
  );
  const totalGuarantorCurrentBalance = calculateTotal(
    guarantorTableData,
    "Curr_Balance",
  );
  const totalGuarantorCurrentInterest = calculateTotal(
    guarantorTableData,
    "Curr_Intt",
  );
  const totalGuarantorOdBalance = calculateTotal(
    guarantorTableData,
    "Od_Balance",
  );
  const totalGuarantorOdInterest = calculateTotal(
    guarantorTableData,
    "Od_Intt",
  );

  const getLoanGuarantorDetailsDataApiCall = async (item) => {
    // setLoading(true);

    const date = item.date && format(item.date, "yyyy-MM-dd");

    try {
      const res = await getLoanGuarantorDetailsAPI(orgId, item.memberNo, date);

      if (res.message === "Data Found") {
        setPersonalData(res.details[0].Basic_details || null);
        setOwnTableData(res.details[0].Own_Loan || []);
        setGuarantorTableData(res.details[0].Guranteer_loan || []);
      } else {
        setPersonalData(null);
        setOwnTableData([]);
        setGuarantorTableData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setPersonalData(null);
      setOwnTableData([]);
      setGuarantorTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMemberDataByNameApiCall(
      orgId,
      currentMemberPage,
      form.getValues("dialougeMemberName"),
      "A",
    );
  }, [currentMemberPage]);

  useEffect(() => {
    dispatch(getMemberDataByName([]));
    form.setValue("dialougeMemberName", "");
  }, [dialougeOpen]);

  return {
    loading,
    getMemberListDataLoading,
    form,
    handleSubmit,
    personalData,
    ownTableData,
    guarantorTableData,
    date,
    dialougeOpen,
    setDialougeOpen,
    handleSearchMember,
    handleSelectClick,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
    totalOwnIssueAmount,
    totalOwnCurrentBalance,
    totalOwnCurrentInterest,
    totalOwnOdBalance,
    totalOwnOdInterest,
    totalGuarantorIssueAmount,
    totalGuarantorCurrentBalance,
    totalGuarantorCurrentInterest,
    totalGuarantorOdBalance,
    totalGuarantorOdInterest,
  };
};
