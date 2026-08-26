"use client";

import { useDispatch } from "react-redux";
import * as yup from "yup";
import {
  getMemberProfileAPI,
  getMemberTypeAPI,
  getMemberTypeDataAPI,
  getUpdateMemberDataByIdAPI,
  postMemberProfileAPI,
  updateMemberProfileAPI,
} from "./MemberProfileApis";
import {
  getMasterDistrictUnderStateAPI,
  getMasterBlockUnderDistrictAPI,
  getMasterPoliceStationUnderDistrictAPI,
  getMasterPostOfficeUnderDistrictAPI,
  getMasterVillageUnderBlockAPI,
} from "@/container/master/operationalArea/OperationalAreaApis";
import {
  getCasteData,
  getGenderData,
  getRelationTypeData,
  getReligionData,
} from "./MemberProfileReducer";
import {
  getDistrictUnderStateData,
  getBlockUnderDistrictData,
  getPoliceStationUnderDistrictData,
  getPostOfficeUnderDistrictData,
  getVillageUnderBlockData,
} from "@/container/master/operationalArea/OperationalAreaReducer";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import getCookieData from "@/utils/getCookieData";
import toast from "react-hot-toast";
import {
  aadhaarRegex,
  alphanumericRegex,
  mobileLengthRegex,
  mobileNoLeadingZeroRegex,
  panRegex,
} from "@/utils/validationRegex";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import {
  getMemberType,
  getMemberTypeData,
} from "@/container/master/shareProduct/ShareProductReducer";

