"use client";

import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  getInstitutionProfileAPI,
  getInstitutionProfileDataById,
  getUpdateInstitutionDataByIdAPI,
  postInstitutionProfileAPI,
  updateInstitutionProfile,
  updateInstitutionProfileAPI,
} from "./institutionProfileApis";

import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import getCookieData from "../../../utils/getCookieData";
import toast from "react-hot-toast";
import {
  alphanumericRegex,
  mobileLengthRegex,
  mobileNoLeadingZeroRegex,
} from "../../../utils/validationRegex";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
// Import operational area APIs
import {
  getMasterDistrictUnderStateAPI,
  getMasterBlockUnderDistrictAPI,
  getMasterPoliceStationUnderDistrictAPI,
  getMasterPostOfficeUnderDistrictAPI,
  getMasterVillageUnderBlockAPI,
} from "../../master/operationalArea/OperationalAreaApis";
// Import Redux actions for operational area
import {
  getDistrictUnderStateData,
  getBlockUnderDistrictData,
  getPoliceStationUnderDistrictData,
  getPostOfficeUnderDistrictData,
  getVillageUnderBlockData,
} from "../../master/operationalArea/OperationalAreaReducer";

const buildRegisterKeys = (item, fallback = {}) => ({
  inst_add: item.inst_add || fallback.inst_add || "",
  inst_state: item.stateId || fallback.inst_state || "",
  inst_dist: item.districtId || fallback.inst_dist || "",
  inst_block: item.blockId || fallback.inst_block || "",
  inst_village: item.villageId || fallback.inst_village || "",
  inst_police: item.policeStationId || fallback.inst_police || "",
  inst_post: item.postOfficeId || fallback.inst_post || "",
});

const buildOfficeKeys = (item, fallback = {}, sameAsRegister, register) => {
  if (sameAsRegister === "Y") {
    return {
      inst_off_add: register.inst_add,
      inst_off_state: register.inst_state,
      inst_off_dist: register.inst_dist,
      inst_off_block: register.inst_block,
      inst_off_village: register.inst_village,
      inst_off_police: register.inst_police,
      inst_off_post: register.inst_post,
    };
  }

  return {
    inst_off_add: item.officeAddress || fallback.inst_off_add || "",
    inst_off_state: item.officeStateId || fallback.inst_off_state || "",
    inst_off_dist: item.officeDistrictId || fallback.inst_off_dist || "",
    inst_off_block: item.officeBlockId || fallback.inst_off_block || "",
    inst_off_village: item.officeVillageId || fallback.inst_off_village || "",
    inst_off_police:
      item.officePoliceStationId || fallback.inst_off_police || "",
    inst_off_post: item.officePostOfficeId || fallback.inst_off_post || "",
  };
};

