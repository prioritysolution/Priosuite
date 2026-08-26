import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postLogoutAPI = async () => {
  let data = {
    url: endPoints.logout,
  };

  const res = await doPostApiCall(data);
  return res;
};
