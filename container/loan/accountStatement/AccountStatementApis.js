import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getAccountStatementAPI = async (
  orgId,
  accountId,
  fromDate,
  toDate,
) => {
  let data = {
    url: endPoints.getAccountStatementData(orgId, accountId, fromDate, toDate),
  };

  let res = await doGetApiCall(data);
  return res;
};
