"use client";

import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
  getDepositAgentListAPI,
  getMemberDataByIdAPI,
  getPaymentTypeAPI,
  postDepositAgentAPI,
  updateDepositAgentAPI,
} from "./DepositAgentApis";

import { getAgentListData, getPaymentTypeData } from "./DepositAgentReducer";
import {
  maxTwoDecimalPlaces,
  mobileLengthRegex,
  mobileNoLeadingZeroRegex,
  mobileRegex,
} from "@/utils/validationRegex";

export const useDepositAgent = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);
  const [getAgentListLoading, setGetAgentListLoading] = useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [openAgentListModal, setOpenAgentListModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [agentCurrentPage, setAgentCurrentPage] = useState(1);
  const [agentLastPage, setAgentLastPage] = useState(1);
  const [agentPageLimit] = useState(25);

  const orgId = getCookieData("orgId");
  const userBranchId = getCookieData("userBranchId");

  const formSchema = yup.object({
    memberNo: yup.string(),
    memberId: yup.string(),
    cifNo: yup.string(),
    memberName: yup.string(),
    gurdianName: yup.string(),
    branchName: yup.string(),
    BranchId: yup.string(),
    securityAmount: yup
      .string()
      .nullable()
      .test(
        "is-valid-decimal",
        "Security amount can have at most two decimal places",
        (value) => {
          if (!value || value === "") return true;
          return maxTwoDecimalPlaces.test(value);
        },
      )
      .test(
        "is-non-negative",
        "Security amount must be 0 or greater",
        (value) => {
          if (!value || value === "") return true;
          return Number(value) >= 0;
        },
      ),
    maxCollectionAmount: yup
      .string()
      .nullable()
      .test(
        "is-valid-decimal",
        "Max collection amount can have at most two decimal places",
        (value) => {
          if (!value || value === "") return true;
          return maxTwoDecimalPlaces.test(value);
        },
      )
      .test(
        "is-non-negative",
        "Max collection amount must be 0 or greater",
        (value) => {
          if (!value || value === "") return true;
          return Number(value) >= 0;
        },
      ),
    maxAllowDay: yup
      .string()
      .nullable()
      .test(
        "is-max-2-digits",
        "Max allow day must be at most 2 digits",
        (value) => {
          if (!value || value === "") return true;
          return /^\d{1,2}$/.test(value.trim());
        },
      ),
    depositCollection: yup.boolean(),
    loanCollection: yup.boolean(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      memberNo: "",
      memberId: "",
      cifNo: "",
      memberName: "",
      gurdianName: "",
      branchName: "",
      BranchId: "",
      securityAmount: "",
      maxCollectionAmount: "",
      maxAllowDay: "",
      depositCollection: false,
      loanCollection: false,
      agentId: null,
    },
  });

  const clearMemberFields = () => {
    form.setValue("memberNo", "");
    form.setValue("memberId", "");
    form.setValue("cifNo", "");
    form.setValue("memberName", "");
    form.setValue("gurdianName", "");
    form.setValue("branchName", "");
    form.setValue("BranchId", "");
    form.setValue("agentId", null);
    setEditingAgent(null);
  };

  const handleSubmit = (values) => {
    if (!visibleBlock) {
      toast.error("Search a member first");
      return;
    }
    if (editingAgent && (editingAgent.Id || editingAgent.id || editingAgent.Agent_Id || editingAgent.agent_id)) {
      updateDepositAgentApiCall(values);
    } else {
      postDepositAgentApiCall(values);
    }
  };

  const handleMemberFormSubmit = (values) => {
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const getMemberDataByIdApiCall = async (currentOrgId, memberNo) => {
    setGetMemberDataLoading(true);
    try {
      const res = await getMemberDataByIdAPI(currentOrgId, memberNo);
      if (res.message === "Data Found" && Array.isArray(res.details) && res.details.length > 0) {
        const member = res.details[0] || {};
        setVisibleBlock(true);
        form.setValue("memberNo", member.Cust_No != null ? String(member.Cust_No) : "");
        form.setValue("memberId", member.Id != null ? String(member.Id) : "");
        form.setValue("cifNo", member.CIF_No || "");
        form.setValue("memberName", member.Full_Name || "");
        form.setValue("gurdianName", member.Relation_Name || "");
        form.setValue("address", member.Address || "");
        form.setValue("mobile", member.Cust_Mob || "");
        form.setValue("branchName", member.Branch_Name || "");
        form.setValue("BranchId", member.Branch_Id != null ? String(member.Branch_Id) : "");
      } else {
        setVisibleBlock(false);
        clearMemberFields();
        toast.error(res.details || res.message || "Member not found");
      }
    } catch (error) {
      setVisibleBlock(false);
      clearMemberFields();
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setGetMemberDataLoading(false);
    }
  };

  const toApiNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  };

  const handleEditAgent = (agent) => {
    if (!agent) return;
    setEditingAgent(agent);
    setVisibleBlock(true);
    setOpenAgentListModal(false);

    // Populate member & agent form fields using actual API response keys
    const custId = agent.Cust_Id ?? agent.Cust_id ?? agent.cust_id ?? agent.CustId ?? "";
    const memberNo = agent.Cust_No ?? agent.Cust_no ?? agent.cust_no ?? agent.Member_No ?? "";
    const cifNo = agent.CIF_No ?? agent.cif_no ?? agent.CIF ?? "";
    const fullName = agent.Full_Name ?? agent.Agent_Name ?? agent.full_name ?? agent.agent_name ?? "";
    const gurdianName = agent.Relation_Name ?? agent.gurdian_name ?? agent.relation_name ?? "";
    const address = agent.Address ?? agent.address ?? "";
    const mobile = agent.Cust_Mob ?? agent.Mobile ?? agent.cust_mob ?? agent.mobile ?? "";
    const branchName = agent.Branch_Name ?? agent.branch_name ?? "";
    const branchId = agent.Branch_Id ?? agent.Branch_id ?? agent.branch_id ?? "";
    const agentId = agent.Agent_Id ?? agent.agent_id ?? agent.Agent_id ?? agent.Id ?? agent.id ?? null;

    form.setValue("memberNo", memberNo != null ? String(memberNo) : "");
    form.setValue("memberId", custId != null ? String(custId) : "");
    form.setValue("cifNo", cifNo || "");
    form.setValue("memberName", fullName || "");
    form.setValue("gurdianName", gurdianName || "");
    form.setValue("address", address || "");
    form.setValue("mobile", mobile || "");
    if (branchName) form.setValue("branchName", branchName);
    if (branchId) form.setValue("BranchId", String(branchId));
    form.setValue("agentId", agentId);

    // Actual API response keys for values
    const depAmt = agent.Agent_Deposit ?? agent.Deposit_Amt ?? agent.Deposit_amt ?? agent.deposit_amt ?? "";
    const maxDays = agent.Agent_Allow_Days ?? agent.Max_Days ?? agent.Max_days ?? agent.max_days ?? "";
    const maxAmt = agent.Agent_Max_Amount ?? agent.Max_Amt ?? agent.Max_amt ?? agent.max_amt ?? "";
    const allowDep = agent.Allow_Deposit ?? agent.Allow_dep ?? agent.allow_dep ?? agent.Allow_Dep ?? 0;
    const allowLn = agent.Allow_Loan ?? agent.Allow_ln ?? agent.allow_ln ?? agent.Allow_Ln ?? 0;

    form.setValue("securityAmount", depAmt != null && depAmt !== "" ? String(depAmt) : "");
    form.setValue("maxCollectionAmount", maxAmt != null && maxAmt !== "" ? String(maxAmt) : "");
    form.setValue("maxAllowDay", maxDays != null && maxDays !== "" ? String(maxDays) : "");
    form.setValue("depositCollection", Number(allowDep) === 1 || allowDep === true || allowDep === "1");
    form.setValue("loanCollection", Number(allowLn) === 1 || allowLn === true || allowLn === "1");

    // Ensure BranchId fallback to current branch if not present in agent object
    const resolvedBranchId = branchId || userBranchId || getCookieData("userBranchId");
    if (resolvedBranchId) {
      form.setValue("BranchId", String(resolvedBranchId));
    }
  };

  const handleCancelEdit = () => {
    setEditingAgent(null);
    form.reset();
    setVisibleBlock(false);
    setResetTrigger((prev) => prev + 1);
  };

  const [agentSearchKeyword, setAgentSearchKeyword] = useState(null);

  const getDepositAgentListApiCall = async (
    targetOrgId = orgId,
    targetBranchId = userBranchId,
    page = agentCurrentPage,
    limit = agentPageLimit,
    keyword = agentSearchKeyword,
  ) => {
    if (!targetOrgId) return;
    setGetAgentListLoading(true);
    try {
      const res = await getDepositAgentListAPI(
        targetOrgId,
        targetBranchId || 0,
        page,
        limit,
        keyword,
        null,
      );
      if (res.message === "Data Found" || res.message === "Success") {
        const list = Array.isArray(res.details)
          ? res.details
          : Array.isArray(res.details?.data)
          ? res.details.data
          : Array.isArray(res.Data)
          ? res.Data
          : Array.isArray(res.data)
          ? res.data
          : [];
        dispatch(getAgentListData(list));
        
        // Handle pagination object from API response
        const totalPages =
          res.pagination?.total_pages ??
          res.details?.last_page ??
          res.last_page ??
          1;
        const currentPage =
          res.pagination?.current_page ??
          res.details?.current_page ??
          res.current_page ??
          page;

        setAgentLastPage(totalPages);
        setAgentCurrentPage(currentPage);
      } else {
        dispatch(getAgentListData([]));
        setAgentLastPage(1);
      }
    } catch (error) {
      console.error(error);
      dispatch(getAgentListData([]));
      setAgentLastPage(1);
    } finally {
      setGetAgentListLoading(false);
    }
  };

  const handleSearchAgentList = (keyword) => {
    const trimmed = keyword && keyword.trim() !== "" ? keyword.trim() : null;
    setAgentSearchKeyword(trimmed);
    getDepositAgentListApiCall(orgId, userBranchId, 1, agentPageLimit, trimmed);
  };

  const updateDepositAgentApiCall = async (item) => {
    const custId =
      toApiNumberOrNull(item.memberId) ??
      toApiNumberOrNull(editingAgent?.Cust_Id) ??
      toApiNumberOrNull(editingAgent?.Cust_id) ??
      toApiNumberOrNull(editingAgent?.cust_id);

    const branchId =
      toApiNumberOrNull(item.BranchId) ??
      toApiNumberOrNull(editingAgent?.Branch_Id) ??
      toApiNumberOrNull(editingAgent?.Branch_id) ??
      toApiNumberOrNull(editingAgent?.branch_id) ??
      toApiNumberOrNull(userBranchId) ??
      toApiNumberOrNull(getCookieData("userBranchId"));

    const orgIdNum = Number(orgId) || Number(getCookieData("orgId"));
    const depAmt = toApiNumberOrNull(item.securityAmount);
    const maxDays = toApiNumberOrNull(item.maxAllowDay);
    const maxAmt = toApiNumberOrNull(item.maxCollectionAmount);
    const allowDep = item.depositCollection ? 1 : 0;
    const allowLn = item.loanCollection ? 1 : 0;
    const agentIdNum =
      toApiNumberOrNull(item.agentId) ??
      toApiNumberOrNull(editingAgent?.Agent_Id) ??
      toApiNumberOrNull(editingAgent?.agent_id) ??
      toApiNumberOrNull(editingAgent?.Id) ??
      toApiNumberOrNull(editingAgent?.id);

    const data = {
      // Lowercase keys required by backend validator
      org_id: orgIdNum,
      cust_id: custId,
      deposit_amt: depAmt,
      max_days: maxDays,
      max_amt: maxAmt,
      allow_dep: allowDep,
      allow_ln: allowLn,
      branch_id: branchId,
      agent_id: agentIdNum,

      // Also include Pascal/Camel variants for full compatibility
      Org_id: orgIdNum,
      Cust_id: custId,
      Deposit_amt: depAmt,
      Max_days: maxDays,
      Max_amt: maxAmt,
      Allow_dep: allowDep,
      Allow_ln: allowLn,
      Branch_id: branchId,
      agent_Id: agentIdNum,
      Agent_Id: agentIdNum,
    };

    setLoading(true);
    try {
      const res = await updateDepositAgentAPI(data);
      if (res.message === "Success" || res.message === "Data Updated Successfully") {
        toast.success(res.details || res.message || "Agent updated successfully");
        setEditingAgent(null);
        form.reset();
        setVisibleBlock(false);
        setResetTrigger((prev) => prev + 1);
        getDepositAgentListApiCall(orgId, userBranchId, agentCurrentPage, agentPageLimit);
      } else {
        toast.error(res.details || res.message || "Failed to update agent");
      }
    } catch (error) {
      console.error(error);
      const details = error?.response?.data?.details;
      if (details && typeof details === "object") {
        Object.values(details)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const postDepositAgentApiCall = async (item) => {
    const custId = toApiNumberOrNull(item.memberId);
    const branchId = toApiNumberOrNull(item.BranchId) ?? toApiNumberOrNull(getCookieData("userBranchId"));
    const orgIdNum = Number(orgId);
    const depAmt = toApiNumberOrNull(item.securityAmount);
    const maxDays = toApiNumberOrNull(item.maxAllowDay);
    const maxAmt = toApiNumberOrNull(item.maxCollectionAmount);
    const allowDep = item.depositCollection ? 1 : 0;
    const allowLn = item.loanCollection ? 1 : 0;

    const data = {
      // Requested keys
      Org_id: orgIdNum,
      Cust_id: custId,
      Deposit_amt: depAmt,
      Max_days: maxDays,
      Max_amt: maxAmt,
      Allow_dep: allowDep,
      Allow_ln: allowLn,
      Branch_id: branchId,
    };
    setLoading(true);
    try {
      const res = await postDepositAgentAPI(data);
      if (res.message === "Success" || res.message === "Data Added Successfully") {
        toast.success(res.details || res.message || "Agent created successfully");
        form.reset();
        setVisibleBlock(false);
        setResetTrigger((prev) => prev + 1);
        getDepositAgentListApiCall(orgId, userBranchId, 1, agentPageLimit);
      } else {
        toast.error(res.details || res.message || "Failed to create agent");
      }
    } catch (error) {
      console.error(error);
      const details = error?.response?.data?.details;
      if (details && typeof details === "object") {
        Object.values(details)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPaymentTypeDataApiCall = async (org_id) => {
    try {
      const res = await getPaymentTypeAPI(org_id);
      console.log("getPaymentTypeAPI=", res);
      if (res.message === "Data Found") {
        dispatch(getPaymentTypeData(res.details));
      } else {
        dispatch(getPaymentTypeData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getPaymentTypeData([]));
    }
  };

  return {
    loading,
    getMemberDataLoading,
    getAgentListLoading,
    visibleBlock,
    resetTrigger,
    openAgentListModal,
    setOpenAgentListModal,
    editingAgent,
    handleEditAgent,
    handleCancelEdit,
    getDepositAgentListApiCall,
    agentCurrentPage,
    setAgentCurrentPage,
    agentLastPage,
    agentPageLimit,
    agentSearchKeyword,
    handleSearchAgentList,
    getPaymentTypeDataApiCall,
    handleSubmit,
    handleMemberFormSubmit,
    form,
  };
};
