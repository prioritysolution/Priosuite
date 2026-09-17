"use client";

import Navbar from "@/components/navbar";
import { useLogout, useNavbarBranch, useNavbarSearch } from "./Hooks";

const NavbarContainer = ({ onMenuToggle }) => {
  const { logoutLoading, postLogoutApiCall } = useLogout();
  const { branchOptions, branchLoading, selectedBranch, handleBranchChange } =
    useNavbarBranch();
  const {
    searchForm,
    searchValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
    hasMenuData,
  } = useNavbarSearch();

  return (
    <Navbar
      logoutLoading={logoutLoading}
      handleLogout={postLogoutApiCall}
      onMenuToggle={onMenuToggle}
      branchOptions={branchOptions}
      branchLoading={branchLoading}
      selectedBranch={selectedBranch}
      onBranchChange={handleBranchChange}
      searchForm={searchForm}
      searchValue={searchValue}
      suggestions={suggestions}
      showSuggestions={showSuggestions}
      setShowSuggestions={setShowSuggestions}
      handleSelectSuggestion={handleSelectSuggestion}
      hasMenuData={hasMenuData}
    />
  );
};

export default NavbarContainer;