export const useMemberProfile = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");
  const branchId = getCookieData("userBranchId");

  // console.log("orgId=", orgId);

  const [loading, setLoading] = useState(false);
  const [getRelationLoading, setGetRelationLoading] = useState(false);
  const [getGenderLoading, setGetGenderLoading] = useState(false);
  const [getCasteLoading, setGetCasteLoading] = useState(false);
  const [getReligionLoading, setGetReligionLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);
  const [updateMemberData, setUpdateMemberData] = useState(null);
  const [isLoadingMemberData, setIsLoadingMemberData] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [getMemberTypeLoading, setGetMemberTypeLoading] = useState(false);
  const [getMemberTypeDataLoading, setGetMemberTypeDataLoading] =
    useState(false);

  // Get data from Redux state
  const memberType = useSelector((state) => state?.shareProduct?.memberType);

  const formSchema = yup.object({
    type: yup.string().required("Type is required"),
    memberNo: yup
      .string()
      .nullable() // Allows null or empty values
      .test("is-alphanumeric", "Member no. must be alphanumeric", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return alphanumericRegex.test(value); // Check if the value is alphanumeric
      })
      .test(
        "max-length",
        "Member no. must not exceed 5 characters",
        (value) => {
          if (!value) return true; // Skip validation for null or empty values
          return value.length <= 5; // Check if the length is within 5 characters
        },
      )
      .test("no-leading-zero", "Member no. cannot start with 0", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return !value.startsWith("0"); // Ensure it does not start with 0
      }),
    firstName: yup.string().required("First name is required"),
    middleName: yup.string(),
    lastName: yup.string().required("Last name is required"),
    relationName: yup.string().required("Relation name is required"),
    relationType: yup.string().required("Relation type is required"),
    dob: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("DOB is required"),
    gender: yup.string().required("Gender is required"),
    caste: yup.string().required("Caste is required"),
    religion: yup.string().required("Religion is required"),
    mobile: yup
      .string()
      .nullable() // Allows null or empty values
      .test("no-leading-zero", "Mobile no. must not start with 0", (value) => {
        if (!value) return true; // Skip validation for null or empty values
        return mobileNoLeadingZeroRegex.test(value); // Validate no leading zero
      })
      .test(
        "is-exactly-10-digits",
        "Mobile no. must be exactly 10 digits",
        (value) => {
          if (!value) return true; // Skip validation for null or empty values
          return mobileLengthRegex.test(value); // Validate exact 10 digits
        },
      ),
    email: yup.string().email("Invalid email"),
    address: yup.string().required("Permanent address is required"),
    sameAsPermanent: yup.string().required("Select present address option"),
    presentAddress: yup.string().required("Present address is required"),

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
    presentStateId: yup
      .string()
      .test(
        "is-required-if-type-A",
        "Present state is required",
        function (value) {
          return this.parent.type !== "A" || !!value;
        },
      ),
    presentDistrictId: yup
      .string()
      .test(
        "is-required-if-type-A",
        "Present district is required",
        function (value) {
          return this.parent.type !== "A" || !!value;
        },
      ),
    presentBlockId: yup
      .string()
      .test(
        "is-required-if-type-A",
        "Present block is required",
        function (value) {
          return this.parent.type !== "A" || !!value;
        },
      ),
    presentVillageId: yup.string(),
    presentPoliceStationId: yup.string(),
    presentPostOfficeId: yup.string(),
    unitId: yup.string(),
    aadhaarNo: yup
      .string()
      .nullable() // Allows null or empty values
      .test(
        "is-12-digit-number",
        "Aadhaar number must be exactly 12 digits and not start with 0",
        (value) => {
          if (!value) return true; // If value is null or empty, skip validation
          return aadhaarRegex.test(value); // Validate with the regex
        },
      ),
    voterId: yup
      .string()
      .nullable() // Allows null or empty value
      .test(
        "is-alphanumeric",
        "Voter ID must be alphanumeric",
        (value) => !value || alphanumericRegex.test(value), // Only check if value is provided
      ),
    rationNo: yup
      .string()
      .nullable() // Allows null or empty value
      .test(
        "is-alphanumeric",
        "Ration number must be alphanumeric",
        (value) => !value || alphanumericRegex.test(value), // Only check if value is provided
      ),
    panNo: yup
      .string()
      .nullable() // Allows null or empty value
      .test(
        "is-valid-pan",
        "Please enter a valid PAN No.",
        (value) => !value || panRegex.test(value), // Only check if value is provided
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      type: "A",
      memberNo: "",
      firstName: "",
      middleName: "",
      lastName: "",
      relationName: "",
      relationType: "",
      dob: null,
      gender: "",
      caste: "",
      religion: "",
      mobile: "",
      email: "",
      address: "",
      sameAsPermanent: "N",
      presentAddress: "",
      stateId: "",
      districtId: "",
      blockId: "",
      villageId: "",
      policeStationId: "",
      postOfficeId: "",
      presentStateId: "",
      presentDistrictId: "",
      presentBlockId: "",
      presentVillageId: "",
      presentPoliceStationId: "",
      presentPostOfficeId: "",
      unitId: "",
      aadhaarNo: "",
      voterId: "",
      rationNo: "",
      panNo: "",
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
    address,
    sameAsPermanent,
    presentStateId,
    presentDistrictId,
    presentBlockId,
  } = useWatch({ control });

  const [presentDistrictData, setPresentDistrictData] = useState([]);
  const [presentBlockData, setPresentBlockData] = useState([]);
  const [presentVillageData, setPresentVillageData] = useState([]);
  const [presentPoliceStationData, setPresentPoliceStationData] = useState([]);
  const [presentPostOfficeData, setPresentPostOfficeData] = useState([]);
  const [presentGetDistrictLoading, setPresentGetDistrictLoading] =
    useState(false);
  const [presentGetBlockLoading, setPresentGetBlockLoading] = useState(false);
  const [presentGetPoliceStationLoading, setPresentGetPoliceStationLoading] =
    useState(false);
  const [presentGetPostOfficeLoading, setPresentGetPostOfficeLoading] =
    useState(false);
  const [presentGetVillageLoading, setPresentGetVillageLoading] =
    useState(false);

  const copyPermanentToPresent = () => {
    const values = form.getValues();
    form.setValue("presentAddress", values.address || "");
    form.setValue("presentStateId", values.stateId || "");
    form.setValue("presentDistrictId", values.districtId || "");
    form.setValue("presentBlockId", values.blockId || "");
    form.setValue("presentVillageId", values.villageId || "");
    form.setValue("presentPoliceStationId", values.policeStationId || "");
    form.setValue("presentPostOfficeId", values.postOfficeId || "");
  };

  useEffect(() => {
    if (sameAsPermanent !== "Y") return;
    copyPermanentToPresent();
  }, [
    sameAsPermanent,
    address,
    stateId,
    districtId,
    blockId,
    villageId,
    policeStationId,
    postOfficeId,
  ]);

  useEffect(() => {
    if (sameAsPermanent === "Y" || !orgId || !presentStateId) {
      if (!presentStateId && sameAsPermanent !== "Y") {
        setPresentDistrictData([]);
        setPresentBlockData([]);
        setPresentVillageData([]);
        setPresentPoliceStationData([]);
        setPresentPostOfficeData([]);
      }
      return;
    }

    const loadDistricts = async () => {
      setPresentGetDistrictLoading(true);
      try {
        const res = await getMasterDistrictUnderStateAPI(presentStateId, orgId);
        setPresentDistrictData(
          res.message === "Data Found" ? res.details || [] : [],
        );
      } catch (error) {
        console.error(error);
        setPresentDistrictData([]);
      } finally {
        setPresentGetDistrictLoading(false);
      }
    };

    loadDistricts();
  }, [presentStateId, sameAsPermanent, orgId]);

  useEffect(() => {
    if (sameAsPermanent === "Y" || !orgId || !presentDistrictId) {
      if (!presentDistrictId && sameAsPermanent !== "Y") {
        setPresentBlockData([]);
        setPresentVillageData([]);
        setPresentPoliceStationData([]);
        setPresentPostOfficeData([]);
      }
      return;
    }

    const loadDistrictChildren = async () => {
      setPresentGetBlockLoading(true);
      setPresentGetPoliceStationLoading(true);
      setPresentGetPostOfficeLoading(true);
      try {
        const [blockRes, policeRes, postRes] = await Promise.all([
          getMasterBlockUnderDistrictAPI(orgId, presentDistrictId, presentStateId),
          getMasterPoliceStationUnderDistrictAPI(orgId, presentDistrictId),
          getMasterPostOfficeUnderDistrictAPI(orgId, presentDistrictId),
        ]);
        setPresentBlockData(
          blockRes.message === "Data Found" ? blockRes.details || [] : [],
        );
        setPresentPoliceStationData(
          policeRes.message === "Data Found" ? policeRes.details || [] : [],
        );
        setPresentPostOfficeData(
          postRes.message === "Data Found" ? postRes.details || [] : [],
        );
      } catch (error) {
        console.error(error);
        setPresentBlockData([]);
        setPresentPoliceStationData([]);
        setPresentPostOfficeData([]);
      } finally {
        setPresentGetBlockLoading(false);
        setPresentGetPoliceStationLoading(false);
        setPresentGetPostOfficeLoading(false);
      }
    };

    loadDistrictChildren();
  }, [presentDistrictId, presentStateId, sameAsPermanent, orgId]);

  useEffect(() => {
    if (sameAsPermanent === "Y" || !orgId || !presentBlockId) {
      if (!presentBlockId && sameAsPermanent !== "Y") {
        setPresentVillageData([]);
      }
      return;
    }

    const loadVillages = async () => {
      setPresentGetVillageLoading(true);
      try {
        const res = await getMasterVillageUnderBlockAPI(orgId, presentBlockId);
        setPresentVillageData(
          res.message === "Data Found" ? res.details || [] : [],
        );
      } catch (error) {
        console.error(error);
        setPresentVillageData([]);
      } finally {
        setPresentGetVillageLoading(false);
      }
    };

    loadVillages();
  }, [presentBlockId, sameAsPermanent, orgId]);

  const handleSubmit = (values) => {
    if (values.type === "A") postMemberProfileApiCall(values);
    else updateMemberProfileApiCall(values);
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
    setUpdateMemberData(null);
  };

  const handleMemberFormSubmit = (values) => {
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const postMemberProfileApiCall = async (item) => {
    console.log("postMemberProfileAPI item=", item);
    let data = {
      member_no: item.memberNo,
      mem_fst_name: item.firstName,
      mem_mid_name: item.middleName,
      mem_lst_name: item.lastName,
      mem_rela_name: item.relationName,
      mem_rel_type: item.relationType,
      mem_dob: format(item.dob, "yyyy-MM-dd"),
      mem_gend: item.gender,
      mem_caste: item.caste,
      mem_relig: item.religion,
      mem_mob: item.mobile,
      mem_mail: item.email,
      mem_add: item.address,
      mem_state: item.stateId,
      mem_dist: item.districtId,
      mem_block: item.blockId,
      mem_village: item.villageId,
      mem_police: item.policeStationId,
      mem_post: item.postOfficeId,
      same_as_per: item.sameAsPermanent,
      mem_pres_add: item.presentAddress,
      mem_pres_state: item.presentStateId,
      mem_pres_dist: item.presentDistrictId,
      mem_pres_block: item.presentBlockId,
      mem_pres_village: item.presentVillageId,
      mem_pres_police: item.presentPoliceStationId,
      mem_pres_post: item.presentPostOfficeId,
      mem_unit: item.unitId,
      mem_aadhar: item.aadhaarNo,
      mem_voter: item.voterId,
      mem_ration: item.rationNo,
      mem_pan: item.panNo,
      fin_id: finId,
      org_id: orgId,
      branch_id: branchId,
      cust_type: item.memberType,
    };
    console.log("postMemberProfileAPI data=", data);
    setLoading(true);
    try {
      const res = await postMemberProfileAPI(data);
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

  const updateMemberProfileApiCall = async (item) => {
    let data = {
      mem_id: updateMemberData.Id,
      member_no: item.memberNo,
      mem_fst_name: item.firstName,
      mem_mid_name: item.middleName,
      mem_lst_name: item.lastName,
      mem_rela_name: item.relationName,
      mem_rel_type: item.relationType,
      mem_dob: format(item.dob, "yyyy-MM-dd"),
      mem_gend: item.gender,
      mem_caste: item.caste,
      mem_relig: item.religion,
      mem_mob: item.mobile,
      mem_mail: item.email,
      mem_add: item.address,
      mem_state: item.stateId || updateMemberData.Mem_State,
      mem_dist: item.districtId || updateMemberData.Mem_Dist,
      mem_block: item.blockId || updateMemberData.Mem_Blk,
      mem_village: item.villageId || updateMemberData.Mem_Vill,
      mem_police: item.policeStationId || updateMemberData.Mem_Police,
      mem_post: item.postOfficeId || updateMemberData.Mem_Post,
      same_as_per: item.sameAsPermanent,
      mem_pres_add: item.presentAddress,
      mem_pres_state: item.presentStateId || updateMemberData.Mem_Pres_State,
      mem_pres_dist: item.presentDistrictId || updateMemberData.Mem_Pres_Dist,
      mem_pres_block: item.presentBlockId || updateMemberData.Mem_Pres_Blk,
      mem_pres_village: item.presentVillageId || updateMemberData.Mem_Pres_Vill,
      mem_pres_police:
        item.presentPoliceStationId || updateMemberData.Mem_Pres_Police,
      mem_pres_post: item.presentPostOfficeId || updateMemberData.Mem_Pres_Post,
      mem_unit: item.unitId || updateMemberData.Mem_Unit,
      mem_aadhar: item.aadhaarNo,
      mem_voter: item.voterId,
      mem_ration: item.rationNo,
      mem_pan: item.panNo,
      fin_id: finId,
      org_id: orgId,
      cust_type: item.memberType,
    };
    setLoading(true);
    try {
      const res = await updateMemberProfileAPI(data);
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

  const getMemberDataByIdApiCall = async (orgId, memberNo) => {
    setGetMemberDataLoading(true);
    setIsLoadingMemberData(true);
    try {
      const res = await getUpdateMemberDataByIdAPI(orgId, memberNo);
      console.log("getUpdateMemberDataByIdAPI=", res);
      if (res.message === "Data Found") {
        const memberData = res.details[0];
        setUpdateMemberData(memberData);

        // Set non-dependent fields first
        form.setValue("memberNo", memberData.Cust_No?.toString() || "");
        form.setValue("firstName", memberData.Cust_Fst_Name || "");
        form.setValue("middleName", memberData.Cust_Mid_Name || "");
        form.setValue("lastName", memberData.Cust_Lst_Name || "");
        form.setValue("relationName", memberData.Relation_Name || "");
        form.setValue("relationType", memberData.Rel_Type || "");
        form.setValue(
          "dob",
          memberData.Cust_DOB ? new Date(memberData.Cust_DOB) : null,
        );
        form.setValue("gender", memberData.Cust_Gend || "");
        form.setValue("caste", memberData.Cust_Caste || "");
        form.setValue("religion", memberData.Cust_Relig || "");
        form.setValue("mobile", memberData.Cust_Mob || "");
        form.setValue("email", memberData.Cust_Mail || "");
        form.setValue("address", memberData.Cust_Add || "");
        form.setValue("aadhaarNo", memberData.Cust_Aadar || "");
        form.setValue("voterId", memberData.Cust_Voter || "");
        form.setValue("rationNo", memberData.Cust_Ration || "");
        form.setValue("panNo", memberData.Cust_Pan || "");
        form.setValue("memberType", memberData.Customer_Type.toString() || "");

        // Handle cascading location fields
        const stateId = memberData.Cust_State;
        const districtId = memberData.Cust_Dist;
        const blockId = memberData.Cust_Blk;
        const villageId = memberData.Cust_Vill;
        const policeId = memberData.Cust_Police;
        const postId = memberData.Cust_Post;
        const unitId = memberData.Cust_Unit;

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
              // Small delay to ensure Redux updates
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
        if (unitId) form.setValue("unitId", unitId);

        const presentAddress =
          memberData.Cust_Pres_Add || memberData.Pres_Add || "";
        const presentStateId =
          memberData.Cust_Pres_State || memberData.Pres_State || "";
        const presentDistrictId =
          memberData.Cust_Pres_Dist || memberData.Pres_Dist || "";
        const presentBlockId =
          memberData.Cust_Pres_Blk || memberData.Pres_Blk || "";
        const presentVillageId =
          memberData.Cust_Pres_Vill || memberData.Pres_Vill || "";
        const presentPoliceId =
          memberData.Cust_Pres_Police || memberData.Pres_Police || "";
        const presentPostId =
          memberData.Cust_Pres_Post || memberData.Pres_Post || "";
        const sameAsFlag = memberData.Same_As_Per || memberData.same_as_per;

        const isSameAddress =
          sameAsFlag === "Y" ||
          sameAsFlag === "1" ||
          (!presentAddress && !presentStateId) ||
          (String(presentAddress || "") === String(memberData.Cust_Add || "") &&
            String(presentStateId || "") === String(stateId || "") &&
            String(presentDistrictId || "") === String(districtId || "") &&
            String(presentPostId || "") === String(postId || ""));

        form.setValue("sameAsPermanent", isSameAddress ? "Y" : "N");
        if (isSameAddress) {
          copyPermanentToPresent();
        } else {
          form.setValue("presentAddress", presentAddress);
          form.setValue("presentStateId", presentStateId);
          form.setValue("presentDistrictId", presentDistrictId);
          form.setValue("presentBlockId", presentBlockId);
          form.setValue("presentVillageId", presentVillageId);
          form.setValue("presentPoliceStationId", presentPoliceId);
          form.setValue("presentPostOfficeId", presentPostId);
        }
      } else {
        setUpdateMemberData(null);
        form.setValue("memberNo", "");
        form.setValue("firstName", "");
        form.setValue("middleName", "");
        form.setValue("lastName", "");
        form.setValue("relationName", "");
        form.setValue("relationType", "");
        form.setValue("dob", "");
        form.setValue("gender", "");
        form.setValue("caste", "");
        form.setValue("religion", "");
        form.setValue("mobile", "");
        form.setValue("email", "");
        form.setValue("address", "");
        form.setValue("aadhaarNo", "");
        form.setValue("voterId", "");
        form.setValue("rationNo", "");
        form.setValue("panNo", "");
        toast.error(res.details);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setUpdateMemberData(null);
      form.setValue("memberNo", "");
      form.setValue("firstName", "");
      form.setValue("middleName", "");
      form.setValue("lastName", "");
      form.setValue("relationName", "");
      form.setValue("relationType", "");
      form.setValue("dob", "");
      form.setValue("gender", "");
      form.setValue("caste", "");
      form.setValue("religion", "");
      form.setValue("mobile", "");
      form.setValue("email", "");
      form.setValue("address", "");
      form.setValue("aadhaarNo", "");
      form.setValue("voterId", "");
      form.setValue("rationNo", "");
      form.setValue("panNo", "");
    } finally {
      setGetMemberDataLoading(false);
      setIsLoadingMemberData(false);
    }
  };

  const getRelationTypeDataApiCall = async () => {
    setGetRelationLoading(true);
    try {
      const res = await getMemberProfileAPI("RELATIONTYPE", orgId);
      if (res.message === "Data Found") {
        dispatch(getRelationTypeData(res.details));
      } else {
        dispatch(getRelationTypeData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getRelationTypeData([]));
    } finally {
      setGetRelationLoading(false);
    }
  };

  const getGenderDataApiCall = async () => {
    setGetGenderLoading(true);
    try {
      const res = await getMemberProfileAPI("GENDER", orgId);
      if (res.message === "Data Found") {
        dispatch(getGenderData(res.details));
      } else {
        dispatch(getGenderData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getGenderData([]));
    } finally {
      setGetGenderLoading(false);
    }
  };

  const getCasteDataApiCall = async () => {
    setGetCasteLoading(true);
    try {
      const res = await getMemberProfileAPI("CASTE", orgId);
      if (res.message === "Data Found") {
        dispatch(getCasteData(res.details));
      } else {
        dispatch(getCasteData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getCasteData([]));
    } finally {
      setGetCasteLoading(false);
    }
  };

  const getReligionDataApiCall = async () => {
    setGetReligionLoading(true);
    try {
      const res = await getMemberProfileAPI("RELIGION", orgId);
      if (res.message === "Data Found") {
        dispatch(getReligionData(res.details));
      } else {
        dispatch(getReligionData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getReligionData([]));
    } finally {
      setGetReligionLoading(false);
    }
  };

  const getMemberTypeDataApiCall = async (orgId) => {
    setGetMemberTypeDataLoading(true);
    try {
      const res = await getMemberTypeDataAPI(orgId);

      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(getMemberTypeData(res.details));
      } else {
        dispatch(getMemberTypeData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getMemberTypeData([]));
    } finally {
      setGetMemberTypeDataLoading(false);
    }
  };

  const getMemberTypeApiCall = async () => {
    setGetMemberTypeLoading(true);
    try {
      const res = await getMemberTypeAPI(orgId);
      if (res.message === "Data Found" || res.message === "Success") {
        dispatch(getMemberType(res.details));
      } else {
        dispatch(getMemberType([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getMemberTypeData([]));
    } finally {
      setGetMemberTypeLoading(false);
    }
  };

  return {
    stateId,
    districtId,
    blockId,
    getRelationTypeDataApiCall,
    getGenderDataApiCall,
    getCasteDataApiCall,
    getReligionDataApiCall,
    handleSubmit,
    loading,
    getRelationLoading,
    getGenderLoading,
    getCasteLoading,
    getReligionLoading,
    form,
    successMessage,
    showSuccessMessage,
    handleCloseSuccessMessage,
    handleShowForm,
    handleResetForm,
    showForm,
    resetTrigger,
    getMemberDataLoading,
    handleMemberFormSubmit,
    getMemberTypeDataApiCall,
    getMemberTypeApiCall,
    getMemberTypeLoading,
    getMemberTypeData,
    getMemberTypeDataLoading,
    getMemberType,
    getMemberTypeLoading,
    memberType,
    isLoadingMemberData,
    presentDistrictData,
    presentBlockData,
    presentVillageData,
    presentPoliceStationData,
    presentPostOfficeData,
    presentGetDistrictLoading,
    presentGetBlockLoading,
    presentGetVillageLoading,
    presentGetPoliceStationLoading,
    presentGetPostOfficeLoading,
  };
};
