"use client";

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
  toDate,
  totalCashReceived,
  totalTranferReceived,
  totalReceived,
  totalCashPayment,
  totalTranferPayment,
  totalPayment,
  cashBalanceData,
}) => {
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

  const PAGE_ROWS = 14;

  const paginateWithFooterCheck = (data) => {
    const pages = [];
    let serial = 1;
    let remaining = Array.isArray(data) ? [...data] : [];

    while (remaining.length > 0) {
      const chunk = remaining.slice(0, PAGE_ROWS);
      remaining = remaining.slice(PAGE_ROWS);
      pages.push(chunk.map((row) => ({ ...row, serial: serial++ })));
    }

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
            className="w-full h-[210mm] text-center py-2 px-1 relative bg-white"
          >
            {/* Header */}
            <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-sm">Daybook As On {toDate}</p>
            </div>

            {/* Table wrapper containing tables and footer wordings */}
            <div className="w-full border border-black flex flex-col">
              <div className="flex w-full">
                {[leftPageData, rightPageData].map((tableData, tableIndex) => (
                  <div key={tableIndex} className="w-1/2">
                    <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
                      {((tableIndex === 0 &&
                        pageIndex <= leftTablePages.length - 1) ||
                        leftTablePages.length === 0 ||
                        (tableIndex === 1 &&
                          pageIndex <= rightTablePages.length - 1) ||
                        rightTablePages.length === 0) && (
                        <TableHeader>
                          <TableRow className=" h-[40px] ">
                            <TableHead
                              rowSpan={2}
                              className="border border-black  text-black p-0 text-center w-[30px]"
                            >
                              V. NO.
                            </TableHead>
                            <TableHead
                              rowSpan={2}
                              className="border border-black  text-black p-0 border-x  text-center"
                            >
                              PARTICULARS
                            </TableHead>

                            <TableHead
                              colSpan={3}
                              className="  border-l text-black p-0 text-center h-[40px]"
                            >
                              {tableIndex === 0 ? "RECEIPTS" : "PAYMENTS"}
                            </TableHead>
                          </TableRow>
                          <TableRow className="h-[40px]">
                            <TableHead className="border border-black text-black p-0 text-center w-[100px] h-[40px]">
                              CASH
                            </TableHead>
                            <TableHead className="border border-black text-black  p-0 border-l text-center w-[100px] h-[40px]">
                              TRANSFER
                            </TableHead>
                            <TableHead className="border border-black text-black p-0 border-l text-center w-[100px] h-[40px]">
                              TOTAL
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      )}
                      <TableBody>
                        {tableData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="border border-black px-1 py-3 text-center">
                              {data?.Vouch_No}
                            </TableCell>
                            <TableCell className="border border-black px-2 py-3 text-left">
                              {data?.Particular}
                            </TableCell>
                            <TableCell className="border border-black px-1 py-3 text-right">
                              {data?.Cash}
                            </TableCell>
                            <TableCell className="border border-black px-1 py-3 text-right">
                              {data?.Transfer}
                            </TableCell>
                            <TableCell className="border border-black px-1 py-3 text-right">
                              {data?.Total?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      {/* Footer (3 rows) */}

                      <TableFooter className="font-normal">
                        {tableIndex === 0 &&
                        (pageIndex === leftTablePages.length - 1 ||
                          leftTablePages.length === 0) ? (
                          <>
                            <TableRow className="bg-white h-[40px]">
                              <TableCell
                                colSpan={2}
                                className="font-medium border border-black p-0"
                              >
                                Total
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalCashReceived?.toFixed(2)}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalTranferReceived?.toFixed(2)}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalReceived?.toFixed(2)}
                              </TableCell>
                            </TableRow>
                            <TableRow className="bg-white h-[40px]">
                              <TableCell
                                colSpan={2}
                                className="font-medium border border-black p-0"
                              >
                                Opening Balance
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {cashBalanceData?.Opening
                                  ? Number(cashBalanceData?.Opening).toFixed(2)
                                  : "0.00"}
                              </TableCell>
                              <TableCell className="border border-black p-0"></TableCell>
                              <TableCell className="border border-black p-0"></TableCell>
                            </TableRow>
                            <TableRow className="bg-white h-[40px]">
                              <TableCell
                                colSpan={2}
                                className="font-medium border border-black p-0"
                              >
                                Grand Total
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {(
                                  parseFloat(totalCashReceived || 0) +
                                  parseFloat(cashBalanceData?.Opening || 0)
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalTranferReceived}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {(
                                  parseFloat(totalReceived || 0) +
                                  parseFloat(cashBalanceData?.Opening || 0)
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </>
                        ) : tableIndex === 1 &&
                          (pageIndex === rightTablePages.length - 1 ||
                            rightTablePages.length === 0) ? (
                          <>
                            <TableRow className="bg-white h-[40px]">
                              <TableCell
                                colSpan={2}
                                className="font-medium border border-black p-0"
                              >
                                Total
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalCashPayment?.toFixed(2)}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalTranferPayment?.toFixed(2)}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalPayment?.toFixed(2)}
                              </TableCell>
                            </TableRow>
                            <TableRow className="bg-white h-[40px]">
                              <TableCell
                                colSpan={2}
                                className="font-medium border border-black p-0"
                              >
                                Closing Balance
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {cashBalanceData?.Closing
                                  ? Number(cashBalanceData?.Closing).toFixed(2)
                                  : "0.00"}
                              </TableCell>
                              <TableCell className="border border-black p-0"></TableCell>
                              <TableCell className="border border-black p-0"></TableCell>
                            </TableRow>
                            <TableRow className="bg-white h-[40px]">
                              <TableCell
                                colSpan={2}
                                className="font-medium border border-black p-0"
                              >
                                Grand Total
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {(
                                  parseFloat(totalCashPayment || 0) +
                                  parseFloat(cashBalanceData?.Closing || 0)
                                ).toFixed(2)}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {totalTranferPayment}
                              </TableCell>
                              <TableCell className="border border-black p-0 pr-[2px] text-right">
                                {(
                                  parseFloat(totalPayment || 0) +
                                  parseFloat(cashBalanceData?.Closing || 0)
                                ).toFixed(2)}
                              </TableCell>
                            </TableRow>
                          </>
                        ) : null}
                      </TableFooter>
                    </Table>
                  </div>
                ))}
              </div>
              {pageIndex ===
                Math.max(leftTablePages.length, rightTablePages.length, 1) -
                  1 && (
                <p className="h-8 border-t border-black w-full text-[11px] flex justify-end items-center px-2 bg-white">
                  Closing Balance In Words:{" "}
                  {cashBalanceData?.Closing &&
                  parseFloat(cashBalanceData.Closing) > 0
                    ? `Rupees ${convertToWords(
                        Number(cashBalanceData.Closing),
                      )} Only`
                    : "Zero"}
                </p>
              )}
            </div>
            <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
              <p className="text-nowrap">Generated By : {userName}</p>
              <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
                This report is generated by PrioSuite.
              </p>
              <p className="text-nowrap">
                Generated On : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
      <div
        data-print-page="true"
        className="w-full h-[210mm] relative pt-5 bg-white"
      >
        <div className="w-[350px] ml-20">
          <p className="text-[11px] text-center flex items-center justify-center h-[40px]">
            Physical Denomination
          </p>
          <Table className="w-full border border-black text-[11px]">
            <TableHeader>
              <TableRow className=" text-black  h-[40px] ">
                <TableHead className=" border-black text-black p-0 text-center w-[50px]">
                  Sl. NO.
                </TableHead>
                <TableHead className=" border-black text-black p-0 border-x  text-center w-[100px]">
                  Denomination
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  Quantity
                </TableHead>
                <TableHead className=" border-black  border-l text-black p-0 text-center w-[100px]">
                  Value
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
                  Total
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
        <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
          <p className="text-nowrap">Generated By : {userName}</p>
          <p className="italic text-nowrap" style={{ color: "#4b5563" }}>
            This report is generated by PrioSuite.
          </p>
          <p className="text-nowrap">
            Generated On : {currentDate} {currentTime}
          </p>
        </div>
      </div>
    </div>
  );
};
export default PreviewModal;
