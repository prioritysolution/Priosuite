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

const PAGE_ROWS = 20;

const chunkPagesWithFooterLogic = (rows) => {
  const pages = [];
  let currentPage = [];
  let maxRows = PAGE_ROWS;
  let count = 0;

  rows?.forEach((row) => {
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

const InvestmentLedgerPreview = ({
  printRef,
  fromDate,
  toDate,
  totalWithdrawn,
  totalDeposit,
  ledgerHeaderData,
  ledgerTableData,
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

  const pages = chunkPagesWithFooterLogic(ledgerTableData);

  let globalSerialNo = 1;

  return (
    <div className="w-[220mm]" ref={printRef}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Custom styled scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb {
          background: #000000;
          border-radius: 9999px;
          border: 2px solid #f1f5f9;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #1a1a1a;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #000000 #f1f5f9;
        }
      `,
        }}
      />
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          className="w-full h-[297mm] text-center py-2 px-1 flex flex-col justify-between scale-[.97]"
        >
          {/* Org Header Only on First Page */}
          <div className="text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              Investment Ledger From{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          <div className="h-[120px] w-full border border-black my-1 px-2 py-1 grid grid-cols-3 gap-1 text-xs text-start">
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Investment Type : </p>
              <p>{ledgerHeaderData?.Invest_Type || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Account Type : </p>
              <p>
                {ledgerHeaderData?.Account_Type ||
                  ledgerHeaderData?.Account_type ||
                  ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Bank Name : </p>
              <p>{ledgerHeaderData?.Bank_Name || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Account No. : </p>
              <p>{ledgerHeaderData?.Account_No || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Opening Date : </p>
              <p>
                {ledgerHeaderData?.Open_Date
                  ? format(ledgerHeaderData?.Open_Date, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Investment Amount : </p>
              <p>{ledgerHeaderData?.Invest_Amt || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">No. of Installment : </p>
              <p>{ledgerHeaderData?.No_Installment || "0"}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Duration : </p>
              <p>{ledgerHeaderData?.Duration || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">ROI : </p>
              <p>{ledgerHeaderData?.Roi || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Maturity Date : </p>
              <p>
                {ledgerHeaderData?.Mature_Date
                  ? format(ledgerHeaderData?.Mature_Date, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">Maturity Amount : </p>
              <p>{ledgerHeaderData?.Mature_Val || ""}</p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="h-[50px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[40px]">
                    SL. NO.
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    DATE
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">
                    PARTICULAR
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    WITHDRAWN
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    DEPOSIT
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
                      {globalSerialNo++}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Trans_Date && format(row?.Trans_Date, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell className="border border-black p-0 text-center">
                      {row?.Particular}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Withdrwan}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Deposit}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Balance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* Only show total on last page */}
              {pageIndex === pages.length - 1 && (
                <TableFooter>
                  <TableRow className="bg-white h-[40px]">
                    <TableCell
                      colSpan={3}
                      className="border border-black p-0 text-center"
                    >
                      Total
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalWithdrawn?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalDeposit?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black"></TableCell>
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

export default InvestmentLedgerPreview;