export const useInstitutionProfile = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");

  const [loading, setLoading] = useState(false);
  const [isLoadingMemberData, setIsLoadingMemberData] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [getInstitutionLoading, setGetInstitutionLoading] = useState(false);
  const [updateInstitutionData, setUpdateInstitutionData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Get data from Redux state
  const groupTypeData = useSelector(
    (state) => state?.groupProfile?.groupTypeData,
  );

  const formSchema = yup.object({
    type: yup.string().required("Type is required"),
    inst_no: yup
      .string()
      .nullable() // Allows null or empty values
      .test("is-alphanumeric", "Group no. must be alphanumeric", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return alphanumericRegex.test(value); // Check if the value is alphanumeric
      })
      .test("max-length", "Group no. must not exceed 5 characters", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return value.length <= 5; // Check if the length is within 5 characters
      })
      .test("no-leading-zero", "Group no. cannot start with 0", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return !value.startsWith("0"); // Ensure it does not start with 0
      }),
    inst_name: yup.string().required("Group name is required"),
    inst_dob: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Date of formation is required"),
    inst_ben: yup
      .number()
      .typeError("No of beneficiary must be a number")
      .positive("No of beneficiary must be positive")
      .integer("No of beneficiary must be an integer")
      .required("No of beneficiary is required"),
    inst_mob: yup
      .string()
      .nullable() // Allows null or empty values
      .test("no-leading-zero", "Mobile no. must not start with 0", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return !value.startsWith("0"); // Ensure it does not start with 0
      })
      .test(
        "is-exactly-10-digits",
        "Mobile no. must be exactly 10 digits",
        (value) => {
          if (!value) return true; // Skip validation for null or empty values
          return mobileLengthRegex.test(value); // Validate exact 10 digits
        },
      ),
    inst_add: yup
      .string()
      .required("Register address is required")
      .max(200, "Address must be at most 200 characters"),
    sameAsRegister: yup.string().oneOf(["Y", "N"]).required(),
    officeAddress: yup
      .string()
      .required("Office address is required")
      .max(200, "Address must be at most 200 characters"),
    stateId: yup
      .string()
      .test("is-required-if-type-A", "State is required", function (value) {
        return this.parent.type !== "A" || !!value;
      }),
    districtId: yup
      .string()
      .test("is-required-if-type-A", "District is required", function (value) {
        return this.parent.type !== "A" || !!value;
      }),
    blockId: yup
      .string()
      .test("is-required-if-type-A", "Block is required", function (value) {
        return this.parent.type !== "A" || !!value;
      }),
    villageId: yup.string(),
    policeStationId: yup.string(),
    postOfficeId: yup.string(),
    officeStateId: yup
      .string()
      .test(
        "is-required-if-type-A",
        "Office state is required",
        function (value) {
          return this.parent.type !== "A" || !!value;
        },
      ),
    officeDistrictId: yup
      .string()
      .test(
        "is-required-if-type-A",
        "Office district is required",
        function (value) {
          return this.parent.type !== "A" || !!value;
        },
      ),
    officeBlockId: yup
      .string()
      .test(
        "is-required-if-type-A",
        "Office block is required",
        function (value) {
          return this.parent.type !== "A" || !!value;
        },
      ),
    officeVillageId: yup.string(),
    officePoliceStationId: yup.string(),
    officePostOfficeId: yup.string(),
    branch_id: yup.string().required("Branch is required"),
    org_id: yup.string().required("Organization is required"),
    int_doc: yup.string().required("Registration / Document No is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      type: "A",
      inst_no: "",
      inst_name: "",
      inst_dob: null,
      inst_add: "",
      sameAsRegister: "N",
      officeAddress: "",
      stateId: "",
      districtId: "",
      blockId: "",
      villageId: "",
      policeStationId: "",
      postOfficeId: "",
      officeStateId: "",
      officeDistrictId: "",
      officeBlockId: "",
      officeVillageId: "",
      officePoliceStationId: "",
      officePostOfficeId: "",
      inst_ben: "",
      branch_id: getCookieData("userBranchId") || "",
      org_id: getCookieData("orgId") || "",
      inst_mob: "",
      int_doc: "",
    },
  });

  const { control } = form;
  const {
    stateId,
    districtId,
    blockId,
    villageId,
    policeStationId,
    postOfficeId,
    inst_add,
    sameAsRegister,
    officeStateId,
    officeDistrictId,
    officeBlockId,
  } = useWatch({ control });

  const [officeDistrictData, setOfficeDistrictData] = useState([]);
  const [officeBlockData, setOfficeBlockData] = useState([]);
  const [officeVillageData, setOfficeVillageData] = useState([]);
  const [officePoliceStationData, setOfficePoliceStationData] = useState([]);
  const [officePostOfficeData, setOfficePostOfficeData] = useState([]);
  const [officeGetDistrictLoading, setOfficeGetDistrictLoading] =
    useState(false);
  const [officeGetBlockLoading, setOfficeGetBlockLoading] = useState(false);
  const [officeGetPoliceStationLoading, setOfficeGetPoliceStationLoading] =
    useState(false);
  const [officeGetPostOfficeLoading, setOfficeGetPostOfficeLoading] =
    useState(false);
  const [officeGetVillageLoading, setOfficeGetVillageLoading] = useState(false);

  const copyRegisterToOffice = () => {
    const values = form.getValues();
    form.setValue("officeAddress", values.inst_add || "");
    form.setValue("officeStateId", values.stateId || "");
    form.setValue("officeDistrictId", values.districtId || "");
    form.setValue("officeBlockId", values.blockId || "");
    form.setValue("officeVillageId", values.villageId || "");
    form.setValue("officePoliceStationId", values.policeStationId || "");
    form.setValue("officePostOfficeId", values.postOfficeId || "");
  };

  useEffect(() => {
    if (sameAsRegister !== "Y") return;
    copyRegisterToOffice();
  }, [
    sameAsRegister,
    inst_add,
    stateId,
    districtId,
    blockId,
    villageId,
    policeStationId,
    postOfficeId,
  ]);

  useEffect(() => {
    if (sameAsRegister === "Y" || !orgId || !officeStateId) {
      if (!officeStateId && sameAsRegister !== "Y") {
        setOfficeDistrictData([]);
        setOfficeBlockData([]);
        setOfficeVillageData([]);
        setOfficePoliceStationData([]);
        setOfficePostOfficeData([]);
      }
      return;
    }

    const loadDistricts = async () => {
      setOfficeGetDistrictLoading(true);
      try {
        const res = await getMasterDistrictUnderStateAPI(officeStateId, orgId);
        setOfficeDistrictData(
          res.message === "Data Found" ? res.details || [] : [],
        );
      } catch (error) {
        console.error(error);
        setOfficeDistrictData([]);
      } finally {
        setOfficeGetDistrictLoading(false);
      }
    };

    loadDistricts();
  }, [officeStateId, sameAsRegister, orgId]);

  useEffect(() => {
    if (sameAsRegister === "Y" || !orgId || !officeDistrictId) {
      if (!officeDistrictId && sameAsRegister !== "Y") {
        setOfficeBlockData([]);
        setOfficeVillageData([]);
        setOfficePoliceStationData([]);
        setOfficePostOfficeData([]);
      }
      return;
    }

    const loadDistrictChildren = async () => {
      setOfficeGetBlockLoading(true);
      setOfficeGetPoliceStationLoading(true);
      setOfficeGetPostOfficeLoading(true);
      try {
        const [blockRes, policeRes, postRes] = await Promise.all([
          getMasterBlockUnderDistrictAPI(
            orgId,
            officeDistrictId,
            officeStateId,
          ),
          getMasterPoliceStationUnderDistrictAPI(orgId, officeDistrictId),
          getMasterPostOfficeUnderDistrictAPI(orgId, officeDistrictId),
        ]);
        setOfficeBlockData(
          blockRes.message === "Data Found" ? blockRes.details || [] : [],
        );
        setOfficePoliceStationData(
          policeRes.message === "Data Found" ? policeRes.details || [] : [],
        );
        setOfficePostOfficeData(
          postRes.message === "Data Found" ? postRes.details || [] : [],
        );
      } catch (error) {
        console.error(error);
        setOfficeBlockData([]);
        setOfficePoliceStationData([]);
        setOfficePostOfficeData([]);
      } finally {
        setOfficeGetBlockLoading(false);
        setOfficeGetPoliceStationLoading(false);
        setOfficeGetPostOfficeLoading(false);
      }
    };

    loadDistrictChildren();
  }, [officeDistrictId, officeStateId, sameAsRegister, orgId]);

  useEffect(() => {
    if (sameAsRegister === "Y" || !orgId || !officeBlockId) {
      if (!officeBlockId && sameAsRegister !== "Y") {
        setOfficeVillageData([]);
      }
      return;
    }

    const loadVillages = async () => {
      setOfficeGetVillageLoading(true);
      try {
        const res = await getMasterVillageUnderBlockAPI(orgId, officeBlockId);
        setOfficeVillageData(
          res.message === "Data Found" ? res.details || [] : [],
        );
      } catch (error) {
        console.error(error);
        setOfficeVillageData([]);
      } finally {
        setOfficeGetVillageLoading(false);
      }
    };

    loadVillages();
  }, [officeBlockId, sameAsRegister, orgId]);

  const handleSubmit = (values) => {
    if (values.type === "A") postInstitutionProfileApiCall(values);
    else {
      console.log(values);
      updateInstitutionProfileApiCall(values);
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessMessage(false);
    setSuccessMessage(null);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleResetForm = () => {
    form.reset();
    setShowForm(false);
    setUpdateInstitutionData(null);
  };

  const handleMemberFormSubmit = (values) => {
    getInstitutionDataByIdApiCall(orgId, values.memberNo);
  };

  const postInstitutionProfileApiCall = async (item) => {
    console.log("postInstitutionProfileAPI item=", item);
    const register = buildRegisterKeys(item);
    const office = buildOfficeKeys(
      item,
      {},
      item.sameAsRegister,
      register,
    );
    let data = {
      inst_no: item.inst_no,
      inst_name: item.inst_name,
      inst_dob: format(item.inst_dob, "yyyy-MM-dd"),
      inst_ben: item.inst_ben,
      inst_mob: item.inst_mob,
      ...register,
      same_as_reg: item.sameAsRegister,
      ...office,
      register,
      office,
      branch_id: item.branch_id,
      org_id: item.org_id,
      doc_no: item.int_doc,
    };
    console.log("postInstitutionProfileAPI data=", data);

    setLoading(true);
    try {
      const res = await postInstitutionProfileAPI(data);
      console.log("postInstitutionProfileAPI res=", res);
      if (res.message === "Success") {
        // toast.success(res.details);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        form.reset();
        setShowForm(false);
      } else toast.error(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // work is pending
  const updateInstitutionProfileApiCall = async (item) => {
    console.log("updateInstitutionProfileApiCall item=", item);
    const register = buildRegisterKeys(item, {
      inst_add: updateInstitutionData?.Cust_Add,
      inst_state: updateInstitutionData?.Cust_State,
      inst_dist: updateInstitutionData?.Cust_Dist,
      inst_block: updateInstitutionData?.Cust_Blk,
      inst_village: updateInstitutionData?.Cust_Vill,
      inst_police: updateInstitutionData?.Cust_Police,
      inst_post: updateInstitutionData?.Cust_Post,
    });
    const office = buildOfficeKeys(
      item,
      {
        inst_off_add:
          updateInstitutionData?.Cust_Off_Add ||
          updateInstitutionData?.Off_Add ||
          updateInstitutionData?.Inst_Off_Add,
        inst_off_state:
          updateInstitutionData?.Cust_Off_State ||
          updateInstitutionData?.Off_State ||
          updateInstitutionData?.Inst_Off_State,
        inst_off_dist:
          updateInstitutionData?.Cust_Off_Dist ||
          updateInstitutionData?.Off_Dist ||
          updateInstitutionData?.Inst_Off_Dist,
        inst_off_block:
          updateInstitutionData?.Cust_Off_Blk ||
          updateInstitutionData?.Off_Blk ||
          updateInstitutionData?.Inst_Off_Blk,
        inst_off_village:
          updateInstitutionData?.Cust_Off_Vill ||
          updateInstitutionData?.Off_Vill ||
          updateInstitutionData?.Inst_Off_Vill,
        inst_off_police:
          updateInstitutionData?.Cust_Off_Police ||
          updateInstitutionData?.Off_Police ||
          updateInstitutionData?.Inst_Off_Police,
        inst_off_post:
          updateInstitutionData?.Cust_Off_Post ||
          updateInstitutionData?.Off_Post ||
          updateInstitutionData?.Inst_Off_Post,
      },
      item.sameAsRegister,
      register,
    );
    let data = {
      inst_id: updateInstitutionData.Id,
      inst_name: item.inst_name,
      inst_dob: format(item.inst_dob, "yyyy-MM-dd"),
      ...register,
      same_as_reg: item.sameAsRegister,
      ...office,
      register,
      office,
      inst_ben: item.inst_ben,
      branch_id: item.branch_id,
      org_id: item.org_id,
      inst_mob: item.inst_mob,
      doc_no: item.int_doc,
    };
    console.log("updateInstitutionProfileApiCall data=", data);
    setLoading(true);
    try {
      const res = await updateInstitutionProfile(data);
      if (res.message === "Success") {
        // toast.success(res.details);
        setSuccessMessage(res.details);
        setShowSuccessMessage(true);
        setShowForm(false);
        setResetTrigger((prev) => prev + 1);
        form.reset();
      } else toast.error(res.message);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // TODO: chack memberNo
  const getInstitutionDataByIdApiCall = async (orgId, memberNo) => {
    setGetInstitutionLoading(true);
    setIsLoadingMemberData(true);
    try {
      const res = await getInstitutionProfileDataById(orgId, memberNo);
      console.log("getInstitutionDataByIdApiCall res=", res);
      if (res.message === "Data Found") {
        setUpdateInstitutionData(res.details[0]);
        const data = res.details[0];

        // Set non-dependent fields first
        form.setValue("inst_name", data.Full_Name || "");
        form.setValue(
          "inst_dob",
          data.Cust_DOB ? new Date(data.Cust_DOB) : null,
        );
        form.setValue("inst_ben", data.Benef_No || "");
        form.setValue("inst_mob", data.Cust_Mob || "");
        form.setValue("inst_add", data.Cust_Add || "");
        form.setValue("int_doc", data.Cust_Voter || "");

        // Handle cascading location fields
        const stateId = data.Cust_State;
        const districtId = data.Cust_Dist;
        const blockId = data.Cust_Blk;
        const villageId = data.Cust_Vill;
        const policeId = data.Cust_Police;
        const postId = data.Cust_Post;

        if (stateId) {
          form.setValue("stateId", stateId);
          // Fetch districts first
          try {
            const districtRes = await getMasterDistrictUnderStateAPI(
              stateId,
              orgId,
            );
            if (districtRes.message === "Data Found") {
              dispatch(getDistrictUnderStateData(districtRes.details));
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (e) {
            console.error("Failed to fetch districts", e);
          }
        }

        if (districtId) {
          form.setValue("districtId", districtId);
          // Fetch blocks, police stations, post offices sequentially to avoid 429
          try {
            const blockRes = await getMasterBlockUnderDistrictAPI(
              orgId,
              districtId,
              stateId,
            );
            if (blockRes.message === "Data Found") {
              dispatch(getBlockUnderDistrictData(blockRes.details));
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const policeRes = await getMasterPoliceStationUnderDistrictAPI(
              orgId,
              districtId,
            );
            if (policeRes.message === "Data Found") {
              dispatch(getPoliceStationUnderDistrictData(policeRes.details));
              await new Promise((resolve) => setTimeout(resolve, 100));
            }

            const postRes = await getMasterPostOfficeUnderDistrictAPI(
              orgId,
              districtId,
            );
            if (postRes.message === "Data Found") {
              dispatch(getPostOfficeUnderDistrictData(postRes.details));
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (e) {
            console.error("Failed to fetch block/police/post data", e);
          }
        }

        if (blockId) {
          form.setValue("blockId", blockId);
          // Fetch villages
          try {
            const villageRes = await getMasterVillageUnderBlockAPI(
              orgId,
              blockId,
            );
            if (villageRes.message === "Data Found") {
              dispatch(getVillageUnderBlockData(villageRes.details));
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          } catch (e) {
            console.error("Failed to fetch villages", e);
          }
        }

        // Set remaining location values
        if (villageId) form.setValue("villageId", villageId);
        if (policeId) form.setValue("policeStationId", policeId);
        if (postId) form.setValue("postOfficeId", postId);

        const officeAddress =
          data.Cust_Off_Add || data.Off_Add || data.Inst_Off_Add || "";
        const officeStateId =
          data.Cust_Off_State || data.Off_State || data.Inst_Off_State || "";
        const officeDistrictId =
          data.Cust_Off_Dist || data.Off_Dist || data.Inst_Off_Dist || "";
        const officeBlockId =
          data.Cust_Off_Blk || data.Off_Blk || data.Inst_Off_Blk || "";
        const officeVillageId =
          data.Cust_Off_Vill || data.Off_Vill || data.Inst_Off_Vill || "";
        const officePoliceId =
          data.Cust_Off_Police || data.Off_Police || data.Inst_Off_Police || "";
        const officePostId =
          data.Cust_Off_Post || data.Off_Post || data.Inst_Off_Post || "";
        const sameAsFlag = data.Same_As_Reg || data.same_as_reg;

        const isSameAddress =
          sameAsFlag === "Y" ||
          sameAsFlag === "1" ||
          (!officeAddress && !officeStateId) ||
          (String(officeAddress || "") === String(data.Cust_Add || "") &&
            String(officeStateId || "") === String(stateId || "") &&
            String(officeDistrictId || "") === String(districtId || "") &&
            String(officePostId || "") === String(postId || ""));

        form.setValue("sameAsRegister", isSameAddress ? "Y" : "N");
        if (isSameAddress) {
          copyRegisterToOffice();
        } else {
          form.setValue("officeAddress", officeAddress);
          form.setValue("officeStateId", officeStateId);
          form.setValue("officeDistrictId", officeDistrictId);
          form.setValue("officeBlockId", officeBlockId);
          form.setValue("officeVillageId", officeVillageId);
          form.setValue("officePoliceStationId", officePoliceId);
          form.setValue("officePostOfficeId", officePostId);
        }
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setUpdateInstitutionData(null);
      form.setValue("inst_no", "");
      form.setValue("inst_name", "");
      form.setValue("inst_dob", "");
      form.setValue("inst_ben", "");
      form.setValue("inst_mob", "");
      form.setValue("inst_add", "");
    } finally {
      setGetInstitutionLoading(false);
      setIsLoadingMemberData(false);
    }
  };

  return {
    stateId,
    districtId,
    blockId,
    handleSubmit,
    loading,
    form,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleShowForm,
    handleResetForm,
    showForm,
    resetTrigger,
    getInstitutionLoading,
    handleMemberFormSubmit,
    isLoadingMemberData,
    officeDistrictData,
    officeBlockData,
    officeVillageData,
    officePoliceStationData,
    officePostOfficeData,
    officeGetDistrictLoading,
    officeGetBlockLoading,
    officeGetVillageLoading,
    officeGetPoliceStationLoading,
    officeGetPostOfficeLoading,
  };
};
