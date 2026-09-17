import Sidebar from "../../components/sidebar";
import getCookieData from "../../utils/getCookieData";
import { useEffect } from "react";
import { useSidebar } from "./Hooks";

const SidebarContainer = ({ onClose }) => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  console.log("orgId", orgId);

  const { loading, getSidebarDataApiCall } = useSidebar();

  useEffect(() => {
    if (token && orgId) {
      console.log("orgId in sidebar", orgId);
      getSidebarDataApiCall(orgId);
    }
  }, [token, orgId]);

  return <Sidebar loading={loading} onClose={onClose} />;
};

export default SidebarContainer;
