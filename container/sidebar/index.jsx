import Sidebar from "../../components/sidebar";
import getCookieData from "../../utils/getCookieData";
import { useLayoutEffect } from "react";
import { useSidebar } from "./Hooks";

const SidebarContainer = ({ onClose }) => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  const { loading, getSidebarDataApiCall } = useSidebar();

  useLayoutEffect(() => {
    if (token && orgId) {
      getSidebarDataApiCall(orgId);
    }
  }, [token, orgId, getSidebarDataApiCall]);

  return <Sidebar loading={loading} onClose={onClose} />;
};

export default SidebarContainer;
