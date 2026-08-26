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
  totalReceived,
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
    let remaining = [...data];

    while (remaining.length > 0) {
      const chunk = remaining.slice(0, PAGE_ROWS);
      remaining = remaining.slice(PAGE_ROWS);
      pages.push(chunk.map((row) => ({ ...row, serial: serial++ })));
    }

    // Check last page room for 3 footer rows
    if (pages.length && pages[pages.length - 1].length >= PAGE_ROWS - 2) {
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
            className="w-full h-[210mm] text-center py-2 relative px-1 scale-[.98]"
          >
            {/* Header */}
            <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-sm">Cashbook As On {toDate}</p>
            </div>

            {/* Two tables side by side */}
            <div className="flex w-full border border-black">
              {[leftPageData, rightPageData].map((tableData, tableIndex) => (
                <div key={tableIndex} className="w-1/2 ">
                  <Table className="w-full  text-[11px] overflow-hidden">
                    {((tableIndex === 0 &&
                      pageIndex <= leftTablePages.length - 1) ||
                      leftTablePages.length === 0 ||
                      (tableIndex === 1 &&
                        pageIndex <= rightTablePages.length - 1) ||
                      rightTablePages.length === 0) && (
                      <TableHeader>
                        <TableRow className="h-[40px]">
                          <TableHead
                            colSpan={5}
                            className="border border-black text-black p-0 text-center w-full h-[40px]"
                          >
                            {tableIndex === 0 ? "RECEIPT" : "PAYMENT"}
                          </TableHead>
                        </TableRow>
                        <TableRow className="  h-[40px] border border-black">
                          <TableHead className=" border-black text-black p-0 text-center h-[40px] w-[30px]">
                            SL.
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[80px]">
                            Vouch No.
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[120px]">
                            Ledger Name
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px]">
                            PARTICULARS
                          </TableHead>
                          <TableHead className=" border-black text-black p-0 border-l text-center h-[40px] w-[100px]">
                            AMOUNT
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                    )}
                    <TableBody>
                      {tableData.map((data, index) => (
                        <TableRow key={index} className="h-[40px]">
                          <TableCell className="border border-black text-center p-0 h-[40px]">
                            {index + 1}
                          </TableCell>
                          <TableCell className="border border-black text-center p-0 h-[40px]">
                            {data?.Vouch_No}
                          </TableCell>
                          <TableCell className="border border-black text-center p-0 h-[40px]">
                            {data?.Ledger_Name}
                          </TableCell>
                          <TableCell className="border border-black text-center p-0 h-[40px]">
                            {data?.Particular}
                          </TableCell>
                          <TableCell className="border border-black text-right p-0 pr-[2px] h-[40px]">
                            {data?.Cash}
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
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              Total
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {totalReceived?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              Opening Balance
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {cashBalanceData &&
                                cashBalanceData?.Opening &&
                                Number(cashBalanceData?.Opening)?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </>
                      ) : tableIndex === 1 &&
                        (pageIndex === rightTablePages.length - 1 ||
                          rightTablePages.length === 0) ? (
                        <>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              Total
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {totalPayment?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-white  h-[40px]">
                            <TableCell
                              colSpan={4}
                              className="font-medium border border-black text-center p-0"
                            >
                              Closing Balance
                            </TableCell>
                            <TableCell className=" border border-black text-right p-0 pr-[2px]">
                              {cashBalanceData &&
                                cashBalanceData?.Closing &&
                                Number(cashBalanceData?.Closing)?.toFixed(2)}
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
              <p className="h-8 border border-t-0 border-black w-full text-[11px] flex self-end justify-end items-center px-2">
                Closing Balance In Words:{" "}
                {cashBalanceData?.Closing &&
                parseFloat(cashBalanceData.Closing) > 0
                  ? `Rupees ${convertToWords(
                      Number(cashBalanceData.Closing),
                    )} Only`
                  : "Zero"}
              </p>
            )}
            <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
              <p className="text-nowrap">Generated By : {userName}</p>
              <p className=" italic text-gray-600 text-nowrap">
                This report is generated by PrioSuite.
              </p>
              <p className="text-nowrap">
                Generated On : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
      <div className="w-full h-[210mm] relative py-5 scale-[.98]">
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
              {denomData.map((denom, index) => (
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
                  {denomData.reduce((total, current) => {
                    return total + parseFloat(current.Denom_Value || 0); // Add Denom_Value or 0 if it's undefined or null
                  }, 0)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className=" w-full h-[30px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
          <p className="text-nowrap">Generated By : {userName}</p>
          <p className=" italic text-gray-600 text-nowrap">
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
