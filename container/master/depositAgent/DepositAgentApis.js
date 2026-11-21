import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getPaymentTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getAgentPayout(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postDepositAgentAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositAgent,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateDepositAgentAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateDepositAgent,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};

export const getDepositAgentListAPI = async (
  orgId,
  branchId,
  pageNo = 1,
  pageSize = 25,
  keyword = null,
  agentId = null,
) => {
  let data = {
    url: endPoints.getDepositAgentList(
      orgId,
      branchId,
      pageNo,
      keyword,
      agentId,
      pageSize,
    ),
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
