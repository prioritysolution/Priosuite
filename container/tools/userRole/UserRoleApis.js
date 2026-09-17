import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getRoleUserDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getRoleUserData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getRoleModuleDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getRoleModuleData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postUserRoleDataAPI = async (bodyData) => {
  let data = {
    url: endPoints.addUserRoleData,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
