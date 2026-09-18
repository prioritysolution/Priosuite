"use client";

import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import convertToWords from "@/utils/numberToWords";
import { useEffect, useState } from "react";

const PreviewModal = ({
  printRef,
  ledgerTableReceiptData,
  ledgerTablePaymentData,
  denomData,
  // generatePDF,
  fromDate,
  toDate,
  totalCashReceived,
  totalTranferReceived,
  totalReceived,
  totalCashPayment,
  totalTranferPayment,
  totalPayment,
  cashBalanceData,
}) => {
  const { t } = useTranslation();

  const [userName, setUserName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [regNo, setRegNo] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserName(getCookieData("userName"));
      setOrgName(getCookieData("userOrgName"));
      setBranchName(getCookieData("userBranchName"));
      setAddress(getCookieData("userOrgAddress"));
      setRegNo(getCookieData("userOrgRegistration"));
    }
  }, []);

  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    let hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, "0");

    setCurrentDate(`${day}-${month}-${year}`);
    setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
  }, []);

  const PAGE_ROWS = 11;

  const paginateWithFooterCheck = (data) => {
    const pages = [];
    let serial = 1;
    let remaining = Array.isArray(data) ? [...data] : [];

    while (remaining.length > 0) {
      const chunk = remaining.slice(0, PAGE_ROWS);
      remaining = remaining.slice(PAGE_ROWS);
      pages.push(chunk.map((row) => ({ ...row, serial: serial++ })));
    }

    // Check last page room for 3 footer rows
    if (pages.length && pages[pages.length - 1].length >= PAGE_ROWS - 3) {
      pages.push([]); // reserve space for totals
    }

    return pages;
  };

  const leftTablePages = paginateWithFooterCheck(ledgerTableReceiptData);
  const rightTablePages = paginateWithFooterCheck(ledgerTablePaymentData);

  return (
    <div className="w-[297mm] h-full" ref={printRef}>
      {Array.from({
        length: Math.max(leftTablePages.length, rightTablePages.length, 1),
      }).map((_, pageIndex) => {
        const leftPageData = leftTablePages[pageIndex] || [];
        const rightPageData = rightTablePages[pageIndex] || [];

        return (
          <div
            key={pageIndex}
            data-print-page="true"
            className="w-full h-[210mm] flex flex-col text-center py-2 px-1 bg-white overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 text-xs flex flex-col gap-1 uppercase mb-1">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-sm">
                {t("report.cashAccount.cashAccountFrom")} {fromDate}{" "}
                {t("common.to")} {toDate}
              </p>
            </div>

            {/* Two tables side by side */}
            <div className="flex-1 min-h-0 flex flex-col w-full">
              <div className="flex w-full">
              {[leftPageData, rightPageData].map((tableData, tableIndex) => (
                <div key={tableIndex} className="w-1/2">
                  <Table className="w-full border-collapse text-[11px] table-fixed">
                    {((tableIndex === 0 &&
                      pageIndex <= leftTablePages.length - 1) ||
                      leftTablePages.length === 0 ||
                      (tableIndex === 1 &&
                        pageIndex <= rightTablePages.length - 1) ||
                      rightTablePages.length === 0) && (
                      <TableHeader className="[&_tr]:border-b-0">
                        <TableRow className="border-0 hover:bg-transparent">
                          <TableHead
                            rowSpan={2}
                            className="border border-black text-black !h-auto p-1 text-center align-middle w-[36px] font-semibold whitespace-normal"
                          >
                            {t("report.cashAccount.print.vNo")}
                          </TableHead>
                          <TableHead
                            rowSpan={2}
                            className="border border-black text-black !h-auto p-1 text-center align-middle font-semibold whitespace-normal"
                          >
                            {t("report.cashAccount.print.particulars")}
                          </TableHead>
                          <TableHead
                            colSpan={3}
                            className="border border-black text-black !h-[28px] p-1 text-center align-middle font-semibold"
                          >
                            {tableIndex === 0
                              ? t("report.cashAccount.print.receipts")
                              : t("report.cashAccount.print.payments")}
                          </TableHead>
                        </TableRow>
                        <TableRow className="border-0 hover:bg-transparent">
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            {t("report.cashAccount.print.cash")}
                          </TableHead>
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            {t("report.cashAccount.print.transfer")}
                          </TableHead>
                          <TableHead className="border border-black text-black !h-[28px] p-1 text-center align-middle w-[18%] font-semibold">
                            {t("report.cashAccount.print.total")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                    )}
                    <TableBody>
                      {tableData.map((data, index) => (
                        <TableRow
                          key={index}
                          className="border-0 hover:bg-transparent"
                        >
                          <TableCell className="border border-black p-1 text-center align-middle whitespace-normal">
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell className="border border-black px-1 py-1 text-left align-middle whitespace-normal break-words leading-tight">
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-black p-1 text-right align-middle whitespace-nowrap">
                            {data?.Cash}
                          </TableCell>
                          <TableCell className="border border-black p-1 text-right align-middle whitespace-nowrap">
                            {data?.Transfer}
                          </TableCell>
                          <TableCell className="border border-black p-1 text-right align-middle whitespace-nowrap">
                            {data?.Total}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {/* Footer (3 rows) */}
                    <TableFooter className="font-normal bg-white border-0 [&>tr]:border-0">
                      {tableIndex === 0 &&
                      (pageIndex === leftTablePages.length - 1 ||
                        leftTablePages.length === 0) ? (
                        <>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.total")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalCashReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalReceived}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.openingBalance")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {cashBalanceData && cashBalanceData?.Opening}
                            </TableCell>
                            <TableCell className="border border-black p-1"></TableCell>
                            <TableCell className="border border-black p-1"></TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.grandTotal")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalCashReceived) +
                                (cashBalanceData && cashBalanceData.Opening
                                  ? parseFloat(cashBalanceData.Opening)
                                  : 0)}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferReceived}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalReceived) +
                                (cashBalanceData && cashBalanceData.Opening
                                  ? parseFloat(cashBalanceData.Opening)
                                  : 0)}
                            </TableCell>
                          </TableRow>
                        </>
                      ) : tableIndex === 1 &&
                        (pageIndex === rightTablePages.length - 1 ||
                          rightTablePages.length === 0) ? (
                        <>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.total")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalCashPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalPayment}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.closingBalance")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {cashBalanceData && cashBalanceData?.Closing}
                            </TableCell>
                            <TableCell className="border border-black p-1"></TableCell>
                            <TableCell className="border border-black p-1"></TableCell>
                          </TableRow>
                          <TableRow className="bg-white border-0 hover:bg-transparent">
                            <TableCell
                              colSpan={2}
                              className="font-medium border border-black p-1 text-left"
                            >
                              {t("common.grandTotal")}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalCashPayment) +
                                (cashBalanceData && cashBalanceData.Closing
                                  ? parseFloat(cashBalanceData.Closing)
                                  : 0)}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {totalTranferPayment}
                            </TableCell>
                            <TableCell className="border border-black p-1 text-right">
                              {parseFloat(totalPayment) +
                                (cashBalanceData && cashBalanceData.Closing
                                  ? parseFloat(cashBalanceData.Closing)
                                  : 0)}
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <></>
                      )}
                    </TableFooter>
                  </Table>
                </div>
              ))}
              </div>
              {pageIndex ===
                Math.max(leftTablePages.length, rightTablePages.length, 1) -
                  1 && (
                <p className="shrink-0 h-8 border-t border-black w-full text-[11px] flex justify-end items-center px-2 bg-white">
                  {t("report.cashAccount.closingBalanceInWords")}:{" "}
                  {cashBalanceData?.Closing &&
                  parseFloat(cashBalanceData.Closing) > 0
                    ? `${t("common.rupees")} ${convertToWords(
                        Number(cashBalanceData.Closing),
                      )} ${t("common.only")}`
                    : t("common.zero")}
                </p>
              )}
            </div>

            <div className="shrink-0 w-full h-[28px] mt-2 flex items-center justify-between px-2 text-xs">
              <p className="text-nowrap">
                {t("common.generatedBy")} : {userName}
              </p>
              <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
                {t("common.thisReportIsGeneratedByPrioSuite")}
              </p>
              <p className="text-nowrap">
                {t("common.generatedOn")} : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
      <div
        data-print-page="true"
        className="w-full h-[210mm] flex flex-col py-5 bg-white overflow-hidden"
      >
        <div className="flex-1 min-h-0 w-[350px] ml-20">
          <p className="text-[11px] text-center flex items-center justify-center h-[40px]">
            {t("report.cashAccount.physicalDenomination")}
          </p>
          <Table className="w-full border border-black text-[11px]">
            <TableHeader>
              <TableRow className=" text-black  h-[40px] ">
                <TableHead className=" border-black text-black p-0 text-center w-[50px]">
                  {t("report.cashAccount.print.slNo")}
                </TableHead>
                <TableHead className=" border-black text-black p-0 border-x  text-center w-[100px]">
                  {t("report.cashAccount.print.denomination")}
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  {t("report.cashAccount.print.quantity")}
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  {t("report.cashAccount.print.value")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(denomData || []).map((denom, index) => (
                <TableRow key={index} className="h-[40px]">
                  <TableCell className="border border-black p-0 text-center">
                    {index + 1}
                  </TableCell>
                  <TableCell className="border border-black p-0 text-center">
                    {denom.Denom_Label}
                  </TableCell>
                  <TableCell className="border border-black p-0 text-center">
                    {denom.Denom_Balance}
                  </TableCell>
                  <TableCell className="border border-black p-0 text-center">
                    {denom.Denom_Value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-white h-[40px]">
                <TableCell
                  className="border border-black p-0 text-center"
                  colSpan={2}
                >
                  {t("common.total")}
                </TableCell>
                <TableCell className="border border-black p-0 text-center"></TableCell>
                <TableCell className="border border-black p-0 text-center">
                  {(denomData || []).reduce((total, current) => {
                    return total + parseFloat(current.Denom_Value || 0); // Add Denom_Value or 0 if it's undefined or null
                  }, 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="shrink-0 w-full h-[28px] mt-auto flex items-center justify-between px-2 text-xs">
          <p className="text-nowrap">
            {t("common.generatedBy")} : {userName}
          </p>
          <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
            {t("common.thisReportIsGeneratedByPrioSuite")}
          </p>
          <p className="text-nowrap">
            {t("common.generatedOn")} : {currentDate} {currentTime}
          </p>
        </div>
      </div>
    </div>
  );
};
export default PreviewModal;
