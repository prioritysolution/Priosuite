import {
  doGetApiCall,
  doPostApiCall,
  doPutApiCall,
} from "../../../utils/apiConfig";
import { endPoints } from "../../../utils/endPoints";

export const userLoginAPI = async (body) => {
  let url = endPoints.login;
  let data = {
    url,
    bodyData: body,
  };
  console.log("data=", data);
  let res = await doPostApiCall(data);
  return res;
};

export const postTerminateActiveSessionAPI = async (bodyData) => {
  let data = {
    url: endPoints.postTerminateActiveSession,
    bodyData,
  };
  let res = await doPostApiCall(data);
  return res;
};

export const getCheckFinYearAPI = async () => {
  let data = {
    url: endPoints.getLoginFinYear,
  };
  let res = await doGetApiCall(data);
  return res;
};

export const CheckDayBeginStatusAPI = async (date, orgId, yearId, branchId) => {
  let data = {
    url: endPoints.getCheckDayBeginStatus(date, orgId, yearId, branchId),
  };
  let res = await doGetApiCall(data);
  return res;
};
