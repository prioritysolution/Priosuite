import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postIssueChequeAPI = async (bodyData) => {
  let data = {
    url: endPoints.addIssueCheque,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getChequeAccountDetailsByAccountNoAPI = async (
  orgId,
  date,
  accountNo,
) => {
  let data = {
    url: endPoints.getChequeAccountDetailsByAccountNo(orgId, date, accountNo),
  };

  let res = await doGetApiCall(data);
  return res;
};
