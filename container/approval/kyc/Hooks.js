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

let kycListInFlight = null;

const EMPTY_MASTERS = {
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
  presentDistricts: [],
  presentBlocks: [],
  presentPoliceStations: [],
  presentPostOffices: [],
  presentVillages: [],
};

const sameId = (left, right) => String(left ?? "") === String(right ?? "");
const storeId = (value) => (value == null || value === "" ? null : String(value));
const safeDate = (dateStr) => (dateStr ? new Date(dateStr) : null);

const normalizeData = (data, idKey = "Id") => {
  if (!Array.isArray(data)) return [];
  return data.map((item) => {
    const rawId =
      item[idKey] ??
      item.Id ??
      item.id ??
      item.value ??
      item.Value ??
      item.Option_Id;
    return { ...item, Id: rawId };
  });
};

const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const locationFormValues = (item) => ({
  stateId: storeId(item.Cust_State),
  districtId: storeId(item.Cust_Dist),
  blockId: storeId(item.Cust_Blk),
  villageId: storeId(item.Cust_Vill),
  policeStationId: storeId(item.Cust_Police),
  postOfficeId: storeId(item.Cust_Post),
  presentAddress: item.Cust_Pre_Add || "",
  presentStateId: storeId(item.Cust_Pre_State),
  presentDistrictId: storeId(item.Cust_Pre_Dist),
  presentBlockId: storeId(item.Cust_Pre_Blk),
  presentVillageId: storeId(item.Cusr_Pre_Vill ?? item.Cust_Pre_Vill),
  presentPoliceStationId: storeId(item.Cust_Pre_Police),
  presentPostOfficeId: storeId(item.Cust_Pre_Post),
});

const buildFormValues = (item, orgId, branchId) => {
  const type = item.Customer_Type?.toString();
  const locations = locationFormValues(item);

  if (["2", "3"].includes(type)) {
    return {
      grp_no: item.Cust_No,
      cust_type: storeId(item.Customer_Type),
      grp_name: item.Full_Name,
      gerp_dob: safeDate(item.Cust_DOB),
      grp_add: item.Cust_Add || "",
      ...locations,
      grp_ben: item.Benef_No,
      grp_mob: item.Cust_Mob,
      branch_id: branchId,
      org_id: orgId,
      grp_doc: item.Cust_Voter,
    };
  }

  if (type === "4") {
    return {
      inst_no: item.Cust_No,
      inst_name: item.Full_Name,
      inst_dob: safeDate(item.Cust_DOB),
      inst_add: item.Cust_Add || "",
      ...locations,
      inst_ben: item.Benef_No,
      inst_mob: item.Cust_Mob,
      branch_id: branchId,
      org_id: orgId,
      inst_doc: item.Cust_Voter,
    };
  }

  return {
    memberNo: item.Member_No || item.Cust_No,
    memberType: storeId(item.Customer_Type),
    firstName: item.Cust_Fst_Name,
    middleName: item.Cust_Mid_Name,
    lastName: item.Cust_Lst_Name,
    relationName: item.Relation_Name,
    relationType: storeId(item.Rel_Type),
    dob: safeDate(item.Cust_DOB),
    gender: storeId(item.Cust_Gend),
    caste: storeId(item.Cust_Caste),
    religion: storeId(item.Cust_Relig),
    address: item.Cust_Add || "",
    ...locations,
    mobile: item.Cust_Mob,
    email: item.Cust_Mail,
    aadhaarNo: item.Cust_Aadar,
    voterId: item.Cust_Voter,
    rationNo: item.Cust_Ration,
    panNo: item.Cust_Pan,
    org_id: orgId,
  };
};

const pickMessage = (details, fallback) => {
  if (typeof details === "string") return details;
  if (Array.isArray(details) && details.length > 0) {
    return details[0]?.Message || fallback;
  }
  if (details && typeof details === "object") {
    return details.Message || fallback;
  }
  return fallback;
};

