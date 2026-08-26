import Footer from "@/components/footer";
import { useFooter } from "./Hooks";
import getCookieData from "@/utils/getCookieData";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const FooterContainer = () => {
  const token = getCookieData("prioBankClientToken");
  const orgId = getCookieData("orgId");

  // Access beg_date from Redux store
  const begDate = useSelector((state) => state?.login?.beg_date);

  const { getFinancialYearApiCall } = useFooter();

  useEffect(() => {
    if (token && orgId) {
      getFinancialYearApiCall(orgId);
    }
  }, [token, orgId]);

  console.log("Footer - Begin Date:", begDate);

  return <Footer />;
};

export default FooterContainer;
