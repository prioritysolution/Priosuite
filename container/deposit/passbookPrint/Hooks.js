// "use client";
// import { useEffect, useState } from "react";
// import * as yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { useForm } from "react-hook-form";
// import getCookieData from "@/utils/getCookieData";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { format } from "date-fns";
// import {
//   getPassbookPrintAPI,
//   updatePassbookTransAPI,
// } from "./PassbookPrintApis";
// import {
//   setFrontPageData,
//   setTransPageData,
//   setTransParams,
//   clearPageData,
// } from "./passbookPrintReducer";

// export const usePassbookPrint = () => {
//   const dispatch = useDispatch();

//   const startDate = getCookieData("fin_start_date");
//   const endDate = getCookieData("fin_end_date");

//   // ── Redux state ──────────────────────────────────────────────────────────
//   const pageParameter = useSelector(
//     (state) => state?.passbookPrint?.pageParameter,
//   );
//   const frontPageDetail = useSelector(
//     (state) => state?.passbookPrint?.frontPageDetail,
//   );
//   const pageData = useSelector((state) => state?.passbookPrint?.pageData);
//   const showPage = useSelector((state) => state?.passbookPrint?.showPage);
//   const showLine = useSelector((state) => state?.passbookPrint?.showLine);
//   const lastItem = useSelector((state) => state?.passbookPrint?.lastItem);
//   const lastDate = useSelector((state) => state?.passbookPrint?.lastDate);
//   const sl = useSelector((state) => state?.passbookPrint?.sl);

//   // ── Local UI-only state ──────────────────────────────────────────────────
//   const orgId = getCookieData("orgId");
//   const [loading, setLoading] = useState(false);
//   const [dialougeOpen, setDialougeOpen] = useState(false);

//   const formSchema = yup.object({
//     printType: yup.string().nullable(),
//     line: yup.string().nullable(),
//     date: yup
//       .date()
//       .transform((value, originalValue) =>
//         originalValue === "" ? null : value,
//       )
//       .typeError("Invalid date")
//       .nullable(),
//     accountNo: yup.string().required("Account No is required"),
//     dialougeMemberNo: yup.string(),
//     dialougeAccountName: yup.string(),
//   });

//   const form = useForm({
//     resolver: yupResolver(formSchema),
//     defaultValues: {
//       line: "",
//       printType: "1",
//       accountNo: "",
//       dialougeMemberNo: "",
//       dialougeAccountName: "",
//     },
//   });

//   const { printType, accountNo } = form.watch();

//   const handleSubmit = (values) => {
//     dispatch(clearPageData());
//     if (values.printType === "1") getPassbookFrontPageApiCall(values);
//     else {
//       if (values.date && values.line) getPassbookTransPageApiCall(values);
//       else toast.error("Please enter a valid date and line");
//     }
//   };

//   const handleSelectAccount = (data) => {
//     form.setValue("accountNo", data.Account_No);
//     setDialougeOpen(false);
//   };

//   const handleUpdateTrans = (lastLine) => {
//     if (orgId) updatePassbookTransPageApiCall(orgId, lastLine);
//   };

//   // ── Mode 1: Front page ───────────────────────────────────────────────────
//   const getPassbookFrontPageApiCall = async (item) => {
//     setLoading(true);
//     try {
//       const res = await getPassbookPrintAPI(orgId, item.accountNo, "", "", 1);

//       if (res.message === "Data Found") {
//         dispatch(
//           setFrontPageData({
//             parameter: res.details.Parameater[0],
//             details: res.details.Details[0], // raw object – component renders by field
//           }),
//         );
//       } else {
//         dispatch(clearPageData());
//         toast.error(res.details);
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(clearPageData());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Mode 3: Transaction page ─────────────────────────────────────────────
//   const getPassbookTransPageApiCall = async (item) => {
//     setLoading(true);

//     // Only send last sl when the selected date matches the last printed date
//     const postSl =
//       format(item.date, "yyyy-MM-dd") ===
//       format(new Date(lastDate), "yyyy-MM-dd")
//         ? sl
//         : "";

//     try {
//       const res = await getPassbookPrintAPI(
//         orgId,
//         item.accountNo,
//         format(item.date, "yyyy-MM-dd"),
//         postSl,
//         3,
//       );

//       if (res.message === "Data Found") {
//         dispatch(
//           setTransPageData({
//             parameter: res.details.Parameater[0],
//             details: res.details.Details,
//             showLine: item.line,
//           }),
//         );
//       } else {
//         dispatch(clearPageData());
//       }
//     } catch (error) {
//       console.error(error);
//       dispatch(clearPageData());
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Update passbook after print ──────────────────────────────────────────
//   const updatePassbookTransPageApiCall = async (orgId, lastLine) => {
//     setLoading(true);

