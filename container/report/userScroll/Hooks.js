"use client";
import { useState } from "react";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getScrollUserListAPI, getUserScrollAPI } from "./UserScrollApis";
import toast from "react-hot-toast";

export const useUserScroll = () => {
  const branchId = getCookieData("userBranchId");
  const orgId = getCookieData("orgId");

  const [asOnDate, setAsOnDate] = useState(null);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState("");

  const [reportData, setReportData] = useState([]);

  const [userList, setUserList] = useState([]);

  const formSchema = yup.object({
    date: yup.date().required("Date is required"),
    branch: yup.string().required("Branch is required"),
    user: yup.string().required("User is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: null,
      branch: branchId,
      user: "",
    },
  });

  const handleSubmit = (values) => {
    getUserScrollApiCall(values);
    setAsOnDate(format(values.date, "dd-MM-yyyy"));
    setUser(
      userList.find((user) => user.Id.toString() === values.user).User_Name ||
        "",
    );
  };

  const getUserScrollApiCall = async (item) => {
    setLoading(true);

    const date = item.date && format(item.date, "yyyy-MM-dd");

    try {
      const res = await getUserScrollAPI(orgId, item.branch, date, item.user);
      if (res.message === "Data Found") {
        setReportData(res.data);
      } else {
        setReportData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);

      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const getScrollUserListApiCall = async (orgId, branchId) => {
    setLoading(true);

    try {
      const res = await getScrollUserListAPI(orgId, branchId);
      if (res.message === "Data Found") {
        setUserList(res.details);
      } else {
        setUserList([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setUserList([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getScrollUserListApiCall,
    form,
    handleSubmit,
    userList,
    reportData,
    asOnDate,
    user,
  };
};
