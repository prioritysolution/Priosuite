import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositProductListAPI = async (orgId, page = 1, limit = 10) => {
  let data = {
    url: endPoints.getDepositProductList(orgId, page, limit),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postDepositProductAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositProduct,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateDepositProductAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateDepositProduct,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};

export const getDepositProductTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositAccountTypeData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositDurationUnitAPI = async (orgId) => {
  let data = {
    url: endPoints.getDurationTypeData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositTypeAPI = async (orgId, prdType) => {
  let data = {
    url: endPoints.getDepositTypeByPrdType(orgId, prdType),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositProductMemberTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositMemberType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositInterestTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositInttType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositChargeTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositChargeType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositMasterLedgerAPI = async (orgId, ledgType) => {
  let data = {
    url: endPoints.getDepositMasterLedger(orgId, ledgType),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositProductLedgerAPI = async (orgId) => {
  // Same source used by Account Ledger report
  let data = {
    url: endPoints.getAccountLedgerDataReport(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositProductPayoutModeAPI = async (orgId) => {
  let data = {
    url: endPoints.getPayoutModeData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

/** Fallback GL head list used by Sub Ledger master when acct-ledger list is empty */
export const getDepositProductLedgerHeadAPI = async () => {
  let data = {
    url: endPoints.getSubLedgerHeadData,
  };

  let res = await doGetApiCall(data);
  return res;
};