//     const data = {
//       org_id: orgId,
//       acct_id: lastItem?.Acct_Id,
//       last_date: lastItem?.Trans_Date,
//       last_line: lastLine,
//       last_trans_sl: lastItem?.Id,
//     };

//     try {
//       await updatePassbookTransAPI(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Mode 2: Pre-fill form with last printed params ───────────────────────
//   const getPassbookTransParamsApiCall = async (accountNo) => {
//     setLoading(true);

//     try {
//       const res = await getPassbookPrintAPI(orgId, accountNo, "", "", 2);

//       if (res.message === "Data Found") {
//         if (!res.details?.Details) {
//           // No previous print — start from beginning
//           form.setValue("date", new Date(startDate));
//           form.setValue("line", 1);
//           dispatch(
//             setTransParams({
//               lastDate: startDate,
//               lastLine: 1,
//               lastTransSl: "",
//             }),
//           );
//         } else {
//           const detail = res.details.Details[0];
//           form.setValue("date", new Date(detail.Last_Date));
//           form.setValue("line", detail.Last_Line);
//           dispatch(
//             setTransParams({
//               lastDate: detail.Last_Date,
//               lastLine: detail.Last_Line,
//               lastTransSl: detail.Last_Trans_Sl,
//             }),
//           );
//         }
//       } else {
//         form.setValue("date", new Date(startDate));
//         form.setValue("line", 1);
//         dispatch(
//           setTransParams({
//             lastDate: startDate,
//             lastLine: 1,
//             lastTransSl: "",
//           }),
//         );
//       }
//     } catch (error) {
//       console.error(error);
//       form.setValue("date", new Date(startDate));
//       form.setValue("line", 1);
//       dispatch(
//         setTransParams({
//           lastDate: startDate,
//           lastLine: 1,
//           lastTransSl: "",
//         }),
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (printType === "2" && accountNo) {
//       getPassbookTransParamsApiCall(accountNo);
//     }
//   }, [printType, accountNo]);

//   return {
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
//   };
// };

"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import getCookieData from "@/utils/getCookieData";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import {
  getPassbookPrintAPI,
  updatePassbookTransAPI,
} from "./PassbookPrintApis";
import { getOperateProductAPI } from "@/container/deposit/deposit/DepositApis";
import { getOperateProductData } from "@/container/deposit/deposit/DepositReducer";
import {
  setFrontPageData,
  setTransPageData,
  setTransParams,
  clearPageData,
} from "./passbookPrintReducer";

