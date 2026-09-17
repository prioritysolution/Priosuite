import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoanProductListAPI = async (orgId, page = 1, limit = 10) => {
  let data = {
    url: endPoints.getLoanProductList(orgId, page, limit),
  };
  return doGetApiCall(data);
};

export const postLoanProductAPI = async (bodyData) => {
  let data = {
    url: endPoints.addLoanProduct,
    bodyData,
  };
  return doPostApiCall(data);
};

export const updateLoanProductAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateLoanProduct,
    bodyData,
  };
  return doPutApiCall(data);
};

export const getLoanProductTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.GetProdType(orgId),
  };
  return doGetApiCall(data);
};

export const getLoanDurationUnitAPI = async (orgId) => {
  let data = {
    url: endPoints.getDurationTypeData(orgId),
  };
  return doGetApiCall(data);
};

export const getLoanProductMemberTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getMemberTypeData(orgId),
  };
  return doGetApiCall(data);
};

export const getLoanProductLedgerAPI = async (orgId) => {
  let data = {
    url: endPoints.getAccountLedgerDataReport(orgId),
  };
  return doGetApiCall(data);
};

export const getLoanProductLedgerHeadAPI = async () => {
  let data = {
    url: endPoints.getSubLedgerHeadData,
  };
  return doGetApiCall(data);
};

export const getSecureDepositProductAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositProductList(orgId, 1, 500),
  };
  return doGetApiCall(data);
};
