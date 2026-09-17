import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoanGuarantorDetailsAPI = async (orgId, memberNo, date) => {
  let data = {
    url: endPoints.getLoanGuarantorDetails(orgId, memberNo, date),
  };

  let res = await doGetApiCall(data);
  return res;
};
