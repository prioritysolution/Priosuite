"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { approvalErrorText, isApiSuccess, pickApiMessage } from "@/utils/apiMessage";
import {
  VoucherGetListAPI,
  VoucherGetDetailsAPI,
  VoucherApprvRejectAPI,
} from "./VoucherapprovaApi";
import { GetListData, setLoading } from "./VoucherapprovaReducer";

export const useVoucherapprova = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");
  const finId = getCookieData("year_id") || getCookieData("finId");

  const voucherList = useSelector(
    (state) => state.voucherApproval.GetListData,
  );
  const loading = useSelector((state) => state.voucherApproval.loading);

  const VoucherGetListAPICall = useCallback(async (org_id, branch_id) => {
    dispatch(setLoading(true));
    try {
      const res = await VoucherGetListAPI(org_id, branch_id);
      if (res?.message === "Success" || res?.status === 200) {
        dispatch(GetListData(res.details || []));
      } else {
        dispatch(GetListData([]));
      }
    } catch (error) {
      toast.error("Failed to fetch voucher list");
      dispatch(GetListData([]));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (orgId && branchId) {
      VoucherGetListAPICall(orgId, branchId);
    }
  }, [orgId, branchId, VoucherGetListAPICall]);

  const filteredList = (voucherList || []).filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.Queue_No?.toString().toLowerCase().includes(searchLower) ||
      item.Trans_Date?.toString().toLowerCase().includes(searchLower) ||
      item.Type?.toString().toLowerCase().includes(searchLower) ||
      item.Particular?.toString().toLowerCase().includes(searchLower) ||
      item.Amount?.toString().toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = async (item) => {
    if (!item) return;
    setSelectedApplication(item);
    setOpenModal(true);
    setDetailsLoading(true);
    setSelectedDetails(null);
    try {
      const res = await VoucherGetDetailsAPI(orgId, item.Id);
      if (res?.status === true || res?.message === "Data Found") {
        setSelectedDetails(res.details || null);
      } else {
        toast.error("Voucher details not found");
      }
    } catch (err) {
      toast.error("Failed to fetch voucher details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const onApproveReject = async (status, remarks) => {
    if (!selectedApplication) return;
    const payload = {
      vouch_id: selectedApplication.Id,
      apprv_status: status,
      branch_id: branchId,
      fin_id: finId,
      org_id: orgId,
      remarks: remarks || "",
    };

    try {
      const res = await VoucherApprvRejectAPI(payload);
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
      VoucherGetListAPICall(orgId, branchId);
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
    selectedDetails,
    detailsLoading,
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
