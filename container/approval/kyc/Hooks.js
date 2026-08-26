"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import {
  getKycApplicationListAPI,
  postKycApprovalAPI,
  updateGroupProfileAPI,
  updateInstitutionProfileAPI,
  updateMemberProfileAPI,
  getMemberTypeAPI,
  getRelationTypeAPI,
  getGenderAPI,
  getCasteAPI,
  getReligionAPI,
  getGroupTypeAPI,
  getStateAPI,
  getDistrictAPI,
  getBlockAPI,
  getPoliceStationAPI,
  getPostOfficeAPI,
  getVillageAPI,
} from "./KycApis";
import { getKycList, setLoading } from "./KycReducer";

export const useKycApproval = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");

  const [localMasterData, setLocalMasterData] = useState({
    memberTypes: [],
    relationTypes: [],
    genders: [],
    castes: [],
    religions: [],
    groupTypes: [],
    states: [],
    districts: [],
    blocks: [],
    policeStations: [],
    postOffices: [],
    villages: [],
  });

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const kycList = useSelector((state) => state.kyc.kycList);
  const loading = useSelector((state) => state.kyc.loading);

  const form = useForm({
    defaultValues: {},
    mode: "onChange",
  });

  // NORMALIZATION FUNCTION: Ensures every item has an 'Id' property
  const normalizeData = (data, idKey = "Id") => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => {
      // Comprehensive ID extraction from common property names
      const rawId =
        item[idKey] ??
        item.Id ??
        item.id ??
        item.value ??
        item.Value ??
        item.Option_Id;
      return {
        ...item,
        Id: rawId,
      };
    });
  };

  const fetchBasicMasterData = async () => {
    try {
      const [memRes, relRes, genRes, cstRes, rlgRes, grpRes, stateRes] =
        await Promise.all([
          getMemberTypeAPI(orgId),
          getRelationTypeAPI(orgId),
          getGenderAPI(orgId),
          getCasteAPI(orgId),
          getReligionAPI(orgId),
          getGroupTypeAPI(orgId),
          getStateAPI(orgId),
        ]);

      setLocalMasterData((prev) => ({
        ...prev,
        memberTypes: normalizeData(memRes?.details, "Id"),
        relationTypes: normalizeData(relRes?.details, "Id"),
        genders: normalizeData(genRes?.details, "Id"),
        castes: normalizeData(cstRes?.details, "Id"),
        religions: normalizeData(rlgRes?.details, "Id"),
        groupTypes: normalizeData(grpRes?.details, "Id"),
        states: normalizeData(stateRes?.details, "State_Id"),
      }));
    } catch (error) {
      console.error("Error fetching basic master data", error);
    }
  };

  // Track last fetched IDs to avoid redundant API calls and rate limits (429)
  const fetchedIdsRef = useRef({
    stateId: null,
    districtId: null,
    blockId: null,
  });

  const fetchKycList = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const res = await getKycApplicationListAPI(orgId, branchId);
      if (res?.message === "Success" || res?.status === 200) {
        dispatch(getKycList(res.details || []));
      } else {
        dispatch(getKycList([]));
      }
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, orgId, branchId]);

  // --- DEPENDENT DROPDOWN LOGIC FOR EDIT MODE ---
  const watchedStateId = form.watch("stateId");
  const watchedDistrictId = form.watch("districtId");
  const watchedBlockId = form.watch("blockId");

  // Fetch districts when state changes
  useEffect(() => {
    if (
      isEditMode &&
      watchedStateId &&
      watchedStateId !== fetchedIdsRef.current.stateId
    ) {
      fetchedIdsRef.current.stateId = watchedStateId;
      getDistrictAPI(watchedStateId, orgId).then((res) => {
        setLocalMasterData((prev) => ({
          ...prev,
          districts: normalizeData(res?.details, "Dist_Id"),
        }));
      });
    }
  }, [watchedStateId, isEditMode, orgId]);

  // Fetch block/police/post when district changes
  useEffect(() => {
    if (
      isEditMode &&
      watchedDistrictId &&
      watchedDistrictId !== fetchedIdsRef.current.districtId
    ) {
      fetchedIdsRef.current.districtId = watchedDistrictId;
      // 1. Police Stations
      getPoliceStationAPI(orgId, watchedDistrictId).then((res) => {
        setLocalMasterData((prev) => ({
          ...prev,
          policeStations: normalizeData(res?.details, "Police_Station_Id"),
        }));
      });
      // 2. Post Offices
      getPostOfficeAPI(orgId, watchedDistrictId).then((res) => {
        setLocalMasterData((prev) => ({
          ...prev,
          postOffices: normalizeData(res?.details, "Post_Office_Id"),
        }));
      });
      // 3. Blocks (Requires State ID)
      if (watchedStateId) {
        getBlockAPI(orgId, watchedDistrictId, watchedStateId).then((res) => {
          setLocalMasterData((prev) => ({
            ...prev,
            blocks: normalizeData(res?.details, "Block_Id"),
          }));
        });
      }
    }
  }, [watchedDistrictId, watchedStateId, isEditMode, orgId]);

  // Fetch villages when block changes
  useEffect(() => {
    if (
      isEditMode &&
      watchedBlockId &&
      watchedBlockId !== fetchedIdsRef.current.blockId
    ) {
      fetchedIdsRef.current.blockId = watchedBlockId;
      getVillageAPI(orgId, watchedBlockId).then((res) => {
        setLocalMasterData((prev) => ({
          ...prev,
          villages: normalizeData(res?.details, "Village_Id"),
        }));
      });
    }
  }, [watchedBlockId, isEditMode, orgId]);
  // ----------------------------------------------

  useEffect(() => {
    if (orgId) {
      fetchKycList();
    }
  }, [orgId, branchId, fetchKycList]);

  const filteredKycList = kycList.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.Full_Name?.toLowerCase().includes(searchLower) ||
      item.Appl_No?.toLowerCase().includes(searchLower) ||
      item.Cust_No?.toString().includes(searchLower) ||
      item.Cust_Mob?.toString().includes(searchLower)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKycList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKycList.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchLocationDetails = async (item) => {
    try {
      const stateId = item.Cust_State;
      const distId = item.Cust_Dist;
      const blockId = item.Cust_Blk;

      // Update refs to avoid re-fetching in useEffect if already loaded
      fetchedIdsRef.current.stateId = stateId;
      fetchedIdsRef.current.districtId = distId;
      fetchedIdsRef.current.blockId = blockId;

      const promises = [];

      if (stateId) {
        promises.push(
          getDistrictAPI(stateId, orgId).then((res) => ({
            key: "districts",
            data: normalizeData(res?.details, "Dist_Id"),
          })),
        );
      }
      if (distId) {
        promises.push(
          getPoliceStationAPI(orgId, distId).then((res) => ({
            key: "policeStations",
            data: normalizeData(res?.details, "Police_Station_Id"),
          })),
        );
        promises.push(
          getPostOfficeAPI(orgId, distId).then((res) => ({
            key: "postOffices",
            data: normalizeData(res?.details, "Post_Office_Id"),
          })),
        );
        if (stateId) {
          promises.push(
            getBlockAPI(orgId, distId, stateId).then((res) => ({
              key: "blocks",
              data: normalizeData(res?.details, "Block_Id"),
            })),
          );
        }
      }
      if (blockId) {
        promises.push(
          getVillageAPI(orgId, blockId).then((res) => ({
            key: "villages",
            data: normalizeData(res?.details, "Village_Id"),
          })),
        );
      }

      const results = await Promise.all(promises);

      setLocalMasterData((prev) => {
        const newData = { ...prev };
        results.forEach((r) => {
          if (r.data) newData[r.key] = r.data;
        });
        return newData;
      });
    } catch (error) {
      console.error("Error fetching location details", error);
    }
  };

  const fetchMasterDataForEdit = async () => {
    await fetchBasicMasterData();
  };

  const handleView = async (item) => {
    console.log("Viewing profile:", item);
    if (!item) return;

    setSelectedApplication(item);
    setIsEditMode(false);
    setOpenModal(true);

    // Fetch basic master data for view mode to show proper labels
    await fetchBasicMasterData();
    await fetchLocationDetails(item);

    const type = item.Customer_Type?.toString();
    let defaultValues = {};

    const safeDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

    if (["2", "3"].includes(type)) {
      defaultValues = {
        grp_no: item.Cust_No,
        cust_type: item.Customer_Type,
        grp_name: item.Full_Name,
        gerp_dob: safeDate(item.Cust_DOB),
        grp_add: item.Cust_Add,
        stateId: item.Cust_State,
        districtId: item.Cust_Dist,
        blockId: item.Cust_Blk,
        villageId: item.Cust_Vill,
        policeStationId: item.Cust_Police,
        postOfficeId: item.Cust_Post,
        grp_ben: item.Benef_No,
        grp_mob: item.Cust_Mob,
        branch_id: branchId,
        org_id: orgId,
        grp_doc: item.Cust_Voter,
      };
    } else if (type === "4") {
      defaultValues = {
        inst_name: item.Full_Name,
        inst_dob: safeDate(item.Cust_DOB),
        inst_add: item.Cust_Add,
        stateId: item.Cust_State,
        districtId: item.Cust_Dist,
        blockId: item.Cust_Blk,
        villageId: item.Cust_Vill,
        policeStationId: item.Cust_Police,
        postOfficeId: item.Cust_Post,
        inst_ben: item.Benef_No,
        inst_mob: item.Cust_Mob,
        branch_id: branchId,
        org_id: orgId,
        inst_doc: item.Cust_Voter,
      };
    } else {
      defaultValues = {
        memberNo: item.Member_No || item.Cust_No,
        memberType: item.Customer_Type,
        firstName: item.Cust_Fst_Name,
        middleName: item.Cust_Mid_Name,
        lastName: item.Cust_Lst_Name,
        relationName: item.Relation_Name,
        relationType: item.Rel_Type,
        dob: safeDate(item.Cust_DOB),
        gender: item.Cust_Gend,
        caste: item.Cust_Caste,
        religion: item.Cust_Relig,
        address: item.Cust_Add,
        stateId: item.Cust_State,
        districtId: item.Cust_Dist,
        blockId: item.Cust_Blk,
        villageId: item.Cust_Vill,
        policeStationId: item.Cust_Police,
        postOfficeId: item.Cust_Post,
        mobile: item.Cust_Mob,
        email: item.Cust_Mail,
        aadhaarNo: item.Cust_Aadar,
        voterId: item.Cust_Voter,
        rationNo: item.Cust_Ration,
        panNo: item.Cust_Pan,
        org_id: orgId,
      };
    }

    form.reset(defaultValues);
  };

  const onUpdate = async (data) => {
    const type = selectedApplication?.Customer_Type?.toString();
    let payload = {};

    console.log("update data=", data);

    if (["2", "3"].includes(type)) {
      payload = {
        grp_id: selectedApplication?.Id,
        cust_type: data.cust_type,
        grp_name: data.grp_name,
        gerp_dob: formatDate(data.gerp_dob),
        grp_add: data.grp_add,
        grp_state: data.stateId,
        grp_dist: data.districtId,
        grp_block: data.blockId,
        grp_village: data.villageId,
        grp_police: data.policeStationId,
        grp_post: data.postOfficeId,
        grp_ben: data.grp_ben,
        branch_id: branchId,
        org_id: orgId,
        grp_mob: data.grp_mob,
        group_no: data.grp_no,
        doc_no: data.grp_doc,
      };
    } else if (type === "4") {
      // Updated Institution Profile Payload
      payload = {
        inst_id: selectedApplication?.Id,
        inst_name: data.inst_name,
        inst_dob: formatDate(data.inst_dob),
        inst_add: data.inst_add,
        inst_state: data.stateId,
        inst_dist: data.districtId,
        inst_block: data.blockId,
        inst_village: data.villageId,
        inst_police: data.policeStationId,
        inst_post: data.postOfficeId,
        inst_ben: data.inst_ben,
        branch_id: branchId,
        org_id: orgId,
        inst_mob: data.inst_mob,
        inst_no: data.inst_no,
        doc_no: data.inst_doc,
      };
    } else {
      payload = {
        mem_id: selectedApplication?.Id,
        cust_type: data.memberType,
        mem_fst_name: data.firstName,
        mem_mid_name: data.middleName,
        mem_lst_name: data.lastName,
        mem_rela_name: data.relationName,
        mem_rel_type: data.relationType,
        mem_dob: formatDate(data.dob),
        mem_gend: data.gender,
        mem_caste: data.caste,
        mem_relig: data.religion,
        mem_add: data.address,
        mem_state: data.stateId,
        mem_dist: data.districtId,
        mem_block: data.blockId,
        mem_village: data.villageId,
        mem_police: data.policeStationId,
        mem_post: data.postOfficeId,
        org_id: orgId,
        mem_mob: data.mobile,
        mem_mail: data.email,
        mem_aadhar: data.aadhaarNo,
        mem_voter: data.voterId,
        mem_ration: data.rationNo,
        mem_pan: data.panNo,
        member_no: data.memberNo,
      };
    }

    try {
      let res;
      if (["2", "3"].includes(type)) {
        res = await updateGroupProfileAPI(payload);
      } else if (type === "4") {
        res = await updateInstitutionProfileAPI(payload);
      } else {
        res = await updateMemberProfileAPI(payload);
      }

      if (res?.status === 200 || res?.message === "Success") {
        toast.success("Profile Updated Successfully");
        setIsEditMode(false);
        fetchKycList();
      } else {
        toast.error(res?.details || "Update Failed");
      }
    } catch (err) {
      toast.error("Operation Failed");
    }
  };

  // const onApproveReject = async (status, remarks) => {
  //   if (!selectedApplication) return;
  //   const payload = {
  //     appl_id: selectedApplication.Id,
  //     apprv_status: status,
  //     remarks: remarks || "",
  //     org_id: orgId,
  //   };
  //   try {
  //     const res = await postKycApprovalAPI(payload);
  //     if (res?.status === 200 || res?.message === "Success") {
  //       toast.success(
  //         status === 1 ? "Approved Successfully" : "Rejected Successfully",
  //       );
  //       setOpenModal(false);
  //       fetchKycList();
  //     } else {
  //       toast.error(res?.details || "Process Failed");
  //     }
  //   } catch (err) {
  //     toast.error("Critical Error");
  //   }
  // };

  const onApproveReject = async (status, remarks) => {
    if (!selectedApplication) return;
    const payload = {
      appl_id: selectedApplication.Id,
      apprv_status: status,
      remarks: remarks || "",
      org_id: orgId,
    };
    try {
      const res = await postKycApprovalAPI(payload);
      if (res?.status === 200 || res?.message === "Success") {
        let msgText =
          status === 1 ? "Approved Successfully" : "Rejected Successfully";

        if (typeof res?.details === "string") {
          msgText = res.details;
        } else if (Array.isArray(res?.details) && res?.details.length > 0) {
          msgText = res.details[0]?.Message || msgText;
        } else if (res?.details && typeof res.details === "object") {
          msgText = res.details.Message || msgText;
        }

        setSuccessMessageText(msgText);
        setShowSuccessModal(true);
        setOpenModal(false);
      } else {
        let errText = "Process Failed";
        if (typeof res?.details === "string") {
          errText = res.details;
        } else if (Array.isArray(res?.details) && res?.details.length > 0) {
          errText = res.details[0]?.Message || errText;
        } else if (res?.details && typeof res.details === "object") {
          errText = res.details.Message || errText;
        }
        toast.error(errText);
      }
    } catch (err) {
      toast.error("Critical Error");
    }
  };

  const handleCloseSuccessMessage = () => {
    setShowSuccessModal(false);
    setSuccessMessageText("");
    fetchKycList();
  };

  return {
    kycList: currentItems,
    totalItems: filteredKycList.length,
    loading,
    form,
    openModal,
    setOpenModal,
    handleView,
    selectedApplication,
    onUpdate,
    onApproveReject,
    isEditMode,
    setIsEditMode,
    masterDataLists: localMasterData,
    searchTerm,
    setSearchTerm,
    currentPage,
    itemsPerPage,
    paginate,
    totalPages,
    fetchMasterDataForEdit,
    fetchLocationDetails,
    showSuccessModal,

    successMessageText,
    handleCloseSuccessMessage,
  };
};
