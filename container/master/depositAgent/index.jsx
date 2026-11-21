"use client";

import DepositAgent from "@/components/master/depositAgent";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useDepositAgent } from "./Hooks";

const DepositAgentContainer = () => {
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const {
    form,
    handleSubmit,
    handleMemberFormSubmit,
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
  } = useDepositAgent();

  useEffect(() => {
    if (orgId) {
      getPaymentTypeDataApiCall(orgId);
    }
  }, [orgId]);

  return (
    <DepositAgent
      form={form}
      handleSubmit={handleSubmit}
      handleMemberFormSubmit={handleMemberFormSubmit}
      loading={loading}
      getMemberDataLoading={getMemberDataLoading}
      getAgentListLoading={getAgentListLoading}
      visibleBlock={visibleBlock}
      resetTrigger={resetTrigger}
      openAgentListModal={openAgentListModal}
      setOpenAgentListModal={setOpenAgentListModal}
      editingAgent={editingAgent}
      handleEditAgent={handleEditAgent}
      handleCancelEdit={handleCancelEdit}
      getDepositAgentListApiCall={getDepositAgentListApiCall}
      agentCurrentPage={agentCurrentPage}
      setAgentCurrentPage={setAgentCurrentPage}
      agentLastPage={agentLastPage}
      agentPageLimit={agentPageLimit}
      agentSearchKeyword={agentSearchKeyword}
      handleSearchAgentList={handleSearchAgentList}
      orgId={orgId}
      branchId={branchId}
    />
  );
};
export default DepositAgentContainer;
