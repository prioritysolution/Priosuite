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
import { formatDate } from "date-fns";

const PAGE_ROWS = 22;

const chunkPages = (flatRows) => {
  const pages = [];
  let currentPage = [];
  let count = 0;

  flatRows.forEach((row) => {
    if (count === PAGE_ROWS) {
      pages.push(currentPage);
      currentPage = [];
      count = 0;
    }
    currentPage.push(row);
    count++;
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  // ✅ If last page is full (22 rows), add a new empty page for total
  if (pages.length && pages[pages.length - 1].length === PAGE_ROWS) {
    pages.push([]); // reserve space for totals
  }

  return pages;
};

const PreviewModal = ({
  printRef,
  ledgerTableData,
  fromDate,
  toDate,
  totalDebit,
  totalCredit,
  ledgerData,
  ledgerId,
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

  const pages = chunkPages(ledgerTableData || []);

  return (
    <div className="w-[210mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          data-print-page="true"
          className="w-full h-[297mm] py-2 px-1 text-center flex flex-col justify-between bg-white overflow-hidden print:break-after-page"
        >
          {/* Org Header Only on First Page */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {
                ledgerData?.find((data) => data?.Id?.toString() === ledgerId)
                  ?.Ledger_Name
              }
            </p>

            <p className="text-sm">
              Ledger From {fromDate} To {toDate}
            </p>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
              <TableHeader>
                <TableRow className="h-[60px]">
                  <TableHead className="text-black p-0 border-black text-center w-[40px]">
                    SL. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    TRANS. DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    VOUCHER NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    NARRATION
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    DEBIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    CREDIT
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    BALANCE
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) => (
                  <TableRow key={index} className="bg-white h-[40px]">
                    <TableCell className="border border-black p-0 text-center">
                      {pageIndex * PAGE_ROWS + index + 1}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Trans_Date &&
                        formatDate(row?.Trans_Date, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Vouch_No}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Particular}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Debit}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Credit}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Balance} {row?.Balance_Type}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className="font-normal">
                {pageIndex === pages.length - 1 && (
                  <TableRow className="bg-white h-[40px]">
                    <TableCell
                      colSpan={4}
                      className="font-medium text-center border p-0 border-black"
                    >
                      Total
                    </TableCell>
                    <TableCell className="text-black border-black text-right border p-0 pr-[2px]">
                      {totalDebit?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-black border-black text-right border p-0 pr-[2px]">
                      {totalCredit?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0" />
                  </TableRow>
                )}
              </TableFooter>
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

export default PreviewModal;
