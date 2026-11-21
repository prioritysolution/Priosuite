"use client";

import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import {
  getGroupProfileAPI,
  getGroupUpdateDataById,
  getUpdateGroupDataByIdAPI,
  groupUpdateData,
  postGroupProfileAPI,
  updateGroupProfileAPI,
  updateTheGroupProfile,
  getDepositAgentListAPI,
} from "./GroupProfileApis";
import { getGroupTypeData, getAgentListData } from "./GroupProfileReducer";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState, useCallback, useRef } from "react";
import getCookieData from "../../../utils/getCookieData";
import toast from "react-hot-toast";
import {
  alphanumericRegex,
  mobileLengthRegex,
  mobileNoLeadingZeroRegex,
} from "../../../utils/validationRegex";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { getGroupTypeDataApi } from "./GroupProfileApis";
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

export const useGroupProfile = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const finId = getCookieData("finId");

  const [loading, setLoading] = useState(false);
  const [getGroupTypeLoading, setGetGroupTypeLoading] = useState(false);
  const [isLoadingMemberData, setIsLoadingMemberData] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);
  const [updateMemberData, setUpdateMemberData] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Agent infinite-scroll states
  const [agentList, setAgentList] = useState([]);
  const [agentPage, setAgentPage] = useState(1);
  const [agentLastPage, setAgentLastPage] = useState(1);
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentLoadingMore, setAgentLoadingMore] = useState(false);
  const [agentHasMore, setAgentHasMore] = useState(false);

  // Get data from Redux state
  const groupTypeData = useSelector(
    (state) => state?.groupProfile?.groupTypeData,
  );

  const formSchema = yup.object({
    type: yup.string().required("Type is required"),
    group_no: yup
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
    cust_type: yup.string().required("Group type is required"),
    grp_name: yup.string().required("Group name is required"),
    gerp_dob: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Date of formation is required"),
    grp_ben: yup
      .number()
      .typeError("No of beneficiary must be a number")
      .positive("No of beneficiary must be positive")
      .integer("No of beneficiary must be an integer")
      .required("No of beneficiary is required"),
    grp_mob: yup
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
    grp_add: yup
      .string()
      .required("Address is required")
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
    grp_post: yup.string().nullable(),
    branch_id: yup.string().required("Branch is required"),
    org_id: yup.string().required("Organization is required"),
    agent_id: yup.string().nullable(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      type: "A",
      group_no: "",
      cust_type: "",
      grp_name: "",
      gerp_dob: null,
      grp_add: "",
      stateId: "",
      districtId: "",
      blockId: "",
      villageId: "",
      policeStationId: "",
      postOfficeId: "",
      grp_ben: "",
      branch_id: getCookieData("userBranchId") || "",
      org_id: getCookieData("orgId") || "",
      grp_mob: "",
      agent_id: "",
    },
  });

  const { control } = form;

  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("GroupProfile Form Validation Errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  // Watch form values for cascading dropdowns
  const stateId = useWatch({ control, name: "stateId" });
  const districtId = useWatch({ control, name: "districtId" });
  const blockId = useWatch({ control, name: "blockId" });

  // the logic of populate the dependices drop down

  // const [stateID,setStateID]=useState(null);
  // useEffect(()=>{
  //   if(updateMemberData?.Cust_State){
  //     form.setValue("stateId", updateMemberData.Cust_State ? String(updateMemberData.Cust_State) : "");
  //     setStateID( updateMemberData.Cust_State);
  //   }
  // },[updateMemberData]);

  // useEffect(()=>{
  //   if(stateID && updateMemberData?.Cust_Dist){
  //     console.log("inside the 2d");
  //   }
  // },[stateID])

  const handleSubmit = (values) => {
    if (values.type === "A") postGroupProfileApiCall(values);
    else {
      console.log(values);
      updateGroupProfileApiCall(values);
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
    setUpdateMemberData(null);
  };

  const handleMemberFormSubmit = (values) => {
    console.log(orgId, values.memberNo);
    getGroupDataByIdApiCall(orgId, values.memberNo);
  };

  const postGroupProfileApiCall = async (item) => {
    console.log("postGroupProfileAPI item=", item);
    let data = {
      group_no: item.group_no,
      cust_type: item.cust_type,
      grp_name: item.grp_name,
      gerp_dob: format(item.gerp_dob, "yyyy-MM-dd"),
      grp_ben: item.grp_ben,
      grp_mob: item.grp_mob,
      grp_add: item.grp_add,
      grp_state: item.stateId,
      grp_dist: item.districtId,
      grp_block: item.blockId,
      grp_village: item.villageId,
      grp_police: item.policeStationId,
      grp_post: item.postOfficeId,
      agent_id: item.agent_id ? Number(item.agent_id) || item.agent_id : null,
      Agent_Id: item.agent_id ? Number(item.agent_id) || item.agent_id : null,
      branch_id: item.branch_id,
      org_id: item.org_id,
    };
    console.log("postGroupProfileAPI data=", data);

    setLoading(true);
    try {
      const res = await postGroupProfileAPI(data);
      console.log("postGroupProfileAPI res=", res);
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

  const updateGroupProfileApiCall = async (item) => {
    console.log("updateGroupProfileAPI item=", item);

    let data = {
      grp_id: updateMemberData.Id,
      group_no: item.group_no,
      cust_type: item.cust_type,
      grp_name: item.grp_name,
      gerp_dob: format(item.gerp_dob, "yyyy-MM-dd"),
      grp_ben: item.grp_ben,
      grp_mob: item.grp_mob,
      grp_add: item.grp_add,
      grp_state: item.stateId || updateMemberData.Group_State,
      grp_dist: item.districtId || updateMemberData.Group_Dist,
      grp_block: item.blockId || updateMemberData.Group_Blk,
      grp_village: item.villageId || updateMemberData.Group_Vill,
      grp_police: item.policeStationId || updateMemberData.Group_Police,
      grp_post: item.postOfficeId || updateMemberData.Group_Post,
      group_unit: item.unitId || updateMemberData.Group_Unit,
      agent_id: item.agent_id ? Number(item.agent_id) || item.agent_id : null,
      Agent_Id: item.agent_id ? Number(item.agent_id) || item.agent_id : null,
      fin_id: finId,
      org_id: orgId,
      branch_id: item.branch_id,
    };
    setLoading(true);
    try {
      const res = await updateTheGroupProfile(data);
      if (res.message === "Success") {
        toast.success(res.details);
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

  const getGroupDataByIdApiCall = async (orgId, groupNo) => {
    setGetMemberDataLoading(true);
    setIsLoadingMemberData(true);
    try {
      // const res = await getUpdateGroupDataByIdAPI(orgId, groupNo);
      const res = await getGroupUpdateDataById(orgId, groupNo);
      console.log(res.details[0]);
      if (res.message === "Data Found") {
        const data = res.details[0];
        console.log(data);
        setUpdateMemberData(data);

        // Set non-dependent fields first
        form.setValue("group_no", res.details[0].Cust_No);
        form.setValue("grp_name", res.details[0].Full_Name);
        form.setValue("grp_mob", res.details[0].Cust_Mob);
        form.setValue("grp_ben", res.details[0].Benef_No);
        form.setValue("grp_add", res.details[0].Cust_Add);
        form.setValue(
          "gerp_dob",
          res.details[0].Cust_DOB ? new Date(res.details[0].Cust_DOB) : null,
        );
        form.setValue("cust_type", res.details[0].Customer_Type);
        form.setValue(
          "agent_id",
          res.details[0].Agent_Id?.toString() ||
            res.details[0].agent_id?.toString() ||
            res.details[0].Under_Agent?.toString() ||
            "",
        );

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
      } else toast.error(res.message);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setUpdateMemberData(null);
      form.setValue("groupNo", "");
      form.setValue("groupType", "");
      form.setValue("groupName", "");
      form.setValue("dob", "");
      form.setValue("noOfBeneficiary", "");
      form.setValue("mobile", "");
      form.setValue("address", "");
      form.setValue("agent_id", "");
    } finally {
      setGetMemberDataLoading(false);
      setIsLoadingMemberData(false);
    }
  };

  const getGroupTypeDataApiCall = async () => {
    setGetGroupTypeLoading(true);
    try {
      const res = await getGroupTypeDataApi(orgId);
      console.log("getGroupTypeDataApiCall", res);
      if (res.message === "Success") {
        dispatch(getGroupTypeData(res.details));
      } else {
        dispatch(getGroupTypeData([]));
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getGroupTypeData([]));
    } finally {
      setGetGroupTypeLoading(false);
    }
  };

  const branchId = getCookieData("userBranchId");
  const [agentSearchKeyword, setAgentSearchKeyword] = useState(null);
  const agentSearchKeywordRef = useRef(null);
  useEffect(() => {
    agentSearchKeywordRef.current = agentSearchKeyword;
  }, [agentSearchKeyword]);

  const getDepositAgentListApiCall = useCallback(
    async (
      pageNo = 1,
      isLoadMore = false,
      keyword = agentSearchKeywordRef.current,
      agentIdParam = null,
    ) => {
      if (!orgId) return;
      const cookieBranchId = branchId ?? getCookieData("userBranchId");

      if (isLoadMore) {
        setAgentLoadingMore(true);
      } else {
        setAgentLoading(true);
      }

      try {
        const res = await getDepositAgentListAPI(
          orgId,
          cookieBranchId || 0,
          pageNo,
          keyword,
          agentIdParam,
          25,
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

          const totalPages =
            Number(res.pagination?.total_pages) ||
            Number(res.details?.last_page) ||
            Number(res.last_page) ||
            1;

          const totalRecords =
            Number(res.pagination?.total_records) ||
            Number(res.details?.total) ||
            0;

          const hasNext =
            res.pagination?.has_next !== undefined
              ? Boolean(res.pagination.has_next)
              : totalRecords > 0
              ? pageNo * 25 < totalRecords
              : pageNo < totalPages;

          if (isLoadMore) {
            setAgentList((prev) => {
              const existingIds = new Set(
                prev.map((item) =>
                  String(item.Agent_Id ?? item.agent_id ?? item.Id ?? item.id),
                ),
              );
              const newItems = list.filter(
                (item) =>
                  !existingIds.has(
                    String(item.Agent_Id ?? item.agent_id ?? item.Id ?? item.id),
                  ),
              );
              const combined = [...prev, ...newItems];
              dispatch(getAgentListData(combined));
              return combined;
            });
          } else {
            setAgentList(list);
            dispatch(getAgentListData(list));
          }

          setAgentPage(pageNo);
          setAgentLastPage(totalPages);
          setAgentHasMore(hasNext && list.length > 0);
        } else {
          if (!isLoadMore) {
            setAgentList([]);
            dispatch(getAgentListData([]));
          }
          setAgentHasMore(false);
        }
      } catch (error) {
        console.error(error);
        if (!isLoadMore) {
          setAgentList([]);
          dispatch(getAgentListData([]));
        }
        setAgentHasMore(false);
      } finally {
        if (isLoadMore) {
          setAgentLoadingMore(false);
        } else {
          setAgentLoading(false);
        }
      }
    },
    [orgId, branchId, dispatch],
  );

  const handleLoadMoreAgents = useCallback(() => {
    if (!agentHasMore || agentLoadingMore || agentLoading) return;
    getDepositAgentListApiCall(
      agentPage + 1,
      true,
      agentSearchKeywordRef.current,
      null,
    );
  }, [
    agentHasMore,
    agentLoadingMore,
    agentLoading,
    agentPage,
    getDepositAgentListApiCall,
  ]);

  const handleSearchAgents = useCallback(
    (keyword) => {
      const trimmed =
        keyword && keyword.trim() !== "" ? keyword.trim() : null;
      setAgentSearchKeyword(trimmed);
      agentSearchKeywordRef.current = trimmed;
      getDepositAgentListApiCall(1, false, trimmed, null);
    },
    [getDepositAgentListApiCall],
  );

  return {
    stateId,
    districtId,
    blockId,
    getGroupTypeDataApiCall,
    handleSubmit,
    loading,
    getGroupTypeLoading,
    groupTypeData,
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
    isLoadingMemberData,
    agentList,
    agentLoading,
    agentLoadingMore,
    agentHasMore,
    getDepositAgentListApiCall,
    handleLoadMoreAgents,
    handleSearchAgents,
  };
};
