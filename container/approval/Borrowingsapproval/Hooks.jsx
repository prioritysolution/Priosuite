"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { approvalErrorText, isApiSuccess, pickApiMessage } from "@/utils/apiMessage";
import {
  BorrowingsGetListAPI,
  BorrowingsApprvRejectAPI,
} from "./BorrowingsapprovalApi";
import { GetListData, setLoading } from "./BorrowingsapprovalReducer";

export const useBorrowingsapproval = () => {
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

  const borrowingsList = useSelector(
    (state) => state.borrowingsApproval.GetListData,
  );
  const loading = useSelector((state) => state.borrowingsApproval.loading);

  const BorrowingsGetListAPICall = useCallback(async (org_id, branch_id) => {
    dispatch(setLoading(true));
    try {
      const res = await BorrowingsGetListAPI(org_id, branch_id);
      if (res?.message === "Success" || res?.status === 200) {
        dispatch(GetListData(res.details || []));
      } else {
        dispatch(GetListData([]));
      }
    } catch (error) {
      toast.error("Failed to fetch borrowings applications");
      dispatch(GetListData([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (orgId && branchId) {
      BorrowingsGetListAPICall(orgId, branchId);
    }
  }, [orgId, branchId, BorrowingsGetListAPICall]);

  const filteredList = (borrowingsList || []).filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.Type?.toLowerCase().includes(searchLower) ||
      item.Product_Name?.toLowerCase().includes(searchLower) ||
      item.Bank_Name?.toLowerCase().includes(searchLower) ||
      item.Account_No?.toLowerCase().includes(searchLower) ||
      item.Queue_No?.toString().includes(searchLower) ||
      item.Amount?.toString().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = (item) => {
    if (!item) return;
    setSelectedApplication(item);
    setOpenModal(true);
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
      const res = await BorrowingsApprvRejectAPI(payload);
      if (isApiSuccess(res)) {
        const msgText = pickApiMessage(
          res?.details,
          status === 1 ? "Approved Successfully" : "Rejected Successfully",
        );
        setSuccessMessageText(msgText);
        setShowSuccessModal(true);
        setOpenModal(false);
      } else {
        toast.error(approvalErrorText(res, "Process Failed"));
      }
    } catch (err) {
      toast.error(approvalErrorText(err, "Critical Error"));
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessModal(false);
    setSuccessMessageText("");
    if (orgId && branchId) {
      BorrowingsGetListAPICall(orgId, branchId);
    }
  };

  return {
    kycList: currentItems,
    totalItems: filteredList.length,
    loading,
    openModal,
    setOpenModal,
    handleView,
    selectedApplication,
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
  };
};
