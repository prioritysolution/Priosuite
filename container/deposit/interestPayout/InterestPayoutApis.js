import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositPayoutAccountAPI = async (
  accountNo,
  date,
  month,
  year,
  mode,
  type,
  orgId
) => {
  let data = {
    url: endPoints.getDepositPayoutAccount(
      accountNo,
      date,
      month,
      year,
      mode,
      type,
      orgId
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postDepositSinglePayoutAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositSinglePayoutAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const postDepositBulkPayoutAccountAPI = async (bodyData) => {
  let data = {
    url: endPoints.addDepositBulkPayoutAccount,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};
