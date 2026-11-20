"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { useDispatch } from "react-redux";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import {
  getDepositChargeTypeAPI,
  getDepositDurationUnitAPI,
  getDepositInterestTypeAPI,
  getDepositProductLedgerAPI,
  getDepositProductLedgerHeadAPI,
  getDepositProductListAPI,
  getDepositProductMemberTypeAPI,
  getDepositProductPayoutModeAPI,
  getDepositProductTypeAPI,
  getDepositTypeAPI,
  postDepositProductAPI,
  updateDepositProductAPI,
} from "./DepositProductApis";
import {
  getDepositProductListData,
  getDepTypeData,
  getDurationUnitData,
  getFineOnData,
  getInterestTypeData,
  getLedgerData,
  getMemberTypeData,
  getPayoutModeData,
  getProductTypeData,
} from "./DepositProductReducer";

/** Pull list payload from varied API response shapes used across the portal */
const extractList = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.details)) return res.details;
  if (Array.isArray(res.Data)) return res.Data;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.details?.data)) return res.details.data;
  if (Array.isArray(res.details?.Data)) return res.details.Data;
  return [];
};

/** Ensure dropdown rows have Id + label keys DropdownField expects */
const normalizeOptionRows = (list, labelKeys = ["Option_Value"]) => {
  if (!Array.isArray(list)) return [];
  return list
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const rawId =
        item.Id ??
        item.id ??
        item.Option_Id ??
        item.value ??
        item.Ledger_Id ??
        item.Type_Id ??
        item.Head_Id ??
        null;
      let label;
      for (const key of labelKeys) {
        if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
          label = item[key];
          break;
        }
      }
      if (label === undefined) {
        label =
          item.Option_Value ??
          item.Ledger_Name ??
          item.Name ??
          item.name ??
          item.Type_Name ??
          item.Member_Type ??
          "";
      }
      if (rawId === null || rawId === undefined || rawId === "") return null;
      return {
        ...item,
        Id: rawId,
        Option_Value: item.Option_Value ?? label,
        Ledger_Name: item.Ledger_Name ?? label,
      };
    })
    .filter(Boolean);
};

const optionalNumber = () =>
  yup
    .string()
    .nullable()
    .transform((value) => (value === "" || value === null ? "" : value));
const requiredPositiveDecimal = (label) =>
  yup
    .string()
    .required(`${label} is required`)
    .test("is-positive-number", `${label} must be greater than 0`, (value) => {
      if (!value || value.trim() === "") return false;
      return parseFloat(value) > 0;
    })
    .test(
      "is-valid-decimal",
      `${label} can have at most two decimal places`,
      (value) => {
        if (value && !maxTwoDecimalPlaces.test(value)) return false;
        return true;
      },
    );

const optionalDecimal = (label) =>
  optionalNumber().test(
    "is-valid-decimal",
    `${label} can have at most two decimal places`,
    (value) => {
      if (!value || value === "") return true;
      return maxTwoDecimalPlaces.test(value);
    },
  );

const optionalInteger = (label) =>
  optionalNumber().test(
    "is-integer",
    `${label} must be a non-decimal number`,
    (value) => {
      if (!value || value === "") return true;
      return Number.isInteger(Number(value));
    },
  );

const toApiNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const defaultFormValues = {
  prdType: "",
  depType: "",
  productName: "",
  prdShName: "",
  interestType: "",
  minAmt: "",
  roi: "",
  minDur: "",
  durUnit: "",
  lockDays: "",
  defaultFine: "",
  fineOn: "",
  inOperMonth: "",
  inDorMonth: "",
  memberType: "",
  prnLedg: "",
  inttLedg: "",
  provLedg: "",
  fineLedg: "",
  withdrawalAllocated: false,
  noOfWithdrawalInYear: "",
  interestPayout: false,
  payoutMode: "",
  agentAllocated: false,
};

