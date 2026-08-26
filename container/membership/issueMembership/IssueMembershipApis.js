import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getCashDenomAPI = async () => {
  let data = {
    url: endPoints.getCashDemonData,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMemberDataByIdAPI = async (orgId, memberNo) => {
  let data = {
    url: endPoints.getMemberDataById(orgId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMemberDataByNameAPI = async (orgId, page, name, type) => {
  let data = {
    url: endPoints.getMemberDataByName(orgId, page, name, type),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getMemberProductDataAPI = async (orgId, typeId, memberNo) => {
  let data = {
    url: endPoints.getMemberProductData(orgId, typeId, memberNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCheckBalanceAPI = async (accountId, date, orgId) => {
  let data = {
    url: endPoints.getCheckBalance(accountId, date, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postIssueMembershipAPI = async (bodyData) => {
  let data = {
    url: endPoints.addIssueMembership,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
