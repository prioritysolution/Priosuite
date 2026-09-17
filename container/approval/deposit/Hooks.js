"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
    getDepositApprovalListAPI,
    getDepositDetailsAPI,
    postDepositApprvRejectAPI,
} from "./DepositApprovalApis";
import { setDepositList, setLoading } from "./DepositApprovalReducer";

export const useDepositApproval = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const [openModal, setOpenModal] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // New states for Success Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessageText, setSuccessMessageText] = useState("");

    const orgId = getCookieData("orgId");
    const branchId = getCookieData("userBranchId");
    const finId = getCookieData("finId");

    const depositList = useSelector(
        (state) => state.depositApproval?.depositList || []
    );
    const loading = useSelector((state) => state.depositApproval?.loading);

    const fetchDepositList = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const res = await getDepositApprovalListAPI(orgId, branchId);
            if (res?.status === 200 || res?.message === "Success") {
                dispatch(setDepositList(res.details || []));
            } else {
                dispatch(setDepositList([]));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch deposit list");
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, orgId, branchId]);

    useEffect(() => {
        if (orgId && branchId) fetchDepositList();
    }, [orgId, branchId, fetchDepositList]);

    const handleView = async (item) => {
        setSelectedDetails(null);
        setOpenModal(true);
        setDetailsLoading(true);
        try {
            const res = await getDepositDetailsAPI(item.Id, orgId);
            if (res?.status === 200 || res?.message === "Success") {
                const details = Array.isArray(res.details)
                    ? res.details[0]
                    : res.details;
                setSelectedDetails(details);
            } else {
                toast.error("Could not fetch details");
                setOpenModal(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching details");
            setOpenModal(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const onApproveReject = async (status, remarks = null) => {
        if (!selectedDetails?.Id) {
            toast.error("Invalid Application ID");
            return;
        }

        const payload = {
            vouch_id: selectedDetails.Id,
            apprv_status: status,
            branch_id: branchId,
            fin_id: finId,
            org_id: orgId,
            remarks: status === 1 ? null : remarks,
        };

        setActionLoading(true);
        try {
            const res = await postDepositApprvRejectAPI(payload);
            if (res?.status === 200 || res?.message === "Success") {
                // Set the success message from API details
                const msg = res?.details || (status === 1 ? "Approved Successfully" : "Rejected Successfully");
                setSuccessMessageText(msg);
                setShowSuccessModal(true); // Open Success Modal
                setOpenModal(false); // Close Action Modal
            } else {
                toast.error(res?.details || "Action Failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Operation Failed");
        } finally {
            setActionLoading(false);
        }
    };

    const handleApprove = () => {
        onApproveReject(1);
    };

    const handleRejectSubmit = (data) => {
        onApproveReject(2, data?.remarks);
    };

    // Close Success Modal and refresh list
    const handleCloseSuccessMessage = () => {
        setShowSuccessModal(false);
        setSuccessMessageText("");
        fetchDepositList();
    };

    const filteredList = depositList.filter((item) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            item.Appl_No?.toLowerCase().includes(searchLower) ||
            item.Particular?.toLowerCase().includes(searchLower) ||
            item.Member_Name?.toLowerCase().includes(searchLower) ||
            item.Queue_No?.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const paginate = (pageNo) => setCurrentPage(pageNo);

    return {
        depositList: filteredList.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        ),
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        totalPages,
        totalItems: filteredList.length,
        itemsPerPage,
        paginate,
        handleView,
        openModal,
        setOpenModal,
        selectedDetails,
        detailsLoading,
        handleApprove,
        handleRejectSubmit,
        actionLoading,
        showSuccessModal,
        successMessageText,
        handleCloseSuccessMessage,
    };
};