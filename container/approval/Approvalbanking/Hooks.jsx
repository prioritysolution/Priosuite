"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
  ApprovalbankingGetDetailsAPI,
  ApprovalbankingUpdateAccountAPI,
  ApprovalbankingApprvRejectAPI,
  ApprovalbankingGetListAPI,
  getBankAccountTypeAPI,
  getBankGlAPI,
} from "./ApprovalbankingApis";
import {
  getBankAccountTypeData,
  getBankGlData,
  GetListData,
  setLoading,
} from "./ApprovalbankingReducer";

export const useApprovalbanking = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("year_id") || getCookieData("finId");

  const kycList = useSelector((state) => state.approvalbanking.GetListData);
  const loading = useSelector((state) => state.approvalbanking.loading);

  const ApprovalbankingGetListAPICall = useCallback(async (org_id, branch_id) => {
    dispatch(setLoading(true));
    try {
      const res = await ApprovalbankingGetListAPI(org_id, branch_id);
      if (res?.message === "Success" || res?.status === 200) {
        dispatch(GetListData(res.details || []));
      } else {
        dispatch(GetListData([]));
      }
    } catch (error) {
      toast.error("Failed to fetch applications");
      dispatch(GetListData([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (orgId && branchId) {
      ApprovalbankingGetListAPICall(orgId, branchId);
    }
  }, [orgId, branchId, ApprovalbankingGetListAPICall]);

  const filteredKycList = (kycList || []).filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.Type_Name?.toLowerCase().includes(searchLower) ||
      item.Bank_Name?.toLowerCase().includes(searchLower) ||
      item.Account_No?.toLowerCase().includes(searchLower) ||
      item.Queue_No?.toString().includes(searchLower) ||
      item.Amount?.toString().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKycList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKycList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = async (item) => {
    if (!item) return;

    setSelectedApplication(item);
    setOpenModal(true);

    dispatch(setLoading(true));
    try {
      const detailsRes = await ApprovalbankingGetDetailsAPI(
        orgId,
        item.Id,
        item.Type,
      );
      const detail = { ...item, ...(detailsRes?.details?.[0] || {}) };
      setSelectedApplication(detail);
    } catch (error) {
      console.error("Error fetching banking details:", error);
      toast.error("Failed to load application details");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onUpdate = async (payload) => {
    try {
      const res = await ApprovalbankingUpdateAccountAPI(payload);
      if (res?.status === 200 || res?.message === "Success") {
        toast.success(res.details || "Account Updated Successfully");
        if (orgId && branchId) {
          ApprovalbankingGetListAPICall(orgId, branchId);
        }

        try {
          const detailsRes = await ApprovalbankingGetDetailsAPI(
            orgId,
            selectedApplication.Id,
            selectedApplication.Type,
          );
          const detail = {
            ...selectedApplication,
            ...(detailsRes?.details?.[0] || {}),
          };
          setSelectedApplication(detail);
        } catch (error) {
          console.error("Error refreshing details after update:", error);
        }

        return true;
      } else {
        toast.error(res?.details || "Update Failed");
        return false;
      }
    } catch (err) {
      toast.error("Operation Failed");
      return false;
    }
  };

  const onApproveReject = async (status, remarks) => {
    if (!selectedApplication) return;
    const payload = {
      type: selectedApplication.Type,
      type_id: selectedApplication.Id,
      apprv_status: status,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      remarks: remarks || "",
    };

    try {
      const res = await ApprovalbankingApprvRejectAPI(payload);
      if (res?.status === 200 || res?.message === "Success") {
        let msgText =
          status === 1 ? "Approved Successfully" : "Rejected Successfully";

        if (typeof res?.details === "string") {
          msgText = res.details;
        } else if (Array.isArray(res?.details) && res?.details.length > 0) {
          msgText = res.details[0]?.Message || msgText;
        } else if (res?.details && typeof res.details === "object") {
          msgText = res.details.Message || msgText;
        }

        setSuccessMessageText(msgText);
        setShowSuccessModal(true);
        setOpenModal(false);
      } else {
        let errText = "Process Failed";
        if (typeof res?.details === "string") {
          errText = res.details;
        } else if (Array.isArray(res?.details) && res?.details.length > 0) {
          errText = res.details[0]?.Message || errText;
        } else if (res?.details && typeof res.details === "object") {
          errText = res.details.Message || errText;
        }
        toast.error(errText);
      }
    } catch (err) {
      toast.error("Critical Error");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessModal(false);
    setSuccessMessageText("");
    if (orgId && branchId) {
      ApprovalbankingGetListAPICall(orgId, branchId);
    }
  };

  const getBankAccountTypeApiCall = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const res = await getBankAccountTypeAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getBankAccountTypeData(res.details));
      } else {
        dispatch(getBankAccountTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getBankAccountTypeData([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [orgId, dispatch]);

  const getBankGlApiCall = useCallback(async (orgId, accountType) => {
    dispatch(setLoading(true));

    try {
      const res = await getBankGlAPI(orgId, accountType);
      if (res.message === "Data Found") {
        dispatch(getBankGlData(res.details));
      } else {
        dispatch(getBankGlData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getBankGlData([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    kycList: currentItems,
    totalItems: filteredKycList.length,
    loading,
    openModal,
    setOpenModal,
    handleView,
    selectedApplication,
    onUpdate,
    onApproveReject,
    searchTerm,
    setSearchTerm,
    currentPage,
    itemsPerPage,
    paginate,
    totalPages,
    showSuccessModal,
    successMessageText,
    handleCloseSuccessMessage,
    orgId,
    branchId,
    getBankAccountTypeApiCall,
    getBankGlApiCall,
    bankAccountTypeData: useSelector((state) => state.approvalbanking.bankAccountTypeData),
    bankGlData: useSelector((state) => state.approvalbanking.bankGlData),
  };
};
