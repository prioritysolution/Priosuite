import { doGetApiCall, doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoginPasswordPolicyAPI = async (orgId) => {
  return doGetApiCall({
    url: endPoints.getLoginPasswordPolicy(orgId),
  });
};

export const addLoginPasswordPolicyAPI = async (bodyData) => {
  return doPostApiCall({
    url: endPoints.addLoginPasswordPolicy,
    bodyData,
  });
};

export const updateLoginPasswordPolicyAPI = async (bodyData) => {
  return doPutApiCall({
    url: endPoints.updateLoginPasswordPolicy,
    bodyData,
  });
};
