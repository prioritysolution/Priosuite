import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getFinancialYearAPI = async (orgId) => {
  const url = endPoints.getFinancialYear(orgId);
  console.log("getFinancialYearAPI url =>", url);

  const data = { url };
  const res = await doGetApiCall(data);

  console.log("getFinancialYearAPI response footer =>", res);
  return res;
};
