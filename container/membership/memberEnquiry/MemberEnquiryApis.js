import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getMemberEnquiryInfoAPI = async (
  memberId,
  fromDate,
  toDate,
  orgId
) => {
  let data = {
    url: endPoints.getMemberEnquiryInfo(memberId, fromDate, toDate, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};
