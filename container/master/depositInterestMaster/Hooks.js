"use client";

import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
  getDepositIntSlabListAPI,
  postDepositInterestSetupAPI,
  updateDepositIntSlabAPI,
} from "./DepositInterestSetupApis";
import {
  getDepositInterestProductData,
  getInterestSlabListData,
} from "./DepositInterestSetupReducer";
import { maxTwoDecimalPlaces } from "@/utils/validationRegex";
import { getDepositProductDataAPI } from "@/container/deposit/openDepositAccount/OpenDepositAccountApis";
import { formatDateForApi } from "@/utils/dateHelpers";

export const useDepositInterestSetup = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [openSlabListModal, setOpenSlabListModal] = useState(false);
  const [getSlabListLoading, setGetSlabListLoading] = useState(false);
  const [editingSlab, setEditingSlab] = useState(null);
  const [slabCurrentPage, setSlabCurrentPage] = useState(1);
  const [slabLastPage, setSlabLastPage] = useState(1);
  const [slabPageLimit] = useState(25);

  const orgId = getCookieData("orgId");

  const depositInterestProductData = useSelector(
    (state) => state?.depositInterestSetup?.depositInterestProductData,
  );

  const durationUnitData = useSelector(
    (state) => state?.openDepositAccount?.durationTypeData,
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
        "Rate of interest (General) is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false;
          }
          return true;
        },
      )
      .test(
        "is-positive-number",
        "Rate of interest (General) must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0;
        },
      )
      .test(
        "is-valid-decimal",
        "Rate of interest (General) can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false;
          }
          return true;
        },
      ),
    srCitizenRateOfInterest: yup
      .string()
      .test(
        "is-required-srCitizenRateOfInterest",
        "Rate of interest (Sr Citizen) is required",
        function (value) {
          if (!value || value.trim() === "") {
            return false;
          }
          return true;
        },
      )
      .test(
        "is-positive-number",
        "Rate of interest (Sr Citizen) must be greater than 0",
        (value) => {
          const numValue = parseFloat(value);
          return numValue > 0;
        },
      )
      .test(
        "is-valid-decimal",
        "Rate of interest (Sr Citizen) can have at most two decimal places",
        (value) => {
          if (value && !maxTwoDecimalPlaces.test(value)) {
            return false;
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
      srCitizenRateOfInterest: "",
      slabId: null,
    },
  });

  const handleAddTableData = (values) => {
    const selectedProduct = depositInterestProductData.find(
      (item) => item.Id.toString() === values.productId,
    );

    const selectedDurationUnit = durationUnitData?.find(
      (item) => item.Option_Id?.toString() === values.durationUnit?.toString() ||
                item.Id?.toString() === values.durationUnit?.toString(),
    );

    const newEntry = {
      productName: selectedProduct?.Prd_SH_Name || "",
      min_dur: values.minimumDuration,
      max_dur: values.maximumDuration,
      dur_unit: values.durationUnit,
      dur_unit_name: selectedDurationUnit?.Option_Value || values.durationUnit,
      roi: values.rateOfInterest,
      general_roi: values.rateOfInterest,
      sr_ctz_roi: values.srCitizenRateOfInterest,
      sr_citizen_roi: values.srCitizenRateOfInterest,
      sr_citizen: values.srCitizenRateOfInterest,
      effect_frm: formatDateForApi(values.effectFrom),
      eff_to: null,
    };

    setTableData((prev) => [...prev, newEntry]);

    form.resetField("effectFrom");
    // form.resetField("effectUpto");
    form.resetField("minimumDuration");
    form.resetField("maximumDuration");
    form.resetField("durationUnit");
    form.resetField("rateOfInterest");
    form.resetField("srCitizenRateOfInterest");
    // postShareProductApiCall(values);
  };

  const handleSubmit = () => {
    postShareProductApiCall();
  };

  const postShareProductApiCall = async () => {
    if (!tableData || tableData.length === 0) {
      toast.error("Please add at least one slab before submitting");
      return;
    }

    const prodId = form.getValues("productId");
    if (!prodId) {
      toast.error("Product is required");
      return;
    }

    const formattedSlabData = tableData.map((item) => ({
      min_dur: Number(item.min_dur) ?? item.min_dur,
      max_dur: Number(item.max_dur) ?? item.max_dur,
      dur_unit: Number(item.dur_unit) ?? item.dur_unit,
      roi: Number(item.roi) ?? item.roi,
      sr_ctz_roi:
        Number(item.sr_ctz_roi ?? item.sr_citizen_roi ?? item.sr_citizen) ??
        item.sr_ctz_roi,
      effect_frm: item.effect_frm,
    }));

    const orgIdNum = Number(orgId) ?? orgId;
    const prodIdNum = Number(prodId) ?? prodId;

    const data = {
      // API expects slab_data with exact types and keys
      prod_id: prodIdNum,
      org_id: orgIdNum,
      slab_data: formattedSlabData,

      // PascalCase aliases for compatibility
      Prod_id: prodIdNum,
      Org_id: orgIdNum,
      Slab_data: formattedSlabData,
    };
    setLoading(true);

    console.log("postDepositInterestSetupAPI data=", data);

    try {
      const res = await postDepositInterestSetupAPI(data);
      if (res.message === "Success" || res.message === "Data Added Successfully") {
        toast.success(res.details || res.message || "Deposit interest slab added successfully");
        form.reset();
        setTableData([]);
      } else {
        toast.error(res.details || res.message || "Failed to add interest slab");
      }
    } catch (error) {
      console.error(error);
      const details = error?.response?.data?.details;
      if (details && typeof details === "object") {
        Object.values(details)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
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

  const handleEditSlab = (slab) => {
    if (!slab) return;
    setEditingSlab(slab);
    setOpenSlabListModal(false);

    const slabId =
      slab.Id ??
      slab.id ??
      slab.Slab_id ??
      slab.Slab_Id ??
      slab.slab_id ??
      null;

    const prodId =
      slab.Prod_Id ??
      slab.Prod_id ??
      slab.prod_id ??
      slab.Product_Id ??
      slab.ProductId ??
      slab.productId ??
      "";

    const effectFromVal =
      slab.Effect_Frm ??
      slab.effect_frm ??
      slab.Effect_From ??
      slab.Effect_frm ??
      slab.effect_from ??
      null;

    const minDurVal = slab.Min_Dur ?? slab.min_dur ?? "";
    const maxDurVal = slab.Max_Dur ?? slab.max_dur ?? "";
    const durUnitVal =
      slab.Dur_Unit ??
      slab.dur_unit ??
      slab.durationUnit ??
      "";
    const roiVal = slab.Roi ?? slab.roi ?? slab.general_roi ?? "";
    const srCtzRoiVal =
      slab.Sr_Citign_Roi ??
      slab.sr_citign_roi ??
      slab.Sr_Ctz_Roi ??
      slab.sr_ctz_roi ??
      slab.sr_citizen_roi ??
      slab.sr_citizen ??
      "";

    form.setValue("slabId", slabId);
    if (prodId) form.setValue("productId", String(prodId));
    if (effectFromVal) {
      form.setValue("effectFrom", new Date(effectFromVal));
    }
    form.setValue("minimumDuration", minDurVal != null ? String(minDurVal) : "");
    form.setValue("maximumDuration", maxDurVal != null ? String(maxDurVal) : "");
    if (durUnitVal) form.setValue("durationUnit", String(durUnitVal));
    form.setValue("rateOfInterest", roiVal != null ? String(roiVal) : "");
    form.setValue(
      "srCitizenRateOfInterest",
      srCtzRoiVal != null ? String(srCtzRoiVal) : "",
    );
  };

  const handleCancelEdit = () => {
    setEditingSlab(null);
    form.reset();
  };

  const [filterProductId, setFilterProductId] = useState(0);

  const getDepositIntSlabListApiCall = async (
    targetOrgId = orgId,
    targetProdId = filterProductId,
    page = slabCurrentPage,
    limit = slabPageLimit,
  ) => {
    if (!targetOrgId) return;
    setGetSlabListLoading(true);
    try {
      const res = await getDepositIntSlabListAPI(
        targetOrgId,
        targetProdId || 0,
        page,
        limit,
      );
      if (res.message === "Data Found" || res.message === "Success") {
        const list = Array.isArray(res.details)
          ? res.details
          : Array.isArray(res.details?.data)
          ? res.details.data
          : Array.isArray(res.Data)
          ? res.Data
          : Array.isArray(res.data)
          ? res.data
          : [];

        dispatch(getInterestSlabListData(list));

        const totalPages =
          res.pagination?.total_pages ??
          res.details?.last_page ??
          res.last_page ??
          1;
        const currentPage =
          res.pagination?.current_page ??
          res.details?.current_page ??
          res.current_page ??
          page;

        setSlabLastPage(totalPages);
        setSlabCurrentPage(currentPage);
      } else {
        dispatch(getInterestSlabListData([]));
        setSlabLastPage(1);
      }
    } catch (error) {
      console.error(error);
      dispatch(getInterestSlabListData([]));
      setSlabLastPage(1);
    } finally {
      setGetSlabListLoading(false);
    }
  };

  const updateDepositIntSlabApiCall = async (values) => {
    const prodId = values?.productId || form.getValues("productId");
    const slabId =
      values?.slabId ||
      form.getValues("slabId") ||
      editingSlab?.Slab_id ||
      editingSlab?.Slab_Id ||
      editingSlab?.slab_id ||
      editingSlab?.Id ||
      editingSlab?.id;

    if (!slabId) {
      toast.error("Slab Id is required for update");
      return;
    }

    const singleSlab = {
      min_dur: Number(values.minimumDuration) ?? values.minimumDuration,
      max_dur: Number(values.maximumDuration) ?? values.maximumDuration,
      dur_unit: Number(values.durationUnit) ?? values.durationUnit,
      roi: Number(values.rateOfInterest) ?? values.rateOfInterest,
      sr_ctz_roi:
        Number(values.srCitizenRateOfInterest) ?? values.srCitizenRateOfInterest,
      effect_frm: formatDateForApi(values.effectFrom),
      slab_id: Number(slabId) ?? slabId,
      Slab_id: Number(slabId) ?? slabId,
    };

    const orgIdNum = Number(orgId) ?? orgId;
    const prodIdNum = Number(prodId) ?? prodId;
    const slabIdNum = Number(slabId) ?? slabId;

    const data = {
      // Lowercase keys
      prod_id: prodIdNum,
      org_id: orgIdNum,
      slab_id: slabIdNum,
      slab_data: [singleSlab],

      // PascalCase aliases
      Prod_id: prodIdNum,
      Org_id: orgIdNum,
      Slab_id: slabIdNum,
      Slab_data: [singleSlab],
    };

    setLoading(true);
    try {
      const res = await updateDepositIntSlabAPI(data);
      if (res.message === "Success" || res.message === "Data Updated Successfully") {
        toast.success(res.details || res.message || "Interest slab updated successfully");
        setEditingSlab(null);
        form.reset();
        getDepositIntSlabListApiCall(orgId, prodIdNum || 0, slabCurrentPage, slabPageLimit);
      } else {
        toast.error(res.details || res.message || "Failed to update interest slab");
      }
    } catch (error) {
      console.error(error);
      const details = error?.response?.data?.details;
      if (details && typeof details === "object") {
        Object.values(details)
          .flat()
          .forEach((msg) => toast.error(msg));
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTableData = (indexToRemove) => {
    setTableData((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFormAction = (values) => {
    if (editingSlab) {
      updateDepositIntSlabApiCall(values);
    } else {
      handleAddTableData(values);
    }
  };

  return {
    loading,
    getDepositInterestProductApiCall,
    handleSubmit,
    handleAddTableData,
    handleRemoveTableData,
    handleFormAction,
    openSlabListModal,
    setOpenSlabListModal,
    getSlabListLoading,
    editingSlab,
    handleEditSlab,
    handleCancelEdit,
    getDepositIntSlabListApiCall,
    slabCurrentPage,
    setSlabCurrentPage,
    slabLastPage,
    slabPageLimit,
    filterProductId,
    setFilterProductId,
    form,
    tableData,
  };
};
