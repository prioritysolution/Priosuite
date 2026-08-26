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
import { Fragment, useEffect, useState } from "react";

const PreviewModal = ({
  printRef,
  ledgerTableExpenditureData,
  ledgerTableIncomeData,
  totalExpenditure,
  totalIncome,
  asOnDate,
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

  const PAGE_ROWS = 22;

  const paginateData = (data) => {
    const pages = [];
    let index = 0;

    // First page
    if (data.length > 0) {
      pages.push(data.slice(0, PAGE_ROWS));
      index = PAGE_ROWS;
    }

    // Remaining pages
    while (index < data.length) {
      pages.push(data.slice(index, index + PAGE_ROWS));
      index += PAGE_ROWS;
    }

    return pages;
  };

  const leftTablePages = paginateData(ledgerTableExpenditureData);
  const rightTablePages = paginateData(ledgerTableIncomeData);

  const totalPages = Math.max(leftTablePages.length, rightTablePages.length, 1);

  return (
    <div className="w-[210mm] h-full" ref={printRef}>
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const leftPageData = leftTablePages[pageIndex] || [];
        const rightPageData = rightTablePages[pageIndex] || [];

        const isLeftLastPage = pageIndex === leftTablePages.length - 1;
        const isRightLastPage = pageIndex === rightTablePages.length - 1;

        const leftHasRoomForFooter = leftPageData.length <= PAGE_ROWS - 3;
        const rightHasRoomForFooter = rightPageData.length <= PAGE_ROWS - 3;

        return (
          <div
            key={pageIndex}
            className="w-full h-[297mm] text-center py-2 px-1 relative scale-[.97]"
          >
            {/* Header */}
            <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-sm">PL Appropiation As On {asOnDate}</p>
            </div>

            {/* Two tables side by side */}
            <div className="flex w-full border border-black">
              {[leftPageData, rightPageData].map((tableData, tableIndex) => {
                const isLeft = tableIndex === 0;
                const isLastPage = isLeft ? isLeftLastPage : isRightLastPage;
                const hasRoomForFooter = isLeft
                  ? leftHasRoomForFooter
                  : rightHasRoomForFooter;
                const totalAmount = isLeft ? totalExpenditure : totalIncome;

                return (
                  <div key={tableIndex} className="w-1/2">
                    <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
                      {(pageIndex === 0 || tableData.length > 0) && (
                        <TableHeader>
                          <TableRow className="h-[40px]">
                            <TableHead className="text-black border-black p-0 text-center h-[40px]">
                              {isLeft ? "EXPENDITURE" : "INCOME"}
                            </TableHead>
                            <TableHead className="text-black border-black p-0 border-l text-center w-[120px] h-[40px]">
                              AMOUNT
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      )}
                      <TableBody>
                        {tableData.map((data, index) => (
                          <Fragment key={index}>
                            {data?.Heading_Name && (
                              <TableRow className="h-[40px]">
                                <TableCell className="font-semibold  border border-black text-start  p-0 pl-1">
                                  {data?.Heading_Name}
                                </TableCell>
                                <TableCell className=" border border-black text-right p-0 pr-[2px]">
                                  {data?.Amount}
                                </TableCell>
                              </TableRow>
                            )}
                            {data?.Ledger_Name && (
                              <TableRow className="h-[40px]">
                                <TableCell className="border border-black text-start p-0 pl-5">
                                  {data?.Ledger_Name}
                                </TableCell>
                                <TableCell className="border border-black text-right p-0 pr-[2px]">
                                  {data?.Amount}
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </TableBody>

                      {/* Conditionally render Grand Total on last page only if space allows */}
                      {isLastPage && hasRoomForFooter && (
                        <TableFooter className="font-normal">
                          <TableRow className="bg-white h-[40px]">
                            <TableCell className="font-medium border border-black text-center p-0">
                              Grand Total
                            </TableCell>
                            <TableCell className="border border-black text-right p-0 pr-[2px]">
                              {totalAmount?.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      )}
                    </Table>
                  </div>
                );
              })}
            </div>

            {/* Footer: generated by info */}
            <div className="w-full h-[40px] absolute bottom-2 left-0 flex items-end pb-1 justify-between px-2 text-xs">
              <p className="text-nowrap">Generated By : {userName}</p>
              <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
                This report is generated by PrioSuite.
              </p>
              <p className="text-nowrap">
                Generated On : {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreviewModal;
