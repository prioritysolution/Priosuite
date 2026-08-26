"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import {
  DeleteMapMemberAPI,
  getGrpInstDataAPI,
  PostMapGrpInstMember,
  UpdateMapMemberAPI,
} from "./mapinstitutememberApis";
import { getMemberDataByIdAPI } from "@/container/membership/issueMembership/IssueMembershipApis";
import {
  getGrpDesigData,
  getEcsAccountData,
  selectGrpDesigData,
  selectEcsAccountData,
  selectMapGroupMemberLoading,
  selectMapGroupMemberError,
  clearErrors,
  resetGrpDesigData,
  resetEcsAccountData,
} from "./mapinstitutememberReduces";
import { format } from "date-fns";

export const useMapInstituteMember = () => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState("existing");
  const [getGroupLoading, setGetGroupLoading] = useState(false);
  const [getMemberDataLoading, setGetMemberDataLoading] = useState(false);
  const [visibleBlock, setVisibleBlock] = useState(false);

  const [groupData, setGroupData] = useState(null);
  const [memberData, setMemberData] = useState(null);
  const [addedMembers, setAddedMembers] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const orgId = getCookieData("orgId");

  // Success message state
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Redux selectors
  const designationData = useSelector(selectGrpDesigData);

  console.log("designationData=", designationData);

  const ecsAccountData = useSelector(selectEcsAccountData);
  console.log("ecsAccountData from Redux:", ecsAccountData);
  const mapGroupMemberLoading = useSelector(selectMapGroupMemberLoading);
  const mapGroupMemberError = useSelector(selectMapGroupMemberError);

  // Use API data if available, otherwise use static data
  const finalDesignationData =
    Array.isArray(designationData) && designationData.length > 0
      ? designationData
      : [];

  console.log("MapGroupMember Hook - designationData:", designationData);
  console.log(
    "MapGroupMember Hook - finalDesignationData:",
    finalDesignationData,
  );
  console.log(
    "MapGroupMember Hook - mapGroupMemberLoading:",
    mapGroupMemberLoading,
  );
  console.log(
    "MapGroupMember Hook - mapGroupMemberError:",
    mapGroupMemberError,
  );

  // Fetch designation data on component mount
  // useEffect(() => {
  //   console.log("MapGroupMember Hook - Dispatching getGrpDesigData");
  //   dispatch(getGrpDesigData());
  // }, [dispatch]);

  // Fetch ECS account data when member data is available
  // useEffect(() => {
  //   const memberId = memberData?.Id ?? form.getValues("mmemberId");
  //   if (memberId && orgId) {
  //     console.log(
  //       "MapGroupMember Hook - Dispatching getEcsAccountData for memberId:",
  //       memberId,
  //     );
  //     dispatch(getEcsAccountData({ orgId, memb_id: memberId }));
  //   }
  // }, [memberData?.Id, dispatch, orgId]);

  const finalEcsAccountData =
    Array.isArray(ecsAccountData) && ecsAccountData.length > 0
      ? ecsAccountData.map((item) => ({
          Id: item.Id,
          Option_Value: `${item.Account_No} - ${item.Full_Name}`,
        }))
      : [];

  // Handle errors
  useEffect(() => {
    if (mapGroupMemberError.grpDesig) {
      console.log("Redux designation error:", mapGroupMemberError.grpDesig);
      const msg =
        typeof mapGroupMemberError.grpDesig === "string"
          ? mapGroupMemberError.grpDesig
          : mapGroupMemberError.grpDesig?.message
            ? String(mapGroupMemberError.grpDesig.message)
            : "Failed to fetch designation data";
      toast.error(msg);
    }
    if (mapGroupMemberError.ecsAccount) {
      console.log("Redux ECS error:", mapGroupMemberError.ecsAccount);
      const msg =
        typeof mapGroupMemberError.ecsAccount === "string"
          ? mapGroupMemberError.ecsAccount
          : mapGroupMemberError.ecsAccount?.message
            ? String(mapGroupMemberError.ecsAccount.message)
            : JSON.stringify(mapGroupMemberError.ecsAccount);
      toast.error(msg);
      dispatch(clearErrors());
    }
  }, [mapGroupMemberError.ecsAccount, dispatch]);

  // Form validation schema
  const formSchema = yup.object({
    // group details
    gmemberNo: yup.string().nullable(),
    gcifNo: yup.string().nullable(),
    gmemberName: yup.string().nullable(),
    gaddress: yup.string().nullable(),
    gmobile: yup.string().nullable(),
    gCustomer_Type: yup.string().nullable(),
    gmemberId: yup.string().nullable(),
    ggroupId: yup.string().nullable(),
    groleInGroup: yup.string().nullable(),
    gBenefNo: yup.string().nullable(),
    gCustDOB: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    // member details
    mmemberNo: yup.string().nullable(),
    mcifNo: yup.string().nullable(),
    mmemberName: yup.string().nullable(),
    mgurdianName: yup.string().nullable(),
    maddress: yup.string().nullable(),
    mmobile: yup.string().nullable(),
    BranchId: yup.string().nullable(),
    branchName: yup.string().nullable(),
    mmemberId: yup.string().nullable(),
    mapId: yup.string().nullable(),
    designation: yup.string().nullable(),
    withdrawnDate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    remarks: yup.string().nullable(),
    date: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .required("Date is required"),
    joinongdate: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable()
      .required("Joinong Date required"),
    // search fields
    memberNo: yup.string().required("Member number is required"),
    groupNo: yup.string().required("Group number is required"),
    // member info from group data
    member_info: yup.array().nullable(),
  });

  // Initialize form
  const form = useForm({
    resolver: yupResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      // group details
      gmemberNo: "",
      gcifNo: "",
      gmemberName: "",

      gaddress: "",
      gmobile: "",
      gCustomer_Type: "",

      gmemberId: "",
      ggroupId: "",
      groleInGroup: "",
      gBenefNo: "",
      gCustDOB: "",
      // member details
      mmemberNo: "",
      mmemberId: "",
      mcifNo: "",
      mmemberName: "",
      mgurdianName: "",
      maddress: "",
      mmobile: "",
      BranchId: "",
      branchName: "",
      mmemberId: "",
      mapId: "",
      designation: "",
      withdrawnDate: null,
      remarks: "",
      date: null,
      joinongdate: null,
      // search fields
      memberNo: "",
      groupNo: "",
      // member info from group data
      member_info: [],
    },
  });

  // Watch form fields for Add Member button validation
  const watchedFields = useWatch({
    control: form.control,
    name: ["mmemberNo", "mmemberName", "designation"],
  });

  // Check if form is valid for adding member (reactive to both form fields and ECS data)
  const isAddMemberDisabled = useMemo(() => {
    // Only disable if we're in "new" mode, otherwise always enabled
    if (selectedOption !== "new") {
      return false;
    }

    console.log("Debug - ecsAccountData:", ecsAccountData);
    console.log("Debug - ecsAccountData.length:", ecsAccountData.length);
    console.log("Debug - watchedFields:", watchedFields);
    console.log("Debug - addedMembers.length:", addedMembers.length);

    const hasAllFields =
      watchedFields[0] && // mmemberNo
      watchedFields[1] && // mmemberName
      watchedFields[2]; // designation

    // Remove ECS data requirement since defaultsavings is removed
    const disabled = !hasAllFields;

    console.log("Debug - hasAllFields:", hasAllFields);
    console.log("Debug - isAddMemberDisabled:", disabled);

    return disabled;
  }, [watchedFields, ecsAccountData, selectedOption]);

  const handleMemberFormSubmit = (values) => {
    // Dispatch Redux actions to fetch fresh data
    // console.log("handleMemberFormSubmit: Dispatching getGrpDesigData");
    // dispatch(getGrpDesigData());

    // Get member data - ECS account data will be fetched in useEffect when memberData loads
    getMemberDataByIdApiCall(orgId, values.memberNo);
  };

  const getMemberDataByIdApiCall = async (orgId, memberNo) => {
    setGetMemberDataLoading(true);
    try {
      const res = await getMemberDataByIdAPI(orgId, memberNo);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        setShowForm(true);
        const memberDetails = res.details[0];
        setMemberData(memberDetails);
        form.setValue("mmemberNo", memberDetails.Cust_No || "");
        form.setValue("mmemberId", memberDetails.Id || "");
        form.setValue("mcifNo", memberDetails.CIF_No || "");
        form.setValue("mmemberName", memberDetails.Full_Name || "");
        form.setValue("mgurdianName", memberDetails.Relation_Name || "");
        form.setValue("maddress", memberDetails.Address || "");
        form.setValue("mmobile", memberDetails.Cust_Mob || "");
        form.setValue("BranchName", memberDetails.Branch_Name || "");
        form.setValue("BranchId", memberDetails.Branch_Id || "");
        form.setValue("mmemberId", memberDetails.Id || "");
        // Ensure designation has proper value
        form.setValue("designation", "");

        dispatch(getGrpDesigData(orgId));

        // No need to fetch ECS account data since defaultsavings field is removed
      } else {
        setVisibleBlock(false);
        setShowForm(false);
        setMemberData(null);
        form.setValue("mmemberNo", "");
        form.setValue("mmemberId", "");
        form.setValue("mcifNo", "");
        form.setValue("mmemberName", "");
        form.setValue("mgurdianName", "");
        form.setValue("maddress", "");
        form.setValue("mmobile", "");
        form.setValue("BranchName", "");
        form.setValue("BranchId", "");
        form.setValue("mmemberId", "");
        form.setValue("designation", "");
      }
    } catch (error) {
      setVisibleBlock(false);
      setShowForm(false);
      setMemberData(null);
      form.setValue("mmemberNo", "");
      form.setValue("mmemberId", "");
      form.setValue("mcifNo", "");
      form.setValue("mmemberName", "");
      form.setValue("mgurdianName", "");
      form.setValue("maddress", "");
      form.setValue("mmobile", "");
      form.setValue("BranchName", "");
      form.setValue("BranchId", "");
      form.setValue("mmemberId", "");
      form.setValue("designation", "");
    } finally {
      setGetMemberDataLoading(false);
    }
  };

  const handleMapGroupSubmit = (values) => {
    getGroupDataByIdApiCall(orgId, values.memberNo);
  };

  const getGroupDataByIdApiCall = async (orgId, memberNo) => {
    setGetGroupLoading(true);
    try {
      // this group search and store the data in groupData
      const res = await getGrpInstDataAPI(orgId, "I", memberNo);
      if (res.message === "Data Found") {
        setVisibleBlock(true);
        setShowForm(true);
        console.log("Full API response:", res);
        console.log("API details:", res.details[0]);
        setGroupData(res.details[0]);
        form.setValue("gmemberNo", res.details[0].Cust_No || "");

        form.setValue("gcifNo", res.details[0].CIF_No || "");
        form.setValue("gmemberName", res.details[0].Full_Name || "");

        form.setValue("gaddress", res.details[0].Address || "");
        form.setValue("gmobile", res.details[0].Cust_Mob || "");
        form.setValue("gCustomer_Type", res.details[0].Customer_Type || "");

        form.setValue("gmemberId", res.details[0].Id || "");
        form.setValue("gBenefNo", res.details[0].Benef_No || "");
        form.setValue(
          "gCustDOB",
          res.details[0].Cust_DOB ? new Date(res.details[0].Cust_DOB) : null,
        );

        // Add member_info data to form
        if (res.details[0].member_info) {
          console.log("Raw member_info from API:", res.details[0].member_info);
          console.log(
            "Type of member_info:",
            typeof res.details[0].member_info,
          );

          let memberInfo = res.details[0].member_info;
          // Parse if it's a JSON string
          if (typeof memberInfo === "string") {
            try {
              memberInfo = JSON.parse(memberInfo);
              console.log("Parsed member_info:", memberInfo);
            } catch (e) {
              console.error("Error parsing member_info:", e);
              memberInfo = [];
            }
          }

          console.log("Setting member_info in form:", memberInfo);
          form.setValue("member_info", memberInfo);

          // Verify it was set
          const verifyValue = form.getValues("member_info");
          console.log("Verified member_info in form:", verifyValue);
        } else {
          form.setValue("member_info", []);
          console.log("No member_info found in API response");
        }
      } else {
        setVisibleBlock(false);
        setShowForm(false);
        setGroupData(null);
        form.setValue("gmemberNo", "");
        form.setValue("gcifNo", "");
        form.setValue("gmemberName", "");

        form.setValue("gaddress", "");
        form.setValue("gmobile", "");
        form.setValue("gCustomer_Type", "");
        form.setValue("gBenefNo", "");
        form.setValue("gCustDOB", null);

        form.setValue("date", null);
        form.setValue("member_info", []);

        toast.error(res.details);
      }
    } catch (error) {
      setVisibleBlock(false);
      toast.error("Something went wrong");
      console.error(error);
      setGroupData(null);
      form.setValue("gmemberNo", "");
      form.setValue("gcifNo", "");
      form.setValue("gmemberName", "");

      form.setValue("gaddress", "");
      form.setValue("gmobile", "");
      form.setValue("gCustomer_Type", "");
      form.setValue("gBenefNo", "");
      form.setValue("gCustDOB", null);
      form.setValue("member_info", []);

      form.setValue("gmemberId", "");
    } finally {
      setGetGroupLoading(false);
    }
  };

  const resetForm = () => {
    // Reset search fields used by MemberSearchForm
    form.setValue("memberNo", "");
    form.setValue("groupNo", "");

    // Reset member form data (m* fields)
    form.setValue("mmemberNo", "");
    form.setValue("mcifNo", "");
    form.setValue("mmemberName", "");
    form.setValue("mgurdianName", "");
    form.setValue("maddress", "");
    form.setValue("mmobile", "");
    form.setValue("BranchName", "");
    form.setValue("BranchId", "");
    form.setValue("mmemberId", "");
    form.setValue("designation", "");
    form.setValue("mapId", "");
    form.setValue("withdrawnDate", null);
    form.setValue("remarks", "");
    // form.setValue("date", null);
    // form.setValue("member_info", []);

    // Reset member data state
    setMemberData(null);

    // Reset selected radio option
    setSelectedOption("existing");

    // Re-enable RadioGroup after reset
    setShowForm(false);

    // Trigger MemberSearchForm reset
    setResetTrigger((prev) => prev + 1);
  };

  const handleAddMember = () => {
    // Get current form values
    const currentValues = form.getValues();

    console.log("currentValues=", currentValues);

    // Get member_info from form
    const memberInfo = form.getValues("member_info") || [];

    // Validation 0: Check if member already exists in member_info by Map_Id
    const existingMember = memberInfo.find((member) => {
      const match =
        member.Map_Id &&
        member.Map_Id.toString() === currentValues.mmemberId?.toString();
      console.log(
        `Comparing Map_Id ${member.Map_Id} with mmemberId ${currentValues.mmemberId}:`,
        match,
      );
      return match;
    });

    if (existingMember) {
      toast.error("This member is already mapped to this group!");
      resetForm();
      return;
    }

    // Validation 1: Check if member already exists in table
    const isDuplicate = addedMembers.some(
      (member) =>
        member.mmemberNo === currentValues.mmemberNo ||
        member.mcifNo === currentValues.mcifNo,
    );

    if (isDuplicate) {
      toast.error("This member is already added to the group!");
      dispatch(resetGrpDesigData());
      resetForm();
      return;
    }

    // Validation 3: Check group size limit (gBenefNo)
    const groupBenefNo = form.getValues("gBenefNo");
    const currentGroupSize = addedMembers.length + 1; // +1 for current member

    if (groupBenefNo && currentGroupSize > parseInt(groupBenefNo)) {
      toast.error(`Group cannot have more than ${groupBenefNo} members!`);
      return;
    }

    console.log("currentValues=", currentValues);

    // Get display names before resetting Redux data
    const designationDisplay =
      designationData.find((d) => d.Id === currentValues.designation)
        ?.Option_Value || "N/A";

    // Create member object for table with display names
    const newMember = {
      id: Date.now(), // temporary ID
      mmemberNo: currentValues.mmemberNo,
      mmemberId: currentValues.mmemberId,
      mcifNo: currentValues.mcifNo,
      mmemberName: currentValues.mmemberName,
      mgurdianName: currentValues.mgurdianName,
      maddress: currentValues.maddress,
      mmobile: currentValues.mmobile,
      designation: currentValues.designation,
      designationDisplay: designationDisplay,
      date: currentValues.date, // Add the date field from the Add Member form
    };

    // Reset Redux data before adding new member
    dispatch(resetGrpDesigData());
    dispatch(resetEcsAccountData());

    // Add to members table
    setAddedMembers((prev) => [...prev, newMember]);

    // Reset member fields
    resetForm();

    toast.success("Member added successfully!");
  };

  const handleRemoveMember = (memberId) => {
    setAddedMembers((prev) => prev.filter((member) => member.id !== memberId));
    toast.success("Member removed successfully!");
  };

  const handleEditMember = (member) => {
    // Switch to "new" option for editing
    // setSelectedOption("new");

    console.log("handleEditMember=", member);

    // Populate form with member data
    form.setValue("mmemberNo", member.Member_No || "");
    form.setValue("mmemberId", member.Map_Id || "");
    form.setValue("mcifNo", member.Member_CIF || "");
    form.setValue("mmemberName", member.Member_Name || "");
    form.setValue("mgurdianName", member.Relation_Name || "");
    form.setValue("maddress", member.Address || "");
    form.setValue("mmobile", member.Cust_Mob || "");
    form.setValue("BranchName", member.Branch_Name || "");
    form.setValue("BranchId", member.Branch_Id || "");

    // Set member data state
    setMemberData(member);
    setVisibleBlock(true);
    setShowForm(true);

    // Fetch designation data
    dispatch(getGrpDesigData(orgId));

    // No need to fetch ECS account data since defaultsavings field is removed;
  };

  const handleUpdateMember = async (memberId, updatedData) => {
    console.log("handleUpdateMember=", updatedData);
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const payload = {
      map_id: updatedData.mapId,
      org_id: orgId,
      link_date: updatedData.joinongdate
        ? format(updatedData.joinongdate, "yyyy-MM-dd")
        : null,
      cust_id: updatedData.mmemberId,
      deg_id: updatedData.designation,
      remarks: updatedData.remarks,
      with_date: updatedData.withdrawnDate
        ? formatDate(updatedData.withdrawnDate)
        : null,
    };

    // console.log("Updated member data:", payload);

    const response = await UpdateMapMemberAPI(payload);

    if (response.message === "Success" || response.status === "success") {
      toast.success("Member updated successfully!");
      const gropcifNo = form.getValues("gcifNo");
      getGroupDataByIdApiCall(orgId, gropcifNo);
    } else {
      toast.error(response.message || "Failed to update member");
    }

    resetForm();
  };

  const handelDeleteMember = async (Map_Id) => {
    const payload = {
      map_id: Map_Id,
      org_id: orgId,
    };

    const response = await DeleteMapMemberAPI(payload);

    if (response.message === "Success" || response.status === "success") {
      toast.success("Member deleted successfully!");
      const gropcifNo = form.getValues("gcifNo");
      getGroupDataByIdApiCall(orgId, gropcifNo);
    } else {
      toast.error(response.message || "Failed to delete member");
    }
  };

  const handleMapSubmit = async () => {
    // Debug: Check all form values
    const allValues = form.getValues();
    console.log("All form values:", allValues);
    console.log("Date field value:", allValues.date);
    console.log("gCustDOB field value:", allValues.gCustDOB);

    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const payload = {
      // link_date: formatDate(form.getValues("date")),
      link_date: format(form.getValues("date"), "yyyy-MM-dd"),
      parr_cust_id: form.getValues("gmemberId"),
      org_id: orgId,
      map_data: addedMembers.map((member) => ({
        cust_id: member.mmemberId,
        deg_cd: member.designation,
        sb_id: null,
        rem: null,
      })),
    };

    // Call API here
    console.log("payload=", payload);

    try {
      const response = await PostMapGrpInstMember(payload);
      console.log("API response:", response);

      if (response.message === "Success" || response.status === "success") {
        toast.success("Group members mapped successfully!");
        // Set success message for SuccessMessage component
        setSuccessMessage("Group members mapped successfully!");
        setShowSuccessMessage(true);
        // Reset form after successful submission
        resetForm();
        setAddedMembers([]);
        setGroupData(null);
        setVisibleBlock(false);
        form.setValue("gmemberNo", "");
        form.setValue("gcifNo", "");
        form.setValue("gmemberName", "");
        form.setValue("gaddress", "");
        form.setValue("gmobile", "");
        form.setValue("gCustomer_Type", "");
        form.setValue("gBenefNo", "");
        form.setValue("gCustDOB", null);
        form.setValue("gmemberId", "");
        form.setValue("member_info", []);
      } else {
        toast.error(response.message || "Failed to map group members");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("An error occurred while mapping group members");
    }
  };

  return {
    form,
    handleMemberFormSubmit,
    handleMapGroupSubmit,
    getGroupLoading,
    getMemberDataLoading,
    visibleBlock,
    showForm,
    resetForm,
    handleAddMember,
    handleRemoveMember,
    handleEditMember,
    handleUpdateMember,
    addedMembers,
    resetTrigger,
    isAddMemberDisabled,
    designationData: finalDesignationData,
    // defaultSavingsData,
    ecsAccountData: finalEcsAccountData,
    mapGroupMemberLoading,
    handleMapSubmit,
    successMessage,
    showSuccessMessage,
    setShowSuccessMessage,
    setSuccessMessage,
    handelDeleteMember,
    selectedOption,
    setSelectedOption,
  };
};