export const usePassbookPrint = () => {
  const dispatch = useDispatch();

  const startDate = getCookieData("fin_start_date");
  const endDate = getCookieData("fin_end_date");

  // ── Redux state ──────────────────────────────────────────────────────────
  const pageParameter = useSelector(
    (state) => state?.passbookPrint?.pageParameter,
  );
  const frontPageDetail = useSelector(
    (state) => state?.passbookPrint?.frontPageDetail,
  );
  const pageData = useSelector((state) => state?.passbookPrint?.pageData);
  const showPage = useSelector((state) => state?.passbookPrint?.showPage);
  const showLine = useSelector((state) => state?.passbookPrint?.showLine);
  const lastItem = useSelector((state) => state?.passbookPrint?.lastItem);
  const lastDate = useSelector((state) => state?.passbookPrint?.lastDate);
  const sl = useSelector((state) => state?.passbookPrint?.sl);

  // ── Local UI-only state ──────────────────────────────────────────────────
  const orgId = getCookieData("orgId");
  const [loading, setLoading] = useState(false);
  const [dialougeOpen, setDialougeOpen] = useState(false);

  const formSchema = yup.object({
    productId: yup.string().required("Product is required"),
    printType: yup.string().nullable(),
    line: yup.string().nullable(),
    date: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value,
      )
      .typeError("Invalid date")
      .nullable(),
    accountNo: yup.string().required("Account No is required"),
    dialougeMemberNo: yup.string(),
    dialougeAccountName: yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      productId: "",
      line: "",
      printType: "1",
      accountNo: "",
      dialougeMemberNo: "",
      dialougeAccountName: "",
    },
  });

  const { printType, accountNo } = form.watch();

  const handleSubmit = (values) => {
    dispatch(clearPageData());
    if (values.printType === "1") getPassbookFrontPageApiCall(values);
    else {
      if (values.date && values.line) getPassbookTransPageApiCall(values);
      else toast.error("Please enter a valid date and line");
    }
  };

  const handleSelectAccount = (data) => {
    form.setValue("accountNo", data.Account_No);
    setDialougeOpen(false);
  };

  const handleUpdateTrans = (lastLine) => {
    if (orgId) updatePassbookTransPageApiCall(orgId, lastLine);
  };

  // ── Mode 1: Front page ───────────────────────────────────────────────────
  const getPassbookFrontPageApiCall = async (item) => {
    setLoading(true);
    try {
      const res = await getPassbookPrintAPI(orgId, item.accountNo, "", "", 1, item.productId);
      console.log("getPassbookPrintAPI when 2");

      if (res.message === "Data Found") {
        const parameter = res.details?.Parameater?.[0] || null;
        const detailsObj = res.details?.Details?.[0] || null;
        dispatch(
          setFrontPageData({
            parameter,
            details: detailsObj, // raw object – component renders by field
          }),
        );
      } else {
        dispatch(clearPageData());
        toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      dispatch(clearPageData());
    } finally {
      setLoading(false);
    }
  };

  // ── Mode 3: Transaction page ─────────────────────────────────────────────
  const getPassbookTransPageApiCall = async (item) => {
    setLoading(true);
    console.log("getPassbookPrintAPI  item=", item);

    const postSl =
      format(item.date, "yyyy-MM-dd") ===
        format(new Date(lastDate), "yyyy-MM-dd") &&
      Number(item.line) === Number(showLine)
        ? sl
        : "";

    try {
      const res = await getPassbookPrintAPI(
        orgId,
        item.accountNo,
        format(item.date, "yyyy-MM-dd"),
        postSl,
        3,
        item.productId,
      );
      console.log("getPassbookPrintAPI when 3");

      if (res.message === "Data Found") {
        const parameter = res.details?.Parameater?.[0] || null;
        const detailsArr = res.details?.Details || [];
        dispatch(
          setTransPageData({
            parameter,
            details: detailsArr,
            showLine: item.line,
          }),
        );
      } else {
        dispatch(clearPageData());
      }
    } catch (error) {
      console.error(error);
      dispatch(clearPageData());
    } finally {
      setLoading(false);
    }
  };

  // ── Update passbook after print ──────────────────────────────────────────
  const updatePassbookTransPageApiCall = async (orgId, lastLine) => {
    setLoading(true);

    const data = {
      org_id: orgId,
      acct_id: lastItem?.Acct_Id,
      last_date: lastItem?.Trans_Date,
      last_line: lastLine,
      last_trans_sl: lastItem?.Id,
    };

    try {
      await updatePassbookTransAPI(data);
      toast.success("Passbook printed and updated successfully");
      form.reset({
        productId: "",
        line: "",
        printType: "1",
        accountNo: "",
        dialougeMemberNo: "",
        dialougeAccountName: "",
      });
      dispatch(clearPageData());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ── Mode 2: Pre-fill form with last printed params ───────────────────────
  const getPassbookTransParamsApiCall = async (accountNo) => {
    setLoading(true);

    try {
      const res = await getPassbookPrintAPI(orgId, accountNo, "", "", 2, form.getValues("productId"));
      console.log("getPassbookPrintAPI when 1");

      if (res.message === "Data Found") {
        if (!res.details?.Details) {
          // No previous print — start from beginning
          form.setValue("date", new Date(startDate));
          form.setValue("line", 1);
          dispatch(
            setTransParams({
              lastDate: startDate,
              lastLine: 1,
              lastTransSl: "",
            }),
          );
        } else {
          const detail = res.details.Details[0];
          form.setValue("date", new Date(detail.Last_Date));
          form.setValue("line", detail.Last_Line);
          dispatch(
            setTransParams({
              lastDate: detail.Last_Date,
              lastLine: detail.Last_Line,
              lastTransSl: detail.Last_Trans_Sl,
            }),
          );
        }
      } else {
        form.setValue("date", new Date(startDate));
        form.setValue("line", 1);
        dispatch(
          setTransParams({
            lastDate: startDate,
            lastLine: 1,
            lastTransSl: "",
          }),
        );
      }
    } catch (error) {
      console.error(error);
      form.setValue("date", new Date(startDate));
      form.setValue("line", 1);
      dispatch(
        setTransParams({
          lastDate: startDate,
          lastLine: 1,
          lastTransSl: "",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (printType === "2" && accountNo && form.watch("productId")) {
      getPassbookTransParamsApiCall(accountNo);
    }
  }, [printType, accountNo, form.watch("productId")]);

  const operateProductData = useSelector(
    (state) => state?.deposit?.operateProductData,
  );

  const getOperateProductAPICall = async (orgId, screen) => {
    try {
      const res = await getOperateProductAPI(orgId, screen);
      if (res.message === "Data Found") {
        dispatch(getOperateProductData(res.details));
      }
    } catch (error) {
      console.error(error);
      dispatch(getOperateProductData([]));
    }
  };

  useEffect(() => {
    if (orgId && (!operateProductData || operateProductData.length === 0)) {
      getOperateProductAPICall(orgId, "D");
    }
  }, [orgId]);

  useEffect(() => {
    dispatch(clearPageData());
    return () => {
      dispatch(clearPageData());
    };
  }, [dispatch]);

  return {
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
  };
};
