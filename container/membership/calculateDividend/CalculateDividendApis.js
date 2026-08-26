import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLastDividendPaidDateAPI = async (orgId) => {
  let data = {
    url: endPoints.getLastDividendPaidDate(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getCalculateDividendAPI = async (
  orgId,
  fromDate,
  toDate,
  dividendRate
) => {
  let data = {
    url: endPoints.getCalculateDividend(orgId, fromDate, toDate, dividendRate),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postCalculateDividendAPI = async (bodyData) => {
  let data = {
    url: endPoints.addCalculateDividend,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
