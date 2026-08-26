// import { useEffect } from "react";
// import { usesevingsInterestCalculate } from "./Hooks";

// const SavingInterestCalculateContainer = () => {
//   const { form, handleSubmit, productList, getOperateProductAPICall, orgId } =
//     usesevingsInterestCalculate();

//   useEffect(() => {
//     if (orgId) {
//       getOperateProductAPICall(orgId, "I");
//     }
//   }, [orgId]);

//   return <div>index</div>;
// };

// export default SavingInterestCalculate;



"use client";

import { useEffect } from "react";
import { usesevingsInterestCalculate } from "./Hooks";
import SevingsInterestCalculateComponents from "@/components/deposit/sevingsInterestCalculate";
import getCookieData from "@/utils/getCookieData";

const SevingsInterestCalculateContainer = () => {
  const {
    form,
    handleSubmit,
    productList,
    interestDetails,
    getOperateProductAPICall,

    checkParamAPICall,
    isFromDateDisabled,
    loading,
    progress,
    handlePostInterest,
  } = usesevingsInterestCalculate();
  const orgId = getCookieData("orgId");

  const productType = form.watch("productType");

  useEffect(() => {
    if (orgId) {
      getOperateProductAPICall(orgId, "I");
    }
  }, [orgId]);

  useEffect(() => {
    if (productType && orgId) {
      checkParamAPICall(orgId, productType);
    }
  }, [productType, orgId]);

  useEffect(() => {
    if (productType && productList.length > 0) {
      const selectedProduct = productList.find(
        (product) => String(product.Id) === String(productType),
      );
      if (selectedProduct) {
        form.setValue("roi", selectedProduct.ROI || "");
      }
    }
  }, [productType, productList, form]);

  return (
    <SevingsInterestCalculateComponents
      form={form}
      handleSubmit={handleSubmit}
      productList={productList}
      interestDetails={interestDetails}
      isFromDateDisabled={isFromDateDisabled}
      loading={loading}
      progress={progress}
      handlePostInterest={handlePostInterest}
    />
  );
};

export default SevingsInterestCalculateContainer;
