"use client";

import CreateUser from "@/components/tools/createUser";
import getCookieData from "@/utils/getCookieData";
import { useCreateUser } from "./Hooks";
import { useEffect } from "react";

const CreateUserContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const {
    getAllUserDataApiCall,
    getUserRoleDataApiCall,
    form,
    handleSubmit,
    showForm,
    setShowForm,
  } = useCreateUser();

  useEffect(() => {
    if (token && orgId) {
      getAllUserDataApiCall(orgId);
      getUserRoleDataApiCall();
    }
  }, [token, orgId]);

  return (
    <CreateUser
      form={form}
      handleSubmit={handleSubmit}
      showForm={showForm}
      setShowForm={setShowForm}
    />
  );
};
export default CreateUserContainer;
