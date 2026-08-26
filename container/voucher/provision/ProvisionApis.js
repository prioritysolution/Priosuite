import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const addProvisionAPI = async (bodyData) => {
  let data = {
    url: endPoints.addProvision,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
