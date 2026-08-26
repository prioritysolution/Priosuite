import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const deleteGuarantorAPI = async (bodyData) => {
  let data = {
    url: endPoints.deleteGuarantor,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
