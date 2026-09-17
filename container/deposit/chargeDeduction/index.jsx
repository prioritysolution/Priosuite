"use client";

import ChargeDeduction from "@/components/deposit/chargeDeduction";
import { useChargeDeduction } from "./Hooks";
import { useEffect } from "react";
import getCookieData from "@/utils/getCookieData";

const ChargeDeductionContainer = () => {
  const {
    form,
    handleSubmit,
    getOperateProductAPICall,
    orgId,
    productList,
    chargeTypeList,
    getTypeAPICall,
    getParamAPICall,
    chargeParam,
    chargeList,
    getListAPICall,
    loading,
    progress,
    handlePostCharges,
    // Ledger fields
    getLedgerLoading,
    showLedgerDialog,
    setShowLedgerDialog,
    ledgerHeaderData,
    ledgerTableData,
    totalLedgerDeposit,
    totalLedgerWithdrawn,
    totalLedgerInterest,
    ledgerUserName,
    currentLedgerDate,
    currentLedgerTime,
    getDepositLedgerHeaderApiCall,
    ledgerFromDate,
  } = useChargeDeduction();

  const charge_id = form.watch("chargeType");
  const prod_id = form.watch("productType");
  const date = form.watch("date");
  const branch_id = getCookieData("userBranchId");

  useEffect(() => {
    if (orgId) {
      getOperateProductAPICall(orgId, "N");
      getTypeAPICall(orgId);
    }
  }, [orgId]);

  useEffect(() => {
    if (charge_id && prod_id) {
      getParamAPICall(charge_id, prod_id);
    }
  }, [charge_id, prod_id]);

  // useEffect(() => {
  //   if (charge_id && prod_id && date && branch_id && orgId) {
  //     getListAPICall(charge_id, prod_id, date, branch_id, orgId);
  //   }
  // }, [charge_id, prod_id, date, branch_id, orgId]);

  return (
    <ChargeDeduction
      form={form}
      handleSubmit={handleSubmit}
      productList={productList}
      chargeTypeList={chargeTypeList}
      chargeParam={chargeParam}
      chargeList={chargeList}
      loading={loading}
      progress={progress}
      handlePostCharges={handlePostCharges}
      // Ledger props
      getLedgerLoading={getLedgerLoading}
      showLedgerDialog={showLedgerDialog}
      setShowLedgerDialog={setShowLedgerDialog}
      ledgerHeaderData={ledgerHeaderData}
      ledgerTableData={ledgerTableData}
      totalLedgerDeposit={totalLedgerDeposit}
      totalLedgerWithdrawn={totalLedgerWithdrawn}
      totalLedgerInterest={totalLedgerInterest}
      ledgerUserName={ledgerUserName}
      currentLedgerDate={currentLedgerDate}
      currentLedgerTime={currentLedgerTime}
      getDepositLedgerHeaderApiCall={getDepositLedgerHeaderApiCall}
      ledgerFromDate={ledgerFromDate}
    />
  );
};
export default ChargeDeductionContainer;
