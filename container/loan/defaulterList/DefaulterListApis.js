import { doGetApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDefaulterListAPI = async (
  orgId,
  productId,
  asOnDate,
  fromMonth,
  toMonth,
  reportType,
  viewType,
) => {
  let data = {
    url: endPoints.getDefaulterListData(
      orgId,
      productId,
      asOnDate,
      fromMonth,
      toMonth,
      reportType,
      viewType,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};