export const useDepositProduct = () => {
  const dispatch = useDispatch();
  const orgId = getCookieData("orgId");

  const [getLoading, setGetLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [openDialouge, setOpenDialouge] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [pageLimit] = useState(10);

  const formSchema = yup.object({
    prdType: yup.string().required("Product type is required"),
    depType: yup.string().required("Deposit type is required"),
    productName: yup.string().required("Product name is required"),
    prdShName: yup
      .string()
      .required("Short name is required")
      .max(10, "Short name must be at most 10 characters"),
    interestType: yup.string().required("Interest type is required"),
    minAmt: requiredPositiveDecimal("Minimum amount"),
    roi: requiredPositiveDecimal("Rate of interest"),
    minDur: optionalInteger("Minimum duration"),
    durUnit: optionalNumber(),
    lockDays: optionalInteger("Lock-in days"),
    defaultFine: optionalDecimal("Default fine"),
    fineOn: optionalNumber(),
    inOperMonth: optionalInteger("Inoperative months"),
    inDorMonth: optionalInteger("Dormant months"),
    memberType: optionalNumber(),
    prnLedg: yup.string().required("Principal ledger is required"),
    inttLedg: yup.string().required("Interest ledger is required"),
    provLedg: yup.string().required("Provision ledger is required"),
    fineLedg: yup.string().when("depType", {
      is: (val) => String(val) !== "1" && String(val) !== "2" && String(val) !== "5" && val !== "" && val !== undefined && val !== null,
      then: (schema) => schema.nullable().notRequired(),
      otherwise: (schema) =>
        yup.string().when("depType", {
          is: (val) => String(val) === "1",
          then: (s) => s.nullable().notRequired(),
          otherwise: (s) => s.required("Fine ledger is required"),
        }),
    }),
    withdrawalAllocated: yup.boolean(),
    noOfWithdrawalInYear: yup.string().when("withdrawalAllocated", {
      is: true,
      then: (schema) =>
        schema
          .required("No. of withdrawals in a year is required")
          .test(
            "is-positive-integer",
            "No. of withdrawals in a year must be greater than 0",
            (value) => {
              if (!value || value.trim() === "") return false;
              const n = Number(value);
              return Number.isInteger(n) && n > 0;
            },
          ),
      otherwise: (schema) => optionalInteger("No. of withdrawals in a year"),
    }),
    interestPayout: yup.boolean(),
    payoutMode: yup.string().when("interestPayout", {
      is: true,
      then: (schema) => schema.required("Payout mode is required"),
      otherwise: (schema) => optionalNumber(),
    }),
    agentAllocated: yup.boolean(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const handleSubmit = (values) => {
    if (editData && Object.keys(editData).length > 0) {
      putDepositProductApiCall(editData.Id, orgId, values);
    } else {
      postDepositProductApiCall(orgId, values);
    }
  };

  const handleEditData = (data) => {
    setEditData(data);
    setOpenDialouge(true);
  };

  const buildPayload = (orgId, item, prodId = null) => {
    const payload = {
      org_id: Number(orgId),
      prd_type: Number(item.prdType),
      dep_type: Number(item.depType),
      product_name: item.productName || "",
      prd_sh_name: item.prdShName || "",
      interest_type: Number(item.interestType),
      min_amt: Number(item.minAmt),
      max_amt: toApiNumberOrNull(item.maxAmt),
      roi: Number(item.roi),
      min_dur: toApiNumberOrNull(item.minDur),
      max_dur: toApiNumberOrNull(item.maxDur),
      dur_unit: toApiNumberOrNull(item.durUnit),
      lock_days: toApiNumberOrNull(item.lockDays),
      passbook_fees: toApiNumberOrNull(item.passbookFees),
      default_fine: toApiNumberOrNull(item.defaultFine),
      fine_on: toApiNumberOrNull(item.fineOn),
      in_oper_month: toApiNumberOrNull(item.inOperMonth),
      in_dor_month: toApiNumberOrNull(item.inDorMonth),
      member_type: toApiNumberOrNull(item.memberType),
      prn_ledg: Number(item.prnLedg),
      intt_ledg: Number(item.inttLedg),
      prov_ledg: Number(item.provLedg),
      fine_ledg: toApiNumberOrNull(item.fineLedg),
      // New fields: withdrawal allocation & payout mode & agent allocation
      is_withdrawal: item.withdrawalAllocated ? 1 : 0,
      withdrawal_allocated: item.withdrawalAllocated ? 1 : 0,
      no_withdrawal: item.withdrawalAllocated
        ? toApiNumberOrNull(item.noOfWithdrawalInYear)
        : null,
      no_of_withdrawal: item.withdrawalAllocated
        ? toApiNumberOrNull(item.noOfWithdrawalInYear)
        : null,
      is_int_payout: item.interestPayout ? 1 : 0,
      interest_payout: item.interestPayout ? 1 : 0,
      payout_mode: item.interestPayout
        ? toApiNumberOrNull(item.payoutMode)
        : null,
      pay_mode: item.interestPayout
        ? toApiNumberOrNull(item.payoutMode)
        : null,
      is_agent: item.agentAllocated ? 1 : 0,
      agent_allocated: item.agentAllocated ? 1 : 0,
    };

    if (prodId) {
      payload.prod_id = Number(prodId);
    }

    return payload;
  };

  const postDepositProductApiCall = async (orgId, item) => {
    setPostLoading(true);
    try {
      const res = await postDepositProductAPI(buildPayload(orgId, item));
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset(defaultFormValues);
        setOpenDialouge(false);
        setCurrentPage(1);
        getDepositProductListApiCall(orgId, 1, pageLimit);
      } else {
        toast.error(res.details || res.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      const details = error?.response?.data?.details;
      if (details && typeof details === "object") {
        Object.values(details)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setPostLoading(false);
    }
  };

  const putDepositProductApiCall = async (prodId, orgId, item) => {
    setUpdateLoading(true);
    try {
      const res = await updateDepositProductAPI(
        buildPayload(orgId, item, prodId),
      );
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset(defaultFormValues);
        setOpenDialouge(false);
        getDepositProductListApiCall(orgId, currentPage, pageLimit);
      } else {
        toast.error(res.details || res.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      const details = error?.response?.data?.details;
      if (details && typeof details === "object") {
        Object.values(details)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const getDepositProductListApiCall = async (
    orgId,
    page = currentPage,
    limit = pageLimit,
  ) => {
    setGetLoading(true);
    try {
      const res = await getDepositProductListAPI(orgId, page, limit);
      if (res.message === "Data Found") {
        const list = Array.isArray(res.details)
          ? res.details
          : res.details?.data || [];
        dispatch(getDepositProductListData(list));
        setLastPage(res.details?.last_page || 1);
        if (res.details?.current_page) {
          setCurrentPage(res.details.current_page);
        }
      } else {
        dispatch(getDepositProductListData([]));
        setLastPage(res.details?.last_page || 0);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getDepositProductListData([]));
      setLastPage(0);
    } finally {
      setGetLoading(false);
    }
  };

  const getProductTypeDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getDepositProductTypeAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getProductTypeData(list));
    } catch (error) {
      console.error(error);
      dispatch(getProductTypeData([]));
    }
  };

  const depositTypeCacheRef = useRef({});

  const getDepositTypeApiCall = useCallback(async (orgId, prdType, force = false) => {
    if (!orgId || !prdType) {
      dispatch(getDepTypeData([]));
      return [];
    }
    const cacheKey = `${orgId}_${prdType}`;
    if (!force && depositTypeCacheRef.current[cacheKey]) {
      dispatch(getDepTypeData(depositTypeCacheRef.current[cacheKey]));
      return depositTypeCacheRef.current[cacheKey];
    }
    try {
      const res = await getDepositTypeAPI(orgId, prdType);
      const list = normalizeOptionRows(extractList(res));
      depositTypeCacheRef.current[cacheKey] = list;
      dispatch(getDepTypeData(list));
      return list;
    } catch (error) {
      console.error(error);
      dispatch(getDepTypeData([]));
      return [];
    }
  }, [dispatch]);

  const getDurationUnitDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getDepositDurationUnitAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getDurationUnitData(list));
    } catch (error) {
      console.error(error);
      dispatch(getDurationUnitData([]));
    }
  };

  const getMemberTypeDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getDepositProductMemberTypeAPI(orgId);
      const list = normalizeOptionRows(extractList(res), [
        "Option_Value",
        "Member_Type",
        "Type_Name",
        "Name",
      ]);
      dispatch(getMemberTypeData(list));
    } catch (error) {
      console.error(error);
      dispatch(getMemberTypeData([]));
    }
  };

  const getLedgerDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      // Same endpoint as Account Ledger report
      const res = await getDepositProductLedgerAPI(orgId);
      let list = normalizeOptionRows(extractList(res), [
        "Ledger_Name",
        "Option_Value",
        "Name",
      ]);

      // Fallback: Sub Ledger "under head" list (works on master screens)
      if (list.length === 0) {
        const headRes = await getDepositProductLedgerHeadAPI();
        list = normalizeOptionRows(extractList(headRes), [
          "Ledger_Name",
          "Option_Value",
          "Name",
        ]);
      }

      dispatch(getLedgerData(list));
    } catch (error) {
      console.error(error);
      try {
        const headRes = await getDepositProductLedgerHeadAPI();
        const list = normalizeOptionRows(extractList(headRes), [
          "Ledger_Name",
          "Option_Value",
          "Name",
        ]);
        dispatch(getLedgerData(list));
      } catch (fallbackError) {
        console.error(fallbackError);
        dispatch(getLedgerData([]));
      }
    }
  };

  const getInterestTypeDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getDepositInterestTypeAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getInterestTypeData(list));
    } catch (error) {
      console.error(error);
      dispatch(getInterestTypeData([]));
    }
  };

  const getFineOnDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getDepositChargeTypeAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getFineOnData(list));
    } catch (error) {
      console.error(error);
      dispatch(getFineOnData([]));
    }
  };

  const getPayoutModeDataApiCall = async (orgId) => {
    if (!orgId) return;
    try {
      const res = await getDepositProductPayoutModeAPI(orgId);
      const list = normalizeOptionRows(extractList(res));
      dispatch(getPayoutModeData(list));
    } catch (error) {
      console.error(error);
      dispatch(getPayoutModeData([]));
    }
  };

  const masterLoadedRef = useRef(false);
  const loadingMastersPromiseRef = useRef(null);

  const loadMasterDropdowns = useCallback(
    async (targetOrgId = orgId, force = false) => {
      if (!targetOrgId) return;
      if (!force && masterLoadedRef.current) return;
      if (loadingMastersPromiseRef.current) {
        return loadingMastersPromiseRef.current;
      }

      loadingMastersPromiseRef.current = Promise.all([
        getProductTypeDataApiCall(targetOrgId),
        getInterestTypeDataApiCall(targetOrgId),
        getDurationUnitDataApiCall(targetOrgId),
        getMemberTypeDataApiCall(targetOrgId),
        getLedgerDataApiCall(targetOrgId),
        getPayoutModeDataApiCall(targetOrgId),
        getFineOnDataApiCall(targetOrgId),
      ])
        .then(() => {
          masterLoadedRef.current = true;
        })
        .finally(() => {
          loadingMastersPromiseRef.current = null;
        });

      return loadingMastersPromiseRef.current;
    },
    [orgId],
  );

  useEffect(() => {
    if (editData && Object.keys(editData).length > 0) {
      form.reset({
        prdType: editData.Prd_Type?.toString() || "",
        depType: editData.Dep_Type?.toString() || "",
        productName: editData.Product_Name || "",
        prdShName: editData.Prd_SH_Name || "",
        interestType: editData.Interest_Type?.toString() || "",
        minAmt: editData.Min_Amount?.toString() || "",
        maxAmt: editData.Max_Amount?.toString() || "",
        roi: editData.ROI?.toString() || "",
        minDur: editData.Min_Dur?.toString() || "",
        maxDur: editData.Max_Dur?.toString() || "",
        durUnit: editData.Dur_Unit?.toString() || "",
        lockDays: editData.Lock_Days?.toString() || "",
        passbookFees: editData.Passbook_Fees?.toString() || "",
        defaultFine: editData.Default_Fine?.toString() || "",
        fineOn: editData.Fine_On?.toString() || "",
        inOperMonth: editData.In_Oper_Month?.toString() || "",
        inDorMonth: editData.In_Dor_Month?.toString() || "",
        memberType: editData.Member_Type?.toString() || "",
        prnLedg: editData.Prn_Ledg?.toString() || "",
        inttLedg: editData.Intt_Ledg?.toString() || "",
        provLedg: editData.Prov_Ledg?.toString() || "",
        fineLedg: editData.Fine_Ledg?.toString() || "",
        withdrawalAllocated: Boolean(
          Number(
            editData.Is_Withdrawal ??
              editData.Withdrawal_Allocated ??
              editData.withdrawal_allocated ??
              editData.is_withdrawal ??
              0,
          ) === 1,
        ),
        noOfWithdrawalInYear:
          (
            editData.No_Withdrawal ??
            editData.No_Of_Withdrawal ??
            editData.no_withdrawal ??
            editData.no_of_withdrawal ??
            ""
          )?.toString() || "",
        interestPayout: Boolean(
          Number(
            editData.Is_Int_Payout ??
              editData.Interest_Payout ??
              editData.is_int_payout ??
              editData.interest_payout ??
              0,
          ) === 1,
        ),
        payoutMode:
          (
            editData.Payout_Mode ??
            editData.Pay_Mode ??
            editData.payout_mode ??
            editData.pay_mode ??
            ""
          )?.toString() || "",
        agentAllocated: Boolean(
          Number(
            editData.Is_Agent ??
              editData.Agent_Allocated ??
              editData.is_agent ??
              editData.agent_allocated ??
              0,
          ) === 1,
        ),
      });
    } else {
      form.reset(defaultFormValues);
    }
  }, [editData, form.reset]);

  useEffect(() => {
    if (!openDialouge) {
      setEditData(null);
      form.reset(defaultFormValues);
      dispatch(getDepTypeData([]));
    }
  }, [openDialouge, dispatch]);

  return {
    getLoading,
    postLoading,
    updateLoading,
    openDialouge,
    setOpenDialouge,
    form,
    handleSubmit,
    editData,
    handleEditData,
    getDepositProductListApiCall,
    getProductTypeDataApiCall,
    getDepositTypeApiCall,
    getInterestTypeDataApiCall,
    getDurationUnitDataApiCall,
    getMemberTypeDataApiCall,
    getLedgerDataApiCall,
    getPayoutModeDataApiCall,
    getFineOnDataApiCall,
    loadMasterDropdowns,
    currentPage,
    setCurrentPage,
    lastPage,
    pageLimit,
  };
};
