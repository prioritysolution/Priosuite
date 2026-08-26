import React, { useEffect, useState } from "react";
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
import { format } from "date-fns";

const PAGE_ROWS = 11;

const chunkPagesWithFooterLogic = (rows) => {
  const pages = [];
  let currentPage = [];
  let maxRows = PAGE_ROWS;
  let count = 0;

  rows.forEach((row) => {
    if (count === maxRows) {
      pages.push(currentPage);
      currentPage = [];
      count = 0;
    }
    currentPage.push(row);
    count++;
  });

  if (currentPage.length === maxRows) {
    // Last page is full, move total row to new page
    pages.push(currentPage);
    pages.push([]); // New page for total
  } else {
    pages.push(currentPage); // Last page has room for total
  }

  return pages;
};

const DetailedListPreview = ({
  printRef,
  tableData,
  totalOpening,
  totalDeposit,
  totalWithdrawn,
  totalClosing,
  totalPaidIntt,
  totalDueIntt,
  fromDate,
  toDate,
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

  const pages = chunkPagesWithFooterLogic(tableData);

  let globalSerialNo = 1;

  return (
    <div className="w-[297mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          className="w-full h-[210mm] text-center py-2 px-1 flex flex-col justify-between scale-[.98]"
        >
          {/* Org Header Only on First Page */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              Account Detailed List From{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px]">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="h-[60px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[40px]">
                    SL. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    CUSTOMER NAME
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    GUARDIAN NAME
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[50px]">
                    ACC. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[40px]">
                    REF. AC. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center ">
                    L/F. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[70px]">
                    OPENING DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[40px]">
                    ROI.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[70px]">
                    MATURITY DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    OPENING
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    DEPOSIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    WITHDRAWN
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    CLOSING
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    PAID INTT.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    DUE INTT.
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) => (
                  <TableRow key={index} className="bg-white h-[50px]">
                    <TableCell className="border border-black p-0 text-center">
                      {globalSerialNo++}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Full_Name}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Relation_Name}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Account_No}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Ref_Ac_No}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Ledg_Folio}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Opening_Date &&
                        format(row?.Opening_Date, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.ROI}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Maturity_Date &&
                        format(row?.Maturity_Date, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {row?.Opening}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {row?.Deposit}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {row?.Withdrwan}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {row?.Closing}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {row?.Paid_Intt}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {row?.Due_Intt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* Only show total on last page */}
              {pageIndex === pages.length - 1 && (
                <TableFooter>
                  <TableRow className="bg-white h-[50px]">
                    <TableCell
                      colSpan={9}
                      className="border border-black p-0 text-center"
                    >
                      Total
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {totalOpening?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {totalDeposit?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {totalWithdrawn?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {totalClosing?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {totalPaidIntt?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-right pr-[2px]">
                      {totalDueIntt?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>

          {/* Footer */}
          <div className="w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
            <p className="text-nowrap">Generated By: {userName}</p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
              This report is generated by PrioSuite.
            </p>
            <p className="text-nowrap">
              Generated On: {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedListPreview;
