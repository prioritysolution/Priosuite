"use client";
import { useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getGlBalancingAPI } from "./BalancingApis";
import toast from "react-hot-toast";

export const useBalancing = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [asOnDate, setAsOnDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [shareList, setShareList] = useState([]);
  const [depositList, setDepositList] = useState([]);
  const [loanList, setLoanList] = useState([]);
  const [investmentList, setInvestmentList] = useState([]);
  const [borrowingsList, setBorrowingsList] = useState([]);

  const formSchema = yup.object({
    date: yup.date().required("Date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: null,
      branch: branchId,
    },
  });

  const handleSubmit = (values) => {
    getGlBalancingApiCall(values);
    setAsOnDate(format(values.date, "dd-MM-yyyy"));
  };

  const getGlBalancingApiCall = async (item) => {
    setLoading(true);

    const date = item.date && format(item.date, "yyyy-MM-dd");

    try {
      const res = await getGlBalancingAPI(orgId, item.branch, date);
      if (res.message === "Data Found") {
        setShareList(res.details["SHARE"]);
        setDepositList(res.details["DEPOSIT"]);
        setLoanList(res.details["LOAN"]);
        setInvestmentList(res.details["INVESTMENT"]);
        setBorrowingsList(res.details["BORROWINGS"]);
      } else {
        setShareList([]);
        setDepositList([]);
        setLoanList([]);
        setInvestmentList([]);
        setBorrowingsList([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setShareList([]);
      setDepositList([]);
      setLoanList([]);
      setInvestmentList([]);
      setBorrowingsList([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    form,
    handleSubmit,
    depositList,
    loanList,
    shareList,
    investmentList,
    borrowingsList,
    asOnDate,
  };
};
