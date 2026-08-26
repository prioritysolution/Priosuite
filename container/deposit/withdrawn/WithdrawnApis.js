import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getSpecimenAPI = async (orgId, acctId) => {
  let data = {
    url: endPoints.getSpecimen(orgId, acctId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCheckChequeAPI = async (orgId, acctId, instrumentNo) => {
  let data = {
    url: endPoints.getCheckCheque(orgId, acctId, instrumentNo),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postWithdrawnAPI = async (bodyData) => {
  let data = {
    url: endPoints.addWithdrawn,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
