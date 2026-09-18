"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getBranchListAPI, postLogoutAPI } from "./NavbarApis";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Cookies from "@/utils/secureCookieHelper";
import getCookieData from "@/utils/getCookieData";
import { getSidebarData } from "@/container/sidebar/SidebarReducer";
import { clearStoredUserDashboard } from "@/utils/userDashboardStorage";

const COOKIE_OPTIONS = {
  expires: 7,
  secure: true,
  sameSite: "Strict",
  path: "/",
};

export const useNavbarBranch = () => {
  const [branchOptions, setBranchOptions] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    const orgId = getCookieData("orgId");
    const branchId = getCookieData("userBranchId");
    setSelectedBranch(branchId ? String(branchId) : "");

    if (!orgId) return;

    const loadBranches = async () => {
      setBranchLoading(true);
      try {
        const res = await getBranchListAPI(orgId, branchId || "");
        const list = res?.details || res?.Data || [];
        setBranchOptions(Array.isArray(list) ? list : []);
      } catch (error) {
        console.error(error);
        setBranchOptions([]);
      } finally {
        setBranchLoading(false);
      }
    };

    loadBranches();
  }, []);

  const handleBranchChange = (value) => {
    const nextValue = value === null || value === undefined ? "" : String(value);
    setSelectedBranch(nextValue);
    Cookies.set("userBranchId", nextValue, COOKIE_OPTIONS);

    const match = branchOptions.find(
      (item) => String(item?.Id ?? item?.id ?? "") === nextValue,
    );
    if (match?.Branch_Name) {
      Cookies.set("userBranchName", match.Branch_Name, COOKIE_OPTIONS);
    }
  };

  return {
    branchOptions,
    branchLoading,
    selectedBranch,
    handleBranchChange,
  };
};

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const postLogoutApiCall = async () => {
    setLogoutLoading(true);
    try {
      const res = await postLogoutAPI();
      if (res.message === "Success") {
        toast.success("Logged out successfully");
      } else {
        toast.error(res.message);
      }
      clearStoredUserDashboard();
      dispatch(getSidebarData([]));
      Cookies.remove("prioBankClientToken");
      Cookies.remove("orgId");
      Cookies.remove("userName");
      Cookies.remove("userOrgName");
      Cookies.remove("userBranchId");
      Cookies.remove("userBranchName");
      Cookies.remove("userBranchAddress");
      Cookies.remove("userOrgAddress");
      Cookies.remove("userOrgRegistration");
      Cookies.remove("userOrgLogo");
      Cookies.remove("userIsActiveDenomination");
      Cookies.remove("year_id");
      Cookies.remove("beg_id");
      Cookies.remove("beg_date");
      Cookies.remove("finId");
      Cookies.remove("is_open");
      Cookies.remove("fin_start_date");
      Cookies.remove("fin_end_date");
      Cookies.remove("is_pass_header");

      // Priosuite IMS

      Cookies.remove("priosuite_Ims_prioBankClientToken");
      Cookies.remove("priosuite_Ims_Is_Main_Dash");
      Cookies.remove("priosuite_Ims_orgId");
      Cookies.remove("priosuite_Ims_userName");
      Cookies.remove("priosuite_Ims_userOrgName");
      Cookies.remove("priosuite_Ims_userBranchId");
      Cookies.remove("priosuite_Ims_userBranchName");
      Cookies.remove("priosuite_Ims_userBranchAddress");
      Cookies.remove("priosuite_Ims_userOrgAddress");
      Cookies.remove("priosuite_Ims_userOrgRegistration");
      Cookies.remove("priosuite_Ims_userOrgLogo");
      Cookies.remove("priosuite_Ims_userIsActiveDenomination");
      Cookies.remove("priosuite_Ims_year_id");
      Cookies.remove("priosuite_Ims_is_open");
      Cookies.remove("priosuite_Ims_fin_start_date");
      Cookies.remove("priosuite_Ims_fin_end_date");
      Cookies.remove("priosuite_Ims_is_pass_header");
      Cookies.remove("priosuite_Ims_beg_id");
      Cookies.remove("priosuite_Ims_beg_date");

      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLogoutLoading(false);
    }
  };
  return {
    logoutLoading,
    postLogoutApiCall,
  };
};

const flattenDashboardMenus = (data = []) => {
  const items = [];

  data.forEach((section) => {
    const group = section?.title || "";

    if (section?.path) {
      items.push({
        label: section.title,
        group,
        href: section.path,
      });
    }

    (section?.childLinks || []).forEach((child) => {
      const href = child?.Page_Allies;
      if (!href) return;
      items.push({
        label: child.Menue_Name,
        group,
        href,
      });
    });
  });

  return items;
};

export const useNavbarSearch = () => {
  const router = useRouter();
  const sidebarData = useSelector((state) => state?.sidebar?.sidebarData) || [];

  const searchForm = useForm({
    defaultValues: { search: "" },
  });

  const searchValue = searchForm.watch("search");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const menuItems = useMemo(
    () => flattenDashboardMenus(sidebarData),
    [sidebarData],
  );

  const suggestions = useMemo(() => {
    const query = String(searchValue || "")
      .trim()
      .toLowerCase();
    if (!query) return [];

    return menuItems
      .filter(
        (item) =>
          item.label?.toLowerCase().includes(query) ||
          item.group?.toLowerCase().includes(query),
      )
      .slice(0, 12);
  }, [menuItems, searchValue]);

  const handleSelectSuggestion = (item) => {
    if (!item?.href) return;
    searchForm.setValue("search", "");
    setShowSuggestions(false);
    router.push(item.href);
  };

  return {
    searchForm,
    searchValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    hasMenuData: menuItems.length > 0,
  };
};
