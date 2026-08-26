"use client";

import ShareProduct from "@/components/master/shareProduct";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useShareProduct } from "./Hooks";

const ShareProductContainer = () => {
  const token = getCookieData("prioBankClientToken");

  const { getMemberTypeDataApiCall, loading, form, handleSubmit, orgId } =
    useShareProduct();

  useEffect(() => {
    if (token && orgId) {
      getMemberTypeDataApiCall(orgId);
    }
  }, [token, orgId]);

  return (
    <ShareProduct loading={loading} form={form} handleSubmit={handleSubmit} />
  );
};
export default ShareProductContainer;
