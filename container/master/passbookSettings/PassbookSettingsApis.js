import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getPassbookModuleAPI = async (orgId) => {
  let data = {
    url: endPoints.getPassbookModule(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getPassbookConfigAPI = async (orgId, moduleId) => {
  let data = {
    url: endPoints.getPassbookConfig(orgId, moduleId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const addPassbookSettingsAPI = async (bodyData) => {
  let data = {
    url: endPoints.addPassbookSettings,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
