import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getSidebarDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getSidebarData(orgId),
  };

  let res = await doGetApiCall(data);
  console.log("res getSidebarDataAPI", res);
  return res;
};
