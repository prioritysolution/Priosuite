import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBankAccountTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getBankAccountType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBankGlAPI = async (orgId, typeId) => {
  let data = {
    url: endPoints.getBankGl(orgId, typeId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postOpenBankAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpenBankAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
