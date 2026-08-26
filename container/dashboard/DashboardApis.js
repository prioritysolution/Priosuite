import { doPostApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDashboardItemAPI = async (bodyData) => {
  let data = {
    url: endPoints.getDashboardItem,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const updateDayBeginAPI = async (bodyData) => {
  let data = {
    url: endPoints.UpdateDayBegin,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};
