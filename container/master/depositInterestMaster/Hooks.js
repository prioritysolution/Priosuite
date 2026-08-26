"use client";

import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { postDepositInterestSetupAPI } from "./DepositInterestSetupApis";
import { getDepositInterestProductData } from "./DepositInterestSetupReducer";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import { getDepositProductDataAPI } from "@/container/deposit/openDepositAccount/OpenDepositAccountApis";
import { formatDateForApi } from "@/utils/dateHelpers";

export const useDepositInterestSetup = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const orgId = getCookieData("orgId");

  const depositInterestProductData = useSelector(
    (state) => state?.depositInterestSetup?.depositInterestProductData,
  );

  const formSchema = yup.object({
    productId: yup.string().required("Product is required"),
    effectFrom: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .typeError("Invalid date")
      .required("Effect from date is required"),
    // effectUpto: yup.date().required("Effect upto date is required"),
    minimumDuration: yup
      .string()
      .required("Minimun duration is required") // Required validation
      .test(
        "is-integer",
        "Minimun duration must be a non-decimal number",
        (value) => {
          if (value === null || value === "") return false; // Required validation triggers first
          const numberValue = Number(value);
          return Number.isInteger(numberValue); // Ensure it's a non-decimal number
        },
      )
      .test(
        "is-positive",
        "Minimun duration must be greater than 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation triggers first
          return Number(value) > 0; // Ensure it's greater than 0
        },
      ),
    maximumDuration: yup
      .string()
      .required("Maximum duration is required") // Required validation
      .test(
        "is-integer",
        "Maximum duration must be a non-decimal number",
        (value) => {
          if (value === null || value === "") return false; // Required validation triggers first
          const numberValue = Number(value);
          return Number.isInteger(numberValue); // Ensure it's a non-decimal number
        },
      )
      .test(
        "is-positive",
        "Maximum duration must be greater than 0",
        (value) => {
          if (value === null || value === "") return false; // Required validation triggers first
          return Number(value) > 0; // Ensure it's greater than 0
        },
      ),
    durationUnit: yup.string().required("Duration unit is required"),
    rateOfInterest: yup
      .string()
      .test(
        "is-required-rateOfInterest",
        "Rate of interest is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false; // Fail if empty or null
          }
          return true; // Pass if not empty
        },
      )
      .test(
        "is-positive-number",
        "Rate of interest must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0; // Ensure the value is greater than 0
        },
      )
      .test(
        "is-valid-decimal",
        "Rate of interest can have at most two decimal places",
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
      productId: "",
      effectFrom: null,
      // effectUpto: null,
      minimumDuration: "",
      maximumDuration: "",
      durationUnit: "",
      rateOfInterest: "",
    },
  });

  const handleAddTableData = (values) => {
    const selectedProduct = depositInterestProductData.find(
      (item) => item.Id.toString() === values.productId,
    );

    const newEntry = {
      productName: selectedProduct?.Prd_SH_Name || "",
      min_dur: values.minimumDuration,
      max_dur: values.maximumDuration,
      dur_unit: values.durationUnit,
      roi: values.rateOfInterest,
      effect_frm: formatDateForApi(values.effectFrom),
      // eff_to: formatDateForApi(values.effectUpto),
      eff_to: null,
    };

    setTableData((prev) => [...prev, newEntry]);

    form.resetField("effectFrom");
    // form.resetField("effectUpto");
    form.resetField("minimumDuration");
    form.resetField("maximumDuration");
    form.resetField("durationUnit");
    form.resetField("rateOfInterest");
    // postShareProductApiCall(values);
  };

  const handleSubmit = () => {
    postShareProductApiCall();
  };

  const postShareProductApiCall = async () => {
    const data = {
      prod_id: form.getValues("productId"),
      slab_data: tableData,
      org_id: orgId,
    };
    setLoading(true);

    console.log("postShareProductApiCall data=", data);

    try {
      const res = await postDepositInterestSetupAPI(data);
      if (res.message === "Success") {
        toast.success(res.details);
        form.reset();
        setTableData([]);
      } else toast.error(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getDepositInterestProductApiCall = async (orgId) => {
    try {
      const res = await getDepositProductDataAPI(orgId, 2);
      if (res.message === "Data Found") {
        dispatch(getDepositInterestProductData(res.details));
      } else {
        dispatch(getDepositInterestProductData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getDepositInterestProductData([]));
    }
  };

  return {
    loading,
    getDepositInterestProductApiCall,
    handleSubmit,
    handleAddTableData,
    form,
    tableData,
  };
};
