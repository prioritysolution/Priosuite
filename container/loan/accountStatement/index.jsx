"use client";

import AccountStatement from "@/components/loan/accountStatement";
import { useAccountStatement } from "./Hooks";

const AccountStatementContainer = () => {
  const {
    loading,
    form,
    handleSubmit,
    tableData,
    fromDate,
    toDate,
    dialougeOpen,
    setDialougeOpen,
    activeTab,
    setActiveTab,
    getLoanAccountLoading,
    currentAccountPage,
    setCurrentAccountPage,
    lastAccountPage,
    handleSearchAccountListByMemberNo,
    handleSearchAccountListByName,
    handleSelectClick,
  } = useAccountStatement();

  return (
    <AccountStatement
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      tableData={tableData}
      fromDate={fromDate}
      toDate={toDate}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      getLoanAccountLoading={getLoanAccountLoading}
      currentAccountPage={currentAccountPage}
      setCurrentAccountPage={setCurrentAccountPage}
      lastAccountPage={lastAccountPage}
      handleSearchAccountListByMemberNo={handleSearchAccountListByMemberNo}
      handleSearchAccountListByName={handleSearchAccountListByName}
      handleSelectClick={handleSelectClick}
    />
  );
};
export default AccountStatementContainer;
