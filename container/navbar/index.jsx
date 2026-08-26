"use client";

import Navbar from "@/components/navbar";
import { useLogout } from "./Hooks";

const NavbarContainer = ({ onMenuToggle }) => {
  const { logoutLoading, postLogoutApiCall } = useLogout();

  return (
    <Navbar
      logoutLoading={logoutLoading}
      handleLogout={postLogoutApiCall}
      onMenuToggle={onMenuToggle}
    />
  );
};

export default NavbarContainer;
