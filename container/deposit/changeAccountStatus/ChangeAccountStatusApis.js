import { doGetApiCall, doPutApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getStatusAccountDetailsByAccountNoAPI = async (
  accountNo,
  date,
  orgId,
) => {
  let data = {
    url: endPoints.getStatusAccountDetailsByAccountNo(accountNo, date, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getStatusListAPI = async () => {
  let data = {
    url: endPoints.getStatusList,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const updateAccountStatusAPI = async (bodyData) => {
  let data = {
    url: endPoints.updateAccountStatus,
    bodyData,
  };

  let res = await doPutApiCall(data);
  return res;
};
