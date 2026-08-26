"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  getOpeningLedgerAPI,
  getOpeningLedgerBranchAPI,
  getOpeningLedgerMainHeadAPI,
  getOpeningLedgerSubHeadAPI,
  postOpeningLedgerAPI,
} from "./LedgerBalanceApis";
import {
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
    mainHead: yup.string().required("Main head is required"),
    subHead: yup.string().required("Sub head is required"),
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
      mainHead: "",
      subHead: "",
      ledger: "",
      openingBalance: "",
    },
  });

  const { control } = form;
  const { mainHead, subHead } = useWatch({ control });

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
        form.reset();
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

  const getOpeningLedgerMainHeadApiCall = async () => {
    setLoading(true);

    try {
      const res = await getOpeningLedgerMainHeadAPI();
      if (res.message === "Data Found") {
        dispatch(getMainHeadData(res.details));
      } else {
        dispatch(getMainHeadData([]));
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getMainHeadData([]));
    } finally {
      setLoading(false);
    }
  };

  const getOpeningLedgerSubHeadApiCall = async (headId) => {
    setGetSubHeadLoading(true);

    try {
      const res = await getOpeningLedgerSubHeadAPI(headId);
      if (res.message === "Data Found") {
        dispatch(getSubHeadData(res.details));
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
      const res = await getOpeningLedgerAPI(subId);
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
    if (mainHead && token) {
      getOpeningLedgerSubHeadApiCall(mainHead);
    }
    form.setValue("subHead", "");
  }, [mainHead, token]);

  useEffect(() => {
    if (subHead && token) {
      getOpeningLedgerApiCall(subHead);
    }
    form.setValue("ledger", "");
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
    getOpeningLedgerMainHeadApiCall,
  };
};
