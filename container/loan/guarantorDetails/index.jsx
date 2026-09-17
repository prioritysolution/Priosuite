"use client";

import GuarantorDetails from "@/components/loan/guarantorDetails";
import { useGuarantorDetails } from "./Hooks";

const GuarantorDetailsContainer = () => {
  const {
    loading,
    getMemberListDataLoading,
    form,
    handleSubmit,
    personalData,
    ownTableData,
    guarantorTableData,
    date,
    dialougeOpen,
    setDialougeOpen,
    handleSearchMember,
    handleSelectClick,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
    totalOwnIssueAmount,
    totalOwnCurrentBalance,
    totalOwnCurrentInterest,
    totalOwnOdBalance,
    totalOwnOdInterest,
    totalGuarantorIssueAmount,
    totalGuarantorCurrentBalance,
    totalGuarantorCurrentInterest,
    totalGuarantorOdBalance,
    totalGuarantorOdInterest,
  } = useGuarantorDetails();

  return (
    <GuarantorDetails
      loading={loading}
      getMemberListDataLoading={getMemberListDataLoading}
      form={form}
      handleSubmit={handleSubmit}
      personalData={personalData}
      ownTableData={ownTableData}
      guarantorTableData={guarantorTableData}
      date={date}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      handleSearchMember={handleSearchMember}
      handleSelectClick={handleSelectClick}
      currentMemberPage={currentMemberPage}
      setCurrentMemberPage={setCurrentMemberPage}
      lastMemberPage={lastMemberPage}
      totalOwnIssueAmount={totalOwnIssueAmount}
      totalOwnCurrentBalance={totalOwnCurrentBalance}
      totalOwnCurrentInterest={totalOwnCurrentInterest}
      totalOwnOdBalance={totalOwnOdBalance}
      totalOwnOdInterest={totalOwnOdInterest}
      totalGuarantorIssueAmount={totalGuarantorIssueAmount}
      totalGuarantorCurrentBalance={totalGuarantorCurrentBalance}
      totalGuarantorCurrentInterest={totalGuarantorCurrentInterest}
      totalGuarantorOdBalance={totalGuarantorOdBalance}
      totalGuarantorOdInterest={totalGuarantorOdInterest}
    />
  );
};
export default GuarantorDetailsContainer;
