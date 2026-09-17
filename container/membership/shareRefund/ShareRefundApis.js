import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postShareRefundAPI = async (bodyData) => {
  let data = {
    url: endPoints.addShareRefund,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
