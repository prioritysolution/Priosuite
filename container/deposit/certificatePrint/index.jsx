"use client";

import CertificatePrint from "@/components/deposit/certificatePrint";
import { useCertificatePrint } from "./Hooks";

// import CertificatePrint from "@/components/deposit/CertificatePrint";
// import { useCertificatePrint } from "./Hooks";

const CertificatePrintContainer = () => {
  const {
    loading,
    form,
    handleSubmit,
    handleSelectAccount,
    dialougeOpen,
    setDialougeOpen,
    pageData,
    handleUpdateCertificate,
  } = useCertificatePrint();

  return (
    <CertificatePrint
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      handleSelectAccount={handleSelectAccount}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      pageData={pageData}
      handleUpdateCertificate={handleUpdateCertificate}
    />
  );
};
export default CertificatePrintContainer;
