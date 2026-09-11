"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getOpeningLedgerAPI,
  getOpeningLedgerAcctTypeAPI,
  getOpeningLedgerBranchAPI,
  getOpeningLedgerMainHeadAPI,
  getOpeningLedgerSubHeadAPI,
  postOpeningLedgerAPI,
} from "./LedgerBalanceApis";
import {
  getAcctTypeData,
  getBranchData,
  getLedgerData,
  getMainHeadData,
  getSubHeadData,
} from "./LedgerBalanceReducer";
import { useDispatch, useSelector } from "react-redux";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";

export const useLedgerBalance = () => {
  const dispatch = useDispatch();

  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [loading, setLoading] = useState(false);
  const [getSubHeadLoading, setGetSubHeadLoading] = useState(false);
  const [getLedgerLoading, setGetLedgerLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const startDate = getCookieData("fin_start_date");

  const formSchema = yup.object({
    branch: yup.string().required("Branch is required"),
    acctType: yup.string().required("Account category is required"),
    mainHead: yup.string().required("Main head is required"),
    subHead: yup.string().required("Sub head is required"),
    ledger: yup.string().required("Ledger is required"),
    openingBalance: yup
      .string()
      .test(
        "is-required-openingBalance",
        "Opening balance is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        },
      )
      .test(
        "is-positive-number",
        "Opening balance must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Opening balance can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false; // Invalid decimal (more than 2 decimal places)
          }
          return true;
        },
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      branch: branchId,
      acctType: "",
      mainHead: "",
      subHead: "",
      ledger: "",
      openingBalance: "",
    },
  });

  const { control } = form;
  const { acctType, mainHead, subHead } = useWatch({ control });

  const handleSubmit = async (values) => {
    postOpeningLedgerApiCall(values);
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const postOpeningLedgerApiCall = async (item) => {
    let data = {
      open_date: startDate,
      acct_id: item.ledger,
      open_balance: item.openingBalance,
      branch_Id: item.branch,
      org_id: orgId,
    };

    setLoading(true);

    try {
      const res = await postOpeningLedgerAPI(data);

      if (res.message === "Success") {
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset({
          branch: branchId,
          acctType: "",
          mainHead: "",
          subHead: "",
          ledger: "",
          openingBalance: "",
        });
        dispatch(getMainHeadData([]));
        dispatch(getSubHeadData([]));
        dispatch(getLedgerData([]));
      } else {
        toast.error(res.details);
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const getOpeningLedgerBranchApiCall = async (orgId, branchId) => {
    setLoading(true);

    try {
      const res = await getOpeningLedgerBranchAPI(orgId, branchId);
      if (res.message === "Data Found") {
        dispatch(getBranchData(res.details));
      } else {
        dispatch(getBranchData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getBranchData([]));
    } finally {
      setLoading(false);
    }
  };

  const getOpeningLedgerAcctTypeApiCall = async (orgId) => {
    try {
      const res = await getOpeningLedgerAcctTypeAPI(orgId);
      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(getAcctTypeData(res.details || res.Data || []));
      } else {
        dispatch(getAcctTypeData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getAcctTypeData([]));
    }
  };

  const getOpeningLedgerMainHeadApiCall = async (acctTypeId) => {
    if (!orgId || !acctTypeId) {
      dispatch(getMainHeadData([]));
      return;
    }

    try {
      const res = await getOpeningLedgerMainHeadAPI(orgId, acctTypeId);
      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(getMainHeadData(res.details || res.Data || []));
      } else {
        dispatch(getMainHeadData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getMainHeadData([]));
    }
  };

  const getOpeningLedgerSubHeadApiCall = async (headId) => {
    setGetSubHeadLoading(true);

    try {
      const res = await getOpeningLedgerSubHeadAPI(orgId, headId);
      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(getSubHeadData(res.details || res.Data || []));
      } else {
        dispatch(getSubHeadData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getSubHeadData([]));
    } finally {
      setGetSubHeadLoading(false);
    }
  };

  const getOpeningLedgerApiCall = async (subId) => {
    setGetLedgerLoading(true);

    try {
      const res = await getOpeningLedgerAPI(orgId, subId);
      if (res.message === "Data Found") {
        dispatch(getLedgerData(res.details));
      } else {
        dispatch(getLedgerData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getLedgerData([]));
    } finally {
      setGetLedgerLoading(false);
    }
  };

  useEffect(() => {
    form.setValue("mainHead", "");
    form.setValue("subHead", "");
    form.setValue("ledger", "");
    dispatch(getSubHeadData([]));
    dispatch(getLedgerData([]));
    if (acctType && token) {
      getOpeningLedgerMainHeadApiCall(acctType);
    } else {
      dispatch(getMainHeadData([]));
    }
  }, [acctType, token]);

  useEffect(() => {
    form.setValue("subHead", "");
    form.setValue("ledger", "");
    dispatch(getLedgerData([]));
    if (mainHead && token) {
      getOpeningLedgerSubHeadApiCall(mainHead);
    } else {
      dispatch(getSubHeadData([]));
    }
  }, [mainHead, token]);

  useEffect(() => {
    form.setValue("ledger", "");
    if (subHead && token) {
      getOpeningLedgerApiCall(subHead);
    } else {
      dispatch(getLedgerData([]));
    }
  }, [subHead, token]);

  return {
    loading,
    getLedgerLoading,
    getSubHeadLoading,
    form,
    handleSubmit,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    getOpeningLedgerBranchApiCall,
    getOpeningLedgerAcctTypeApiCall,
  };
};
