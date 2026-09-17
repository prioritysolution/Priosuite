import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const addVoucherEntryAPI = async (bodyData) => {
  let data = {
    url: endPoints.addVoucherEntry,
    bodyData,
  };

  let res = await doPostApiCall(data);
  return res;
};

export const getSubHeadAPI = async (orgId) => {
  let data = {
    url: endPoints.getSubHead(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getVoucherLedgerListAPI = async (orgId, head_id) => {
  let data = {
    url: endPoints.getVoucherLedgerList(orgId, head_id),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getVoucherSubLedgerListAPI = async (
  orgId,
  glId,
  page,
  keyword,
) => {
  let data = {
    url: endPoints.getVoucherSubLedgerList(orgId, glId, page, keyword),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getVoucherSubLedgerBalanceAPI = async (
  orgId,
  subGlId,
  type,
  date,
) => {
  let data = {
    url: endPoints.getVoucherSubLedgerBalance(orgId, subGlId, type, date),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLedgerAcctTypeAPI = async (orgId) => {
  let data = {
    url: endPoints.getLedgerAcctType(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLedgerMainHeadAPI = async (orgId, acctType) => {
  let data = {
    url: endPoints.getLedgerMainHead(orgId, acctType),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLedgerSubHeadAPI = async (orgId, acctHead) => {
  let data = {
    url: endPoints.getLedgerSubHead(orgId, acctHead),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const searchLedgerAPI = async (
  orgId,
  acctCat,
  acctHead,
  acctSubHead,
  keyword,
  page,
) => {
  let data = {
    url: endPoints.searchLedger(
      orgId,
      acctCat,
      acctHead,
      acctSubHead,
      keyword,
      page,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getLedgerAPI = async (orgId, vouchType, ledgerCode) => {
  let data = {
    url: endPoints.getLedger(orgId, vouchType, ledgerCode),
  };

  let res = await doGetApiCall(data);
  return res;
};
