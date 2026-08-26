import { doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const postOpeningBorrowingsAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addOpeningBorrowingsAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
