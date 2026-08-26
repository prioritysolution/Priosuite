import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getAllUserDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getAllUserData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getUserRoleDataAPI = async () => {
  let data = {
    url: endPoints.getUserRoleData,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postNewUserAPI = async (bodyData) => {
  let data = {
    url: endPoints.addNewUser,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
