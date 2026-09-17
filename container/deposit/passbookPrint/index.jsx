// "use client";

// import PassbookPrint from "@/components/deposit/passbookPrint";
// import { usePassbookPrint } from "./Hooks";

// const PassbookPrintContainer = () => {
//   const {
//     loading,
//     form,
//     handleSubmit,
//     handleSelectAccount,
//     dialougeOpen,
//     setDialougeOpen,
//     pageParameter,
//     frontPageDetail,
//     pageData,
//     showPage,
//     showLine,
//     handleUpdateTrans,
//   } = usePassbookPrint();

//   return (
//     <PassbookPrint
//       loading={loading}
//       form={form}
//       handleSubmit={handleSubmit}
//       handleSelectAccount={handleSelectAccount}
//       dialougeOpen={dialougeOpen}
//       setDialougeOpen={setDialougeOpen}
//       pageParameter={pageParameter}
//       frontPageDetail={frontPageDetail}
//       pageData={pageData}
//       showPage={showPage}
//       showLine={showLine}
//       handleUpdateTrans={handleUpdateTrans}
//     />
//   );
// };
// export default PassbookPrintContainer;

"use client";

import PassbookPrint from "@/components/deposit/passbookPrint";
import { usePassbookPrint } from "./Hooks";

const PassbookPrintContainer = () => {
  const {
    loading,
    form,
    handleSubmit,
    handleSelectAccount,
    dialougeOpen,
    setDialougeOpen,
    pageParameter,
    frontPageDetail,
    pageData,
    showPage,
    showLine,
    handleUpdateTrans,
    operateProductData,
  } = usePassbookPrint();

  return (
    <PassbookPrint
      loading={loading}
      form={form}
      handleSubmit={handleSubmit}
      handleSelectAccount={handleSelectAccount}
      dialougeOpen={dialougeOpen}
      setDialougeOpen={setDialougeOpen}
      pageParameter={pageParameter}
      frontPageDetail={frontPageDetail}
      pageData={pageData}
      showPage={showPage}
      showLine={showLine}
      handleUpdateTrans={handleUpdateTrans}
      operateProductData={operateProductData}
    />
  );
};
export default PassbookPrintContainer;
