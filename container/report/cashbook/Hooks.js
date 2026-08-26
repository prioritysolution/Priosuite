"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getCashbookReportAPI } from "./CashbookApis";
import { getReportVoucherDetailsAPI } from "../daybook/DaybookApis";
import { useDispatch } from "react-redux";
import { getVoucherDetailsData } from "../daybook/DaybookReducer";

export const useCashbook = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [toDate, setToDate] = useState(null);

  const [loading, setLoading] = useState("");

  const [cashBalanceData, setCashBalanceData] = useState(null);
  const [denomData, setDenomData] = useState([]);

  const [getVoucherDetailsLoading, setGetVoucherDetailsLoading] =
    useState(false);
  const [showVoucherDetails, setShowVoucherDetails] = useState(false);

  const [totalDrAmount, setTotalDrAmount] = useState(0);
  const [totalCrAmount, setTotalCrAmount] = useState(0);

  const [ledgerTableReceiptData, setLedgerTableReceiptData] = useState([]);
  const [ledgerTablePaymentData, setLedgerTablePaymentData] = useState([]);

  const formSchema = yup.object({
    date: yup.date().required("Date is required"),
    branch: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      date: new Date(),
      branch: branchId?.toString(),
    },
  });

  const handleSubmit = (values) => {
    getCashbookReportApiCall(values);
    setToDate(format(values.date, "dd-MM-yyyy"));
  };

  const handleShowVoucherDetails = (txnId) => {
    if (orgId && txnId) {
      getReportVoucherDetailsApiCall(orgId, txnId);
      setShowVoucherDetails(true);
    }
  };

  const calculateTotal = (data, field) => {
    return (
      data &&
      data.reduce((total, item) => {
        const value = item[field];
        // Convert value to number, treating null or empty as 0
        const numericValue = value ? parseFloat(value) : 0;
        return total + numericValue;
      }, 0)
    );
  };

  const totalReceived = calculateTotal(ledgerTableReceiptData, "Cash");
  const totalPayment = calculateTotal(ledgerTablePaymentData, "Cash");

  // const convertTableData = (data) => {
  //   return data.map((item, index) => [
  //     (index + 1).toString(), // Serial No.
  //     item.Gl_Name, // Particulars
  //     item.Particular || "", // Withdrawals
  //     item.Amount || "", // Interest
  //   ]);
  // };

  // const generatePDF = () => {
  //   const doc = new jsPDF("p", "mm", "a4");

  //   // Define a function to calculate text width
  //   const getTextWidth = (text, fontSize = 10) => {
  //     doc.setFontSize(fontSize);
  //     return doc.getTextWidth(text);
  //   };

  //   const pdfTableData = convertTableData(ledgerTableReceiptData);
  //   const pdfTableDataRight = convertTableData(ledgerTablePaymentData);

  //   const pageWidth = doc.internal.pageSize.width;

  //   const headers = [
  //     [
  //       {
  //         content: "RECEIPT",
  //         colSpan: 4,
  //         halign: "center", // Center alignment for text
  //         styles: { halign: "center", fontStyle: "bold" }, // Ensure styles apply here
  //       },
  //       {
  //         content: "PAYMENT",
  //         colSpan: 4,
  //         halign: "center", // Center alignment for text
  //         styles: { halign: "center", fontStyle: "bold" }, // Ensure styles apply here
  //       },
  //     ],
  //     [
  //       { content: "SL. NO." },
  //       { content: "HEAD OF ACCOUNT GL." },
  //       { content: "PARTICULARS" },
  //       { content: "AMOUNT" },
  //       { content: "SL. NO." },
  //       { content: "HEAD OF ACCOUNT GL." },
  //       { content: "PARTICULARS" },
  //       { content: "AMOUNT" },
  //     ],
  //   ];

  //   // Ensure both tables have the same number of rows
  //   const maxRows = Math.max(pdfTableData.length, pdfTableDataRight.length);
  //   const mergedTableData = Array.from({ length: maxRows }, (_, i) => [
  //     ...(pdfTableData[i] || Array(6).fill("")), // Left table data
  //     ...(pdfTableDataRight[i] || Array(6).fill("")), // Right table data
  //   ]);

  //   // Render the side-by-side table with multi-row headers
  //   doc.autoTable({
  //     head: headers, // Multi-row headers
  //     body: mergedTableData,
  //     startY: 40,
  //     margin: { left: 5 },
  //     headStyles: {
  //       fillColor: [255, 255, 255], // White background for header
  //       textColor: [0, 0, 0], // Black text for header
  //       fontStyle: "bold", // Bold font style for header
  //     },
  //     styles: {
  //       overflow: "linebreak",
  //       fontSize: 10,
  //       lineColor: [0, 0, 0],
  //       lineWidth: 0.25,
  //       valign: "middle",
  //       minCellHeight: 14,
  //       fillColor: [255, 255, 255], // White background for all cells
  //     },
  //     columnStyles: {
  //       0: { cellWidth: 10 },
  //       1: { cellWidth: 40 },
  //       2: { cellWidth: 30 },
  //       3: { cellWidth: 20 },
  //       4: { cellWidth: 10 },
  //       5: { cellWidth: 40 },
  //       6: { cellWidth: 30 },
  //       7: { cellWidth: 20 },
  //     },
  //     didDrawPage: (data) => {
  //       // Check if it's the first page
  //       let startY = 7;
  //       if (data.pageNumber === 1) {
  //         // Organization details on the first page
  //         const orgDetails = [
  //           orgName,
  //           branchName,
  //           address,
  //           regNo, // Assuming you have currentDate defined
  //         ];

  //         doc.setFontSize(10);
  //         orgDetails.forEach((detail, index) => {
  //           const detailTextWidth = getTextWidth(detail, 10);
  //           const detailXPos = (pageWidth - detailTextWidth) / 2; // Center alignment
  //           doc.text(detail, detailXPos, startY + index * 6); // Spacing each line by 5mm
  //         });

  //         // Adjust startY to be after the organization details
  //         startY += orgDetails.length * 6; // Adding extra padding after details
  //       }

  //       // Header text placed after the organization details
  //       const headerText = `Cash Book As On ${toDate}`;
  //       const textWidth = getTextWidth(headerText, 16);
  //       const xPos = (pageWidth - textWidth) / 2;

  //       doc.setFontSize(16);
  //       doc.setTextColor(40);
  //       doc.text(
  //         headerText,
  //         xPos,
  //         data.pageNumber === 1 ? startY + 4 : startY + 2
  //       ); // Place the header below org details

  //       // Footer (same for all pages)
  //       const footerY = doc.internal.pageSize.height - 10;
  //       const leftText = `Generated By: ${userName}`;
  //       const rightText = `Generated On: ${format(
  //         currentDate,
  //         "dd-MM-yyyy"
  //       )} ${currentTime}`;
  //       const middleText = `This is a computer-generated report and does not require a signature.`;

  //       doc.setFontSize(12);
  //       doc.text(
  //         leftText,
  //         5,
  //         data.pageNumber === 1 ? footerY - 1 : footerY - 2
  //       );
  //       const rightTextWidth = getTextWidth(rightText, 10);
  //       doc.text(
  //         rightText,
  //         pageWidth - rightTextWidth - 5,
  //         data.pageNumber === 1 ? footerY - 1 : footerY - 2
  //       );

  //       // Middle text (centered)
  //       const middleTextWidth = getTextWidth(middleText, 10);
  //       const middleXPos = (pageWidth - middleTextWidth) / 2;
  //       doc.setTextColor(128, 128, 128); // Set text color to gray
  //       doc.text(middleText, middleXPos, footerY + 5);

  //       // Reset text color
  //       doc.setTextColor(0, 0, 0);

  //       // Page number
  //       doc.text(
  //         `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
  //         data.settings.margin.left,
  //         doc.internal.pageSize.height - 5
  //       );

  //       // Adjust table or other content start position
  //       if (data.pageNumber === 1) {
  //         data.cursor.y = startY; // Start table or content below header and org details
  //       }
  //     },
  //     didDrawCell: (data) => {
  //       // Calculate where the table ends (for adding Grand Total later)
  //       if (data.row.index === mergedTableData.length - 1) {
  //         const finalY = data.cursor.y; // Get the Y position after the last row is drawn

  //         // Add the grand total row after the table ends
  //         doc.autoTable({
  //           body: [
  //             [
  //               {
  //                 content: "Total",
  //                 colSpan: 3,
  //                 styles: { halign: "center", fontStyle: "bold" },
  //               }, // Span first 3 columns
  //               {
  //                 content: totalCrAmount,
  //                 styles: { fontStyle: "bold" },
  //               }, // Withdrawn total
  //               {
  //                 content: "Total",
  //                 colSpan: 3,
  //                 styles: { fontStyle: "bold" },
  //               }, // Deposit total
  //               {
  //                 content: totalDrAmount,
  //                 styles: { fontStyle: "bold" },
  //               }, // Deposit total
  //             ],
  //             [
  //               {
  //                 content: "Opening Balance",
  //                 colSpan: 3,
  //                 styles: { halign: "center", fontStyle: "bold" },
  //               }, // Span first 3 columns
  //               {
  //                 content: cashBalanceData ? cashBalanceData?.Opening : 0,
  //                 styles: { fontStyle: "bold" },
  //               }, // Withdrawn total
  //               {
  //                 content: "Closing Balance",
  //                 colSpan: 3,
  //                 styles: { fontStyle: "bold" },
  //               }, // Deposit total
  //               {
  //                 content: cashBalanceData ? cashBalanceData?.Closing : 0,
  //                 styles: { fontStyle: "bold" },
  //               }, // Deposit total
  //             ],
  //             [
  //               {
  //                 content: `Closing Balance In Word :  Rupees ${convertToWords(
  //                   cashBalanceData && cashBalanceData.Closing
  //                     ? parseFloat(cashBalanceData.Closing)
  //                     : 0
  //                 )} Only`,
  //                 colSpan: 8,
  //                 styles: { halign: "right", fontStyle: "bold" },
  //               }, // Span first 3 columns
  //             ],
  //           ],
  //           startY: finalY + 14, // Add padding after the main table
  //           margin: { horizontal: 5 },
  //           styles: {
  //             overflow: "linebreak",
  //             fontSize: 10,
  //             fontStyle: "bold", // Make text bold for this row
  //             lineColor: [0, 0, 0],
  //             lineWidth: 0.25,
  //             valign: "middle",
  //             minCellHeight: 14,
  //             fillColor: [255, 255, 255],
  //           },
  //           columnStyles: {
  //             0: { cellWidth: 10 },
  //             1: { cellWidth: 40 },
  //             2: { cellWidth: 30 },
  //             3: { cellWidth: 20 },
  //             4: { cellWidth: 10 },
  //             5: { cellWidth: 40 },
  //             6: { cellWidth: 30 },
  //             7: { cellWidth: 20 },
  //           },
  //         });

  //         // Save the PDF after adding grand total row
  //         // doc.save("data.pdf");
  //       }
  //     },
  //   });

  //   // Save the PDF
  //   doc.save(`CASHBOOK_${toDate}.pdf`);
  // };

  const getCashbookReportApiCall = async (item) => {
    setLoading(true);

    const date = item.date && format(item.date, "yyyy-MM-dd");

    try {
      const res = await getCashbookReportAPI(orgId, item.branch, date, 1);
      if (res.message === "Data Found") {
        setLedgerTableReceiptData(res.details[0]?.Receipt_Data);
        setLedgerTablePaymentData(res.details[0]?.Payment_Data);
        setCashBalanceData({
          Opening: res.details[0].Opening_Cash,
          Closing: res.details[0].Closing_Cash,
        });
        setDenomData(res.details[0]?.Denom_Data);
      } else {
        setLedgerTableReceiptData([]);
        setLedgerTablePaymentData([]);
        setCashBalanceData(null);
        setDenomData([]);
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      setLedgerTableReceiptData([]);
      setLedgerTablePaymentData([]);
      setCashBalanceData(null);
      setDenomData([]);
    } finally {
      setLoading(false);
    }
  };

  const getReportVoucherDetailsApiCall = async (orgId, txnId) => {
    setGetVoucherDetailsLoading(true);

    try {
      const res = await getReportVoucherDetailsAPI(orgId, txnId);

      if (res.message === "Data Found") {
        dispatch(getVoucherDetailsData(res.details));

        let newTotalDrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "D"),
          "Amount"
        );
        let newTotalCrAmount = calculateTotal(
          res.details.filter((data) => data.Trans_Type === "C"),
          "Amount"
        );

        setTotalDrAmount(newTotalDrAmount);
        setTotalCrAmount(newTotalCrAmount);
      } else {
        dispatch(getVoucherDetailsData([]));
        setTotalDrAmount(0);
        setTotalCrAmount(0);
      }
      console.log(res);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      dispatch(getVoucherDetailsData([]));
      setTotalDrAmount(0);
      setTotalCrAmount(0);
    } finally {
      setGetVoucherDetailsLoading(false);
    }
  };

  return {
    loading,
    getVoucherDetailsLoading,
    form,
    handleSubmit,
    ledgerTableReceiptData,
    ledgerTablePaymentData,
    totalReceived,
    totalPayment,
    // generatePDF,
    toDate,
    cashBalanceData,
    showVoucherDetails,
    setShowVoucherDetails,
    handleShowVoucherDetails,
    totalDrAmount,
    totalCrAmount,
    denomData,
  };
};
