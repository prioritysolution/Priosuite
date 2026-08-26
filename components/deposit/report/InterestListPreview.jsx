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

const PAGE_ROWS = 17;

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

const InterestListPreview = ({
  printRef,
  tableData,
  totalAmount,
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
    <div className="w-[210mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1;
        const isLastPageWithData = pageRows.length > 0 && isLastPage;
        const isExtraPageForTotal =
          pageRows.length === 0 && isLastPage && pages.length > 1;

        return (
          <div
            key={pageIndex}
            className="w-full h-[297mm] border border-black py-2 px-2 mb-4 flex flex-col justify-between"
          >
            {/* Org Header Only on First Page */}
            <div className="text-sm flex flex-col h-[120px] text-center justify-between uppercase mb-2">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-lg">
                Interest Ledger From{" "}
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
                    <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                      DATE
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[160px]">
                      CUSTOMER NAME
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                      ACCOUNT NO.
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                      REF. AC. NO.
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center">
                      L/F. NO.
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                      AMOUNT
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[180px]">
                      NARRATION
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
                        {row?.Adm_Date && format(row?.Adm_Date, "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Member_Type}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Full_Name}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Relation_Name}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Village}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Ledg_Folio}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Adm_Fees}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {/* Only show total on last page */}
                {(isLastPageWithData || isExtraPageForTotal) && (
                  <TableFooter>
                    <TableRow className="bg-white h-[50px]">
                      <TableCell
                        colSpan={7}
                        className="border border-black p-0 text-center"
                      >
                        Total
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {totalAmount?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>

            {/* Footer */}
            <div className="w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
              <p className="text-nowrap">Generated By: {userName}</p>
              <p className="absolute left-[50%] translate-x-[-50%] top-0 italic text-gray-600 text-nowrap">
                This is a computer-generated report and does not require a
                signature.
              </p>
              <p className="text-nowrap">
                Generated On: {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InterestListPreview;
