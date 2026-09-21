import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getSidebarDataAPI = async (orgId, lang = "EN") => {
  const data = {
    url: endPoints.getSidebarData(orgId, lang),
  };

  return doGetApiCall(data);
};
