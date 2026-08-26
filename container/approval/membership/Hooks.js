"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
    getMembershipApprovalListAPI,
    getMembershipDetailsAPI,
    postMembershipApproveRejectAPI,
} from "./MembershipApis";
import { getMembershipList, setLoading } from "./MembershipReducer";

export const useMembershipApproval = () => {
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // New states for Success Modal
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessageText, setSuccessMessageText] = useState("");

    const orgId = getCookieData("orgId");
    const branchId = getCookieData("userBranchId");
    const finId = getCookieData("finId");

    const membershipList = useSelector(
        (state) => state.membershipApproval.membershipList
    );
    const loading = useSelector((state) => state.membershipApproval.loading);

    const form = useForm({
        defaultValues: {},
        mode: "onChange",
    });

    const fetchMembershipList = useCallback(async () => {
        if (!orgId || !branchId) return;
        dispatch(setLoading(true));
        try {
            const res = await getMembershipApprovalListAPI(orgId, branchId);
            if (res?.message === "Success" || res?.status === 200) {
                dispatch(getMembershipList(res.details || []));
            } else {
                dispatch(getMembershipList([]));
            }
        } catch (error) {
            toast.error("Failed to fetch data");
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch, orgId, branchId]);

    useEffect(() => {
        fetchMembershipList();
    }, [orgId, branchId, fetchMembershipList]);

    const filteredList = membershipList.filter((item) => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            item.Particular?.toLowerCase().includes(searchLower) ||
            item.Vouch_Type?.toLowerCase().includes(searchLower) ||
            item.Queue_No?.toString().includes(searchLower) ||
            item.Entred_By?.toLowerCase().includes(searchLower)
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

        try {
            const res = await getMembershipDetailsAPI(item.Id, orgId);
            if (res?.message === "Success" || res?.status === 200) {
                const details = Array.isArray(res.details) && res.details.length > 0
                    ? res.details[0]
                    : {};
                setSelectedApplication(prev => ({ ...prev, ...details }));
            } else {
                console.warn("Detail fetch warning:", res);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error fetching details");
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
            remarks: remarks || null,
        };

        try {
            const res = await postMembershipApproveRejectAPI(payload);
            if (res?.status === 200 || res?.message === "Success") {
                // Set the success message from API details
                const msg = res?.details || (status === 1 ? "Approved Successfully" : "Rejected Successfully");
                setSuccessMessageText(msg);
                setShowSuccessModal(true); // Open Success Modal
                setOpenModal(false); // Close Action Modal
            } else {
                toast.error(res?.details || "Process Failed");
            }
        } catch (err) {
            toast.error("Critical Error");
            console.error(err);
        }
    };

    // Close Success Modal and refresh list
    const handleCloseSuccessMessage = () => {
        setShowSuccessModal(false);
        setSuccessMessageText("");
        fetchMembershipList();
    };

    return {
        membershipList: currentItems,
        totalItems: filteredList.length,
        loading,
        form,
        openModal,
        setOpenModal,
        handleView,
        selectedApplication,
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
    };
};