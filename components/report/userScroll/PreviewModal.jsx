"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import { Fragment, useEffect, useState } from "react";

const PreviewModal = ({ printRef, reportData, asOnDate }) => {
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

  const PAGE_ROWS = 23;

  const paginateGroupedDataWithFooter = (reportData) => {
    const pages = [];
    let currentPage = [];
    let currentRowCount = 0;

    const allRows = [];

    // Aggregate data into allRows
    reportData.forEach((group) => {
      allRows.push({ type: "glName", name: group?.Ledger_Name || "" });

      group?.entries.forEach((entry) => {
        allRows.push({
          type: "entries",
          data: entry,
        });
      });

      if (group?.entries?.length > 0) {
        allRows.push({
          type: "subTotal",
          subTotalReceive: group?.entries?.reduce(
            (acc, entry) => acc + (Number(entry?.Rec_Cash) || 0),
            0,
          ),
          subTotalPayment: group?.entries?.reduce(
            (acc, entry) => acc + (Number(entry?.Pay_Cash) || 0),
            0,
          ),
        });
      }
    });

    // Iterate through allRows and distribute across pages
    allRows.forEach((row) => {
      if (currentRowCount >= PAGE_ROWS) {
        pages.push(currentPage);
        currentPage = [];
        currentRowCount = 0;
      }

      currentPage.push(row);
      currentRowCount++;
    });

    // Add the grand total row to the last page
    const grandTotalRow = {
      type: "grandTotal",
      grandTotalReceive: reportData
        .flatMap((data) => data.entries)
        .reduce((acc, entry) => acc + (Number(entry?.Rec_Cash) || 0), 0),
      grandTotalPayment: reportData
        .flatMap((data) => data.entries)
        .reduce((acc, entry) => acc + (Number(entry?.Pay_Cash) || 0), 0),
    };

    if (currentRowCount >= PAGE_ROWS) {
      pages.push(currentPage);
      currentPage = [grandTotalRow];
    } else {
      currentPage.push(grandTotalRow);
    }

    pages.push(currentPage); // Final push for the last page

    return pages;
  };

  const reportPages = paginateGroupedDataWithFooter(reportData || []);

  const renderTable = (pageData) => {
    let slNo = 1;

    return (
      <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
        {pageData.length > 0 && (
          <TableHeader>
            <TableRow className="h-[60px]">
              <TableHead className="p-0 text-sm text-center text-black border-black w-[40px]">
                SL. NO.
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[80px]">
                REF. VOUCH.
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[80px]">
                VOUCH. NO.
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black">
                PARTICULARS
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[120px]">
                RECEIPT
              </TableHead>
              <TableHead className="p-0 text-sm text-center text-black border-l border-black w-[120px]">
                PAYMENT
              </TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {pageData.map((row, index) => {
            switch (row.type) {
              case "glName":
                slNo = 1; // ✅ Reset SL. NO. when GL group changes
                return (
                  <TableRow
                    key={`glName-${index}`}
                    className="h-[40px] w-full border border-black"
                  >
                    <TableCell
                      colSpan={6}
                      className="font-semibold text-sm border p-0 border-black w-full pl-5 text-start "
                    >
                      {row.name || ""}
                    </TableCell>
                  </TableRow>
                );

              case "entries":
                const currentSL = slNo++; // ✅ Use and increment SL. NO. for each entry
                return (
                  <Fragment key={`entry-${index}`}>
                    <TableRow className="h-[40px] border border-black">
                      <TableCell className="p-0 border border-black text-center">
                        {currentSL}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Vouch_No}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Vouch_No}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Particulars}
                      </TableCell>
                      <TableCell className="p-0 pr-1 border border-black text-right">
                        {row.data.Rec_Cash || ""}
                      </TableCell>
                      <TableCell className="p-0 pr-1 border border-black text-right">
                        {row.data.Pay_Cash || ""}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );

              case "subTotal":
                return (
                  <TableRow className="h-[40px] border-black">
                    <TableCell colSpan={4} className="p-0 border border-black">
                      Total
                    </TableCell>
                    <TableCell className="border p-0 pr-1 border-black text-right">
                      {row.subTotalReceive
                        ? row.subTotalReceive.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="border p-0 pr-1 border-black text-right">
                      {row.subTotalPayment
                        ? row.subTotalPayment.toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                );

              case "grandTotal":
                return (
                  <TableRow
                    key={`grandTotal-${index}`}
                    className="h-[40px] bg-white border-black"
                  >
                    <TableCell
                      colSpan={4}
                      className="font-semibold p-0 border border-black text-center"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold p-0 pr-1 border border-black text-right">
                      {row?.grandTotalReceive
                        ? row?.grandTotalReceive?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 pr-1 border border-black text-right">
                      {row?.grandTotalPayment
                        ? row?.grandTotalPayment?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                );

              default:
                return null;
            }
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <div
      ref={printRef}
      className="w-[210mm] print:max-w-none print:w-full print:text-black"
    >
      {reportPages.map((reportPage, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="w-full h-[297mm] flex flex-col text-center py-2 px-1 print:break-after-page scale-[.97]"
        >
          {/* HEADER - SHOW ON EVERY PAGE */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">User Scroll As On {asOnDate}</p>
          </div>

          {/* TABLE */}
          <div className="flex-1">{renderTable(reportPage)}</div>

          {/* FOOTER */}
          <div className="w-full h-[40px] flex items-end justify-between text-xs relative">
            <p>Generated By : {userName}</p>
            <p className="italic text-gray-600 text-center w-full absolute  left-1/2 -translate-x-1/2">
              This report is generated by PrioSuite.
            </p>
            <p>
              Generated On : {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewModal;
