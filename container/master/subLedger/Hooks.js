"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { getSubLedgerData, getSubLedgerHeadData } from "./SubLedgerReducer";
import {
  getSubLedgerAPI,
  getSubLedgerHeadAPI,
  postSubLedgerAPI,
  updateSubLedgerAPI,
} from "./SubLedgerApis";

export const useSubLedger = () => {
  const dispatch = useDispatch();
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [getLoading, setGetLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [openDialouge, setOpenDialouge] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [subLedgerInput, setSubLedgerInput] = useState("");

  const [editData, setEditData] = useState(null);

  const formSchema = yup.object({
    ledgerName: yup.string().required("Ledger name is required"),
    underHead: yup.string().required("Head is required"),
    openingBalance: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      ledgerName: "",
      underHead: "",
      openingBalance: "",
    },
  });

  const handleSubmit = (values) => {
    if (editData && Object.keys(editData).length > 0) {
      putSubLedgerApiCall(editData.Id, orgId, values);
    } else {
      postSubLedgerApiCall(orgId, values);
    }
  };

  const handleEditData = (data) => {
    setEditData(data);
    setOpenDialouge(true);
  };

  const postSubLedgerApiCall = async (orgId, item) => {
    let data = {
      ledger_name: item.ledgerName || "",
      under_head: item.underHead || "",
      open_balance: item.openingBalance || "0",
      branch_id: branchId,
      org_id: orgId,
    };
    setPostLoading(true);
    try {
      const res = await postSubLedgerAPI(data);
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset();
        setOpenDialouge(false);
        getSubLedgerApiCall(orgId, branchId, "TABLE", currentPage, "");
      } else toast.error(res.details);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setPostLoading(false);
    }
  };

  const putSubLedgerApiCall = async (subLedgerId, orgId, item) => {
    let data = {
      ledger_id: subLedgerId,
      ledger_name: item.ledgerName || "",
      under_head: item.underHead || "",
      open_balance: item.openingBalance || "",
      branch_id: branchId,
      org_id: orgId,
    };
    setUpdateLoading(true);
    try {
      const res = await updateSubLedgerAPI(data);
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset();
        setOpenDialouge(false);
        getSubLedgerApiCall(orgId, branchId, "TABLE", currentPage, "");
      } else toast.error(res.details);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setUpdateLoading(false);
    }
  };

  const getSubLedgerApiCall = async (orgId, branchId, type, page, keyword) => {
    setGetLoading(true);

    try {
      const res = await getSubLedgerAPI(orgId, branchId, page, keyword);
      if (res.message === "Data Found") {
        const newData =
          page === 1 || type === "TABLE"
            ? res.details.data
            : [...subLedgerListData, ...res.details.data];
        dispatch(getSubLedgerData(newData));
        setLastPage(res?.details?.last_page);
      } else {
        dispatch(getSubLedgerData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getSubLedgerData([]));
    } finally {
      setGetLoading(false);
    }
  };

  const getSubLedgerHeadApiCall = async () => {
    setGetLoading(true);

    try {
      const res = await getSubLedgerHeadAPI();
      if (res.message === "Data Found") {
        dispatch(getSubLedgerHeadData(res.details));
      } else {
        dispatch(getSubLedgerHeadData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getSubLedgerHeadData([]));
    } finally {
      setGetLoading(false);
    }
  };

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        ledgerName: editData.Ledger_Name || "",
        underHead: editData.Under_Head?.toString() || "",
        openingBalance: editData.Open_Balance || "",
      });
    } else {
      form.reset({
        ledgerName: "",
        underHead: "",
        openingBalance: "",
      });
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (!openDialouge) {
      setEditData(null);
      form.reset();
    }
  }, [openDialouge]);

  return {
    getLoading,
    postLoading,
    updateLoading,
    openDialouge,
    setOpenDialouge,
    form,
    handleSubmit,
    getSubLedgerApiCall,
    getSubLedgerHeadApiCall,
    editData,
    handleEditData,
    currentPage,
    setCurrentPage,
    lastPage,
    subLedgerInput,
    setSubLedgerInput,
  };
};
