import { doGetApiCall, doPostApiCall } from "@/utils/apiConfig";
import { endPoints } from "@/utils/endPoints";

export const getDepositAccountTypeDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositAccountTypeData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositProductDataAPI = async (orgId, typeId) => {
  let data = {
    url: endPoints.getDepositProductData(orgId, typeId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getOpenDepositAccountDataAPI = async (type, orgId) => {
  let url = null;

  switch (type) {
    case "DURATIONTYPE":
      url = endPoints.getDurationTypeData(orgId);
      break;
    case "MATURITYINSTRUCTION":
      url = endPoints.getMaturityInstructionData(orgId);
      break;
    case "OPERATIONMODE":
      url = endPoints.getOperationModeData(orgId);
      break;
    case "PAYOUTMODE":
      url = endPoints.getPayoutModeData(orgId);
      break;
    default:
      url = null;
  }

  let data = {
    url,
  };

  let res = await doGetApiCall(data);
  return res;
};

export const checkDepositAmountAPI = async (productId, amount, orgId) => {
  let data = {
    url: endPoints.checkDepositAmount(productId, amount, orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const checkDepositDurationAPI = async (
  productId,
  duration,
  durationUnit,
  orgId,
) => {
  let data = {
    url: endPoints.checkDepositDuration(
      productId,
      duration,
      durationUnit,
      orgId,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositInterestRateAPI = async (
  productId,
  duration,
  durationUnit,
  date,
  orgId,
) => {
  let data = {
    url: endPoints.getDepositInterestRate(
      productId,
      duration,
      durationUnit,
      date,
      orgId,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositMaturityAmountAPI = async (
  productId,
  duration,
  durationUnit,
  amount,
  roi,
  orgId,
) => {
  let data = {
    url: endPoints.getDepositMaturityAmount(
      productId,
      duration,
      durationUnit,
      amount,
      roi,
      orgId,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositPayoutAmountAPI = async (
  productId,
  typeId,
  amount,
  roi,
  orgId,
) => {
  let data = {
    url: endPoints.getDepositPayoutAmount(
      productId,
      typeId,
      amount,
      roi,
      orgId,
    ),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositAgentDataAPI = async (orgId) => {
  let data = {
    url: endPoints.getDepositAgentData(orgId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const getDepositEcsAccountAPI = async (orgId, memberId) => {
  let data = {
    url: endPoints.getDepositEcsAccount(orgId, memberId),
  };

  let res = await doGetApiCall(data);
  return res;
};

export const postOpenDepositAccountAPI = async (bodyData, content) => {
  let data = {
    url: endPoints.addDepositAccount,
    bodyData,
  };

  let res = await doPostApiCall(data, content);
  return res;
};

export const CheckAllowProcessDepositAPI = async (
  org_id,
  prod_id,
  cust_type,
) => {
  let data = {
    url: endPoints.CheckAllowProcessDeposit(org_id, prod_id, cust_type),
  };
  let res = await doGetApiCall(data);
  return res;
};

export const GetGrpInstMemberAPI = async (org_id, parr_id) => {
  let data = {
    url: endPoints.GetGrpInstMember(org_id, parr_id),
  };
  let res = await doGetApiCall(data);
  return res;
};