export const useKycApproval = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessageText, setSuccessMessageText] = useState("");
  const [localMasterData, setLocalMasterData] = useState(EMPTY_MASTERS);

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const kycList = useSelector((state) => state.kyc.kycList);
  const loading = useSelector((state) => state.kyc.loading);

  const form = useForm({
    defaultValues: {},
    mode: "onChange",
  });

  const basicMastersLoadedRef = useRef(false);
  const locationLoadedForRef = useRef(null);
  const fetchedIdsRef = useRef({
    stateId: null,
    districtId: null,
    blockId: null,
    presentStateId: null,
    presentDistrictId: null,
    presentBlockId: null,
  });

  const patchMasters = useCallback((patch) => {
    setLocalMasterData((prev) => ({ ...prev, ...patch }));
  }, []);

  const fetchBasicMasterData = useCallback(async () => {
    if (basicMastersLoadedRef.current) return;
    const currentOrgId = getCookieData("orgId");
    if (!currentOrgId) return;

    try {
      const [memRes, relRes, genRes, cstRes, rlgRes, grpRes, stateRes] =
        await Promise.all([
          getMemberTypeAPI(currentOrgId),
          getRelationTypeAPI(currentOrgId),
          getGenderAPI(currentOrgId),
          getCasteAPI(currentOrgId),
          getReligionAPI(currentOrgId),
          getGroupTypeAPI(currentOrgId),
          getStateAPI(currentOrgId),
        ]);

      patchMasters({
        memberTypes: normalizeData(memRes?.details, "Id"),
        relationTypes: normalizeData(relRes?.details, "Id"),
        genders: normalizeData(genRes?.details, "Id"),
        castes: normalizeData(cstRes?.details, "Id"),
        religions: normalizeData(rlgRes?.details, "Id"),
        groupTypes: normalizeData(grpRes?.details, "Id"),
        states: normalizeData(stateRes?.details, "State_Id"),
      });
      basicMastersLoadedRef.current = true;
    } catch (error) {
      console.error("Error fetching basic master data", error);
      toast.error("Failed to load master data");
    }
  }, [patchMasters]);

  const fetchLocationDetails = useCallback(
    async (item, { force = false } = {}) => {
      const appKey = String(item?.Id ?? item?.Appl_No ?? "");
      if (!force && appKey && locationLoadedForRef.current === appKey) return;

      const currentOrgId = getCookieData("orgId");
      if (!currentOrgId || !item) return;

      const stateId = item.Cust_State;
      const distId = item.Cust_Dist;
      const blockId = item.Cust_Blk;
      const preStateId = item.Cust_Pre_State;
      const preDistId = item.Cust_Pre_Dist;
      const preBlockId = item.Cust_Pre_Blk;

      fetchedIdsRef.current = {
        stateId: storeId(stateId),
        districtId: storeId(distId),
        blockId: storeId(blockId),
        presentStateId: storeId(preStateId),
        presentDistrictId: storeId(preDistId),
        presentBlockId: storeId(preBlockId),
      };

      const promises = [];

      if (stateId) {
        promises.push(
          getDistrictAPI(stateId, currentOrgId).then((res) => ({
            key: "districts",
            data: normalizeData(res?.details, "Dist_Id"),
          })),
        );
      }
      if (distId) {
        promises.push(
          getPoliceStationAPI(currentOrgId, distId).then((res) => ({
            key: "policeStations",
            data: normalizeData(res?.details, "Police_Station_Id"),
          })),
        );
        promises.push(
          getPostOfficeAPI(currentOrgId, distId).then((res) => ({
            key: "postOffices",
            data: normalizeData(res?.details, "Post_Office_Id"),
          })),
        );
        if (stateId) {
          promises.push(
            getBlockAPI(currentOrgId, distId, stateId).then((res) => ({
              key: "blocks",
              data: normalizeData(res?.details, "Block_Id"),
            })),
          );
        }
      }
      if (blockId) {
        promises.push(
          getVillageAPI(currentOrgId, blockId).then((res) => ({
            key: "villages",
            data: normalizeData(res?.details, "Village_Id"),
          })),
        );
      }
      if (preStateId) {
        promises.push(
          getDistrictAPI(preStateId, currentOrgId).then((res) => ({
            key: "presentDistricts",
            data: normalizeData(res?.details, "Dist_Id"),
          })),
        );
      }
      if (preDistId) {
        promises.push(
          getPoliceStationAPI(currentOrgId, preDistId).then((res) => ({
            key: "presentPoliceStations",
            data: normalizeData(res?.details, "Police_Station_Id"),
          })),
        );
        promises.push(
          getPostOfficeAPI(currentOrgId, preDistId).then((res) => ({
            key: "presentPostOffices",
            data: normalizeData(res?.details, "Post_Office_Id"),
          })),
        );
        if (preStateId) {
          promises.push(
            getBlockAPI(currentOrgId, preDistId, preStateId).then((res) => ({
              key: "presentBlocks",
              data: normalizeData(res?.details, "Block_Id"),
            })),
          );
        }
      }
      if (preBlockId) {
        promises.push(
          getVillageAPI(currentOrgId, preBlockId).then((res) => ({
            key: "presentVillages",
            data: normalizeData(res?.details, "Village_Id"),
          })),
        );
      }

      try {
        const results = await Promise.all(promises);
        const patch = {};
        results.forEach((row) => {
          if (row?.data) patch[row.key] = row.data;
        });
        if (Object.keys(patch).length) patchMasters(patch);
        if (appKey) locationLoadedForRef.current = appKey;
      } catch (error) {
        console.error("Error fetching location details", error);
        toast.error("Failed to load location details");
      }
    },
    [patchMasters],
  );

  const fetchKycList = useCallback(async () => {
    const currentOrgId = getCookieData("orgId");
    const currentBranchId = getCookieData("userBranchId");
    if (!currentOrgId) return;
    if (kycListInFlight) return kycListInFlight;

    kycListInFlight = (async () => {
      dispatch(setLoading(true));
      try {
        const res = await getKycApplicationListAPI(currentOrgId, currentBranchId);
        if (res?.message === "Success" || res?.status === 200) {
          dispatch(getKycList(res.details || []));
        } else {
          dispatch(getKycList([]));
        }
      } catch (error) {
        toast.error("Failed to fetch applications");
      } finally {
        dispatch(setLoading(false));
        kycListInFlight = null;
      }
    })();

    return kycListInFlight;
  }, [dispatch]);

  // Page load: list + shared masters once
  useEffect(() => {
    fetchKycList();
    fetchBasicMasterData();
  }, [fetchKycList, fetchBasicMasterData]);

  // Edit-mode dependent dropdowns — only when the user changes a value
  const watchedStateId = form.watch("stateId");
  const watchedDistrictId = form.watch("districtId");
  const watchedBlockId = form.watch("blockId");
  const watchedPresentStateId = form.watch("presentStateId");
  const watchedPresentDistrictId = form.watch("presentDistrictId");
  const watchedPresentBlockId = form.watch("presentBlockId");

  useEffect(() => {
    if (!isEditMode || !watchedStateId) return;
    if (sameId(watchedStateId, fetchedIdsRef.current.stateId)) return;

    fetchedIdsRef.current.stateId = storeId(watchedStateId);
    fetchedIdsRef.current.districtId = null;
    fetchedIdsRef.current.blockId = null;
    getDistrictAPI(watchedStateId, orgId).then((res) => {
      patchMasters({
        districts: normalizeData(res?.details, "Dist_Id"),
        blocks: [],
        villages: [],
        policeStations: [],
        postOffices: [],
      });
    });
  }, [watchedStateId, isEditMode, orgId, patchMasters]);

  useEffect(() => {
    if (!isEditMode || !watchedDistrictId) return;
    if (sameId(watchedDistrictId, fetchedIdsRef.current.districtId)) return;

    fetchedIdsRef.current.districtId = storeId(watchedDistrictId);
    fetchedIdsRef.current.blockId = null;

    getPoliceStationAPI(orgId, watchedDistrictId).then((res) => {
      patchMasters({
        policeStations: normalizeData(res?.details, "Police_Station_Id"),
      });
    });
    getPostOfficeAPI(orgId, watchedDistrictId).then((res) => {
      patchMasters({
        postOffices: normalizeData(res?.details, "Post_Office_Id"),
      });
    });
    if (watchedStateId) {
      getBlockAPI(orgId, watchedDistrictId, watchedStateId).then((res) => {
        patchMasters({
          blocks: normalizeData(res?.details, "Block_Id"),
          villages: [],
        });
      });
    }
  }, [watchedDistrictId, watchedStateId, isEditMode, orgId, patchMasters]);

  useEffect(() => {
    if (!isEditMode || !watchedBlockId) return;
    if (sameId(watchedBlockId, fetchedIdsRef.current.blockId)) return;

    fetchedIdsRef.current.blockId = storeId(watchedBlockId);
    getVillageAPI(orgId, watchedBlockId).then((res) => {
      patchMasters({
        villages: normalizeData(res?.details, "Village_Id"),
      });
    });
  }, [watchedBlockId, isEditMode, orgId, patchMasters]);

  useEffect(() => {
    if (!isEditMode || !watchedPresentStateId) return;
    if (sameId(watchedPresentStateId, fetchedIdsRef.current.presentStateId)) return;

    fetchedIdsRef.current.presentStateId = storeId(watchedPresentStateId);
    fetchedIdsRef.current.presentDistrictId = null;
    fetchedIdsRef.current.presentBlockId = null;
    getDistrictAPI(watchedPresentStateId, orgId).then((res) => {
      patchMasters({
        presentDistricts: normalizeData(res?.details, "Dist_Id"),
        presentBlocks: [],
        presentVillages: [],
        presentPoliceStations: [],
        presentPostOffices: [],
      });
    });
  }, [watchedPresentStateId, isEditMode, orgId, patchMasters]);

  useEffect(() => {
    if (!isEditMode || !watchedPresentDistrictId) return;
    if (sameId(watchedPresentDistrictId, fetchedIdsRef.current.presentDistrictId)) {
      return;
    }

    fetchedIdsRef.current.presentDistrictId = storeId(watchedPresentDistrictId);
    fetchedIdsRef.current.presentBlockId = null;

    getPoliceStationAPI(orgId, watchedPresentDistrictId).then((res) => {
      patchMasters({
        presentPoliceStations: normalizeData(res?.details, "Police_Station_Id"),
      });
    });
    getPostOfficeAPI(orgId, watchedPresentDistrictId).then((res) => {
      patchMasters({
        presentPostOffices: normalizeData(res?.details, "Post_Office_Id"),
      });
    });
    if (watchedPresentStateId) {
      getBlockAPI(orgId, watchedPresentDistrictId, watchedPresentStateId).then((res) => {
        patchMasters({
          presentBlocks: normalizeData(res?.details, "Block_Id"),
          presentVillages: [],
        });
      });
    }
  }, [
    watchedPresentDistrictId,
    watchedPresentStateId,
    isEditMode,
    orgId,
    patchMasters,
  ]);

  useEffect(() => {
    if (!isEditMode || !watchedPresentBlockId) return;
    if (sameId(watchedPresentBlockId, fetchedIdsRef.current.presentBlockId)) return;

    fetchedIdsRef.current.presentBlockId = storeId(watchedPresentBlockId);
    getVillageAPI(orgId, watchedPresentBlockId).then((res) => {
      patchMasters({
        presentVillages: normalizeData(res?.details, "Village_Id"),
      });
    });
  }, [watchedPresentBlockId, isEditMode, orgId, patchMasters]);

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
  const totalPages = Math.ceil(filteredKycList.length / itemsPerPage) || 0;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleView = async (item) => {
    if (!item) return;

    setSelectedApplication(item);
    setIsEditMode(false);
    setOpenModal(true);
    setDetailLoading(true);

    try {
      await Promise.all([
        fetchBasicMasterData(),
        fetchLocationDetails(item),
      ]);
      form.reset(
        buildFormValues(item, getCookieData("orgId"), getCookieData("userBranchId")),
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleEnterEditMode = useCallback(() => {
    setIsEditMode(true);
  }, []);

  const handleCloseModal = useCallback(
    (open) => {
      setOpenModal(open);
      if (!open) {
        setIsEditMode(false);
        setSelectedApplication(null);
        setDetailLoading(false);
        form.reset({});
      }
    },
    [form],
  );

  const onUpdate = async (data) => {
    const type = selectedApplication?.Customer_Type?.toString();
    const currentOrgId = getCookieData("orgId");
    const currentBranchId = getCookieData("userBranchId");
    let payload = {};

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
        grp_pres_add: data.presentAddress,
        grp_pres_state: data.presentStateId,
        grp_pres_dist: data.presentDistrictId,
        grp_pres_block: data.presentBlockId,
        grp_pres_village: data.presentVillageId,
        grp_pres_police: data.presentPoliceStationId,
        grp_pres_post: data.presentPostOfficeId,
        grp_ben: data.grp_ben,
        branch_id: currentBranchId,
        org_id: currentOrgId,
        grp_mob: data.grp_mob,
        group_no: data.grp_no,
        doc_no: data.grp_doc,
      };
    } else if (type === "4") {
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
        inst_off_add: data.presentAddress,
        inst_off_state: data.presentStateId,
        inst_off_dist: data.presentDistrictId,
        inst_off_block: data.presentBlockId,
        inst_off_village: data.presentVillageId,
        inst_off_police: data.presentPoliceStationId,
        inst_off_post: data.presentPostOfficeId,
        same_as_reg:
          sameId(data.stateId, data.presentStateId) &&
          sameId(data.districtId, data.presentDistrictId) &&
          sameId(data.blockId, data.presentBlockId) &&
          sameId(data.villageId, data.presentVillageId) &&
          String(data.inst_add || "").trim() ===
            String(data.presentAddress || "").trim()
            ? "Y"
            : "N",
        inst_ben: data.inst_ben,
        branch_id: currentBranchId,
        org_id: currentOrgId,
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
        mem_pres_add: data.presentAddress,
        mem_pres_state: data.presentStateId,
        mem_pres_dist: data.presentDistrictId,
        mem_pres_block: data.presentBlockId,
        mem_pres_village: data.presentVillageId,
        mem_pres_police: data.presentPoliceStationId,
        mem_pres_post: data.presentPostOfficeId,
        org_id: currentOrgId,
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
        locationLoadedForRef.current = null;
        fetchKycList();
      } else {
        toast.error(pickMessage(res?.details, "Update Failed"));
      }
    } catch (err) {
      toast.error("Operation Failed");
    }
  };

  const onApproveReject = async (status, remarks) => {
    if (!selectedApplication) return;
    const payload = {
      appl_id: selectedApplication.Id,
      apprv_status: status,
      remarks: remarks || "",
      org_id: getCookieData("orgId"),
    };
    try {
      const res = await postKycApprovalAPI(payload);
      if (res?.status === 200 || res?.message === "Success") {
        const fallback =
          status === 1 ? "Approved Successfully" : "Rejected Successfully";
        setSuccessMessageText(pickMessage(res?.details, fallback));
        setShowSuccessModal(true);
        setOpenModal(false);
        setIsEditMode(false);
        locationLoadedForRef.current = null;
      } else {
        toast.error(pickMessage(res?.details, "Process Failed"));
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
    detailLoading,
    form,
    openModal,
    setOpenModal: handleCloseModal,
    handleView,
    handleEnterEditMode,
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
    showSuccessModal,
    successMessageText,
    handleCloseSuccessMessage,
  };
};
