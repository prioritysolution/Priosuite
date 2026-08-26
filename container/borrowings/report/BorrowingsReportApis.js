import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getBorrowingsReportTypeAPI = async () => {
  let data = {
    url: endPoints.getBorrowingsReportType,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getBorrowingsReportDataAPI = async (
  type,
  orgId,
  branchId,
  fromDate,
  toDate
) => {
  let url = null;

  switch (type) {
    case "113":
      url = endPoints.getBorrowingsReportDetailedListData(
        orgId,
        branchId,
        fromDate,
        toDate
      );
      break;
  }

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};
