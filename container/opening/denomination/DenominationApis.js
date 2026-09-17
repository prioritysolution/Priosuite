import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postDenominationAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDenomination,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
