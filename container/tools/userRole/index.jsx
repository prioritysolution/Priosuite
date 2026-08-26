"use client";

import UserRole from "@/components/tools/userRole";
import getCookieData from "@/utils/getCookieData";
import { useUserRole } from "./Hooks";
import { useEffect } from "react";

const UserRoleContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    getRoleUserDataApiCall,
    getRoleModuleDataApiCall,
    form,
    handleSubmit,
    roleAssignList,
    openModuleId,
    setOpenModuleId,
  } = useUserRole();

  useEffect(() => {
    if (token && orgId) {
      getRoleUserDataApiCall(orgId);
      getRoleModuleDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <UserRole
      form={form}
      handleSubmit={handleSubmit}
      roleAssignList={roleAssignList}
      openModuleId={openModuleId}
      setOpenModuleId={setOpenModuleId}
    />
  );
};
export default UserRoleContainer;
