import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getLoanAccountDetailsByAccountNoAPI = async (
  orgId,
  accountNo,
  date,
) => {
  let data = {
    url: endPoints.getLoanRepaymentAccountDetails(orgId, accountNo, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getGuarranterSecurityAPI = async (orgId, accountId) => {
  let data = {
    url: endPoints.getGuarranterSecurity(orgId, accountId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLoanLedgerAPI = async (
  orgId,
  accountId,
  fromDate,
  toDate,
  mode,
) => {
  let data = {
    url: endPoints.getLoanLedger(orgId, accountId, fromDate, toDate, mode),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postLoanRepaymentAPI = async (bodyData) => {
  let data = {
    url: endPoints.addLoanRepayment,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getLoanAccountListAPI = async (
  orgId,
  mode,
  memberName,
  memberNo,
  page,
) => {
  let data = {
    url: endPoints.getLoanAccountSearch(
      orgId,
      mode,
      memberName,
      memberNo,
      page,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};
