"use client";

import { useDispatch } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getPassbookModuleAPI,
  addPassbookSettingsAPI,
  getPassbookConfigAPI,
} from "./PassbookSettingsApis";
import { getModuleData } from "./PassbookSettingsReducer";
import getCookieData from "@/utils/getCookieData";

export const usePassbookSettings = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [configId, setConfigId] = useState(null);

  const orgId = getCookieData("orgId");

  const formSchema = yup.object({
    moduleId: yup.string().required("Module is required"),
    pageHeight: yup
      .string()
      .required("Page height is required") // Required error for null or empty string
      .test("is-integer", "Page height must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "Page height must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
    pageWidth: yup
      .string()
      .required("Page width is required") // Required error for null or empty string
      .test("is-integer", "Page width must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "Page width must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
    firstPageTop: yup
      .string()
      .required("First page top is required") // Required error for null or empty string
      .test("is-integer", "First page top must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "First page top must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
    firstPageLine: yup
      .string()
      .required("First page line is required") // Required error for null or empty string
      .test("is-integer", "First page line must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "First page line must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
    secondPageLine: yup
      .string()
      .required("Second page line is required") // Required error for null or empty string
      .test("is-integer", "Second page line must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "Second page line must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
    middlePageGap: yup
      .string()
      .required("Middle page gap is required") // Required error for null or empty string
      .test("is-integer", "Middle page gap must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "Middle page gap must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
    nextPageGap: yup
      .string()
      .required("Next page gap is required") // Required error for null or empty string
      .test("is-integer", "Next page gap must be an integer", (value) => {
        if (value === null || value === "") return false; // Required validation will trigger
        const numberValue = Number(value);
        return Number.isInteger(numberValue); // Ensure it's an integer
      })
      .test(
        "is-non-negative",
        "Next page gap must be greater than or equal to 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation will trigger
          return Number(value) >= 0; // Ensure it's non-negative
        }
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      moduleId: "",
      pageHeight: "",
      pageWidth: "",
      firstPageTop: "",
      firstPageLine: "",
      secondPageLine: "",
      middlePageGap: "",
      nextPageGap: "",
    },
  });

  const { moduleId } = form.watch();

  const handleSubmit = (values) => {
    addPassbookSettingsApiCall(values);
  };

  const addPassbookSettingsApiCall = async (item) => {
    setLoading(true);

    let data = {
      module_id: item.moduleId,
      page_height: item.pageHeight,
      page_weidth: item.pageWidth,
      fst_top: item.firstPageTop,
      fst_page_line: item.firstPageLine,
      last_page_line: item.secondPageLine,
      mid_gap: item.middlePageGap,
      next_page_gap: item.nextPageGap,
      conf_id: configId,
      org_id: orgId,
    };

    try {
      const res = await addPassbookSettingsAPI(data);
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset();
      } else toast.error(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getModuleDataApiCall = async (orgId) => {
    try {
      const res = await getPassbookModuleAPI(orgId);
      if (res.message === "Data Found") {
        dispatch(getModuleData(res.details));
      } else {
        dispatch(getModuleData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getModuleData([]));
    }
  };

  const getPassbookConfigApiCall = async (orgId, moduleId) => {
    try {
      const res = await getPassbookConfigAPI(orgId, moduleId);
      if (res.message === "Data Found") {
        setConfigId(res.details[0].Id);
        form.setValue("pageHeight", res.details[0].Page_Height);
        form.setValue("pageWidth", res.details[0].Page_Width);
        form.setValue("firstPageTop", res.details[0].Fst_Page_Top);
        form.setValue("firstPageLine", res.details[0].Line_No_Fst_Page);
        form.setValue("secondPageLine", res.details[0].Line_No_Scnd_Page);
        form.setValue("middlePageGap", res.details[0].Mid_Gap);
        form.setValue("nextPageGap", res.details[0].Next_Page_Gap);
      } else {
        setConfigId(null);
        form.setValue("pageHeight", "");
        form.setValue("pageWidth", "");
        form.setValue("firstPageTop", "");
        form.setValue("firstPageLine", "");
        form.setValue("secondPageLine", "");
        form.setValue("middlePageGap", "");
        form.setValue("nextPageGap", "");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setConfigId(null);
      form.setValue("pageHeight", "");
      form.setValue("pageWidth", "");
      form.setValue("firstPageTop", "");
      form.setValue("firstPageLine", "");
      form.setValue("secondPageLine", "");
      form.setValue("middlePageGap", "");
      form.setValue("nextPageGap", "");
    }
  };

  useEffect(() => {
    if (orgId && moduleId) getPassbookConfigApiCall(orgId, moduleId);
  }, [orgId, moduleId]);

  return {
    loading,
    getModuleDataApiCall,
    handleSubmit,
    form,
  };
};
