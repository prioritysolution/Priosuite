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

const PreviewModal = ({
  printRef,
  ledgerLiablitiesTableData,
  ledgerAssetsTableData,
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

  const PAGE_ROWS = 21;

  const paginateGroupedDataWithFooter = (groupedData, grandTotal) => {
    const pages = [];
    let currentPage = [];
    let currentRowCount = 0;

    const allRows = [];

    // Aggregate data into allRows
    groupedData.forEach((group) => {
      const validTxns = group.transactions.filter(
        (txn) => txn?.Ledger_Id !== null,
      );

      allRows.push({ type: "group", data: group });

      validTxns.forEach((txn) => {
        allRows.push({
          type: "txn",
          data: txn,
        });
      });

      if (validTxns.length > 0) {
        allRows.push({
          type: "subTotal",
          subTotalClosing: group.subtotalClosing,
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
      grandTotalOpening: grandTotal?.grandTotalOpening,
      grandTotalDebit: grandTotal?.grandTotalDebit,
      grandTotalCredit: grandTotal?.grandTotalCredit,
      grandTotalClosing: grandTotal?.grandTotalClosing,
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

  const liablitiesPages = paginateGroupedDataWithFooter(
    ledgerLiablitiesTableData?.groupedData || [],
    ledgerLiablitiesTableData?.grandTotals || null,
  );

  const assetsPages = paginateGroupedDataWithFooter(
    ledgerAssetsTableData?.groupedData || [],
    ledgerAssetsTableData?.grandTotals || null,
  );

  const renderTable = (pageData, title) => (
    <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
      {pageData.length > 0 && (
        <TableHeader>
          <TableRow className="h-[40px] border border-black">
            <TableHead
              colSpan={6}
              className="p-0 h-[40px] text-sm text-center text-black border border-black"
            >
              {title}
            </TableHead>
          </TableRow>
          <TableRow className="h-[40px]">
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-black w-[200px]"
            >
              Head Of Account
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              Opening Balance
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              Total Debit
            </TableHead>
            <TableHead
              rowSpan={2}
              className="p-0 text-sm text-center text-black border-l border-black w-[100px]"
            >
              Total Credit
            </TableHead>
            <TableHead
              colSpan={2}
              className="p-0 h-[40px] text-sm text-center text-black border-l border-black w-[200px]"
            >
              Closing
            </TableHead>
          </TableRow>
          <TableRow className="h-[40px]">
            <TableHead className="p-0 h-[40px] text-sm text-center text-black border border-black w-[100px]">
              Break Up
            </TableHead>
            <TableHead className="p-0 h-[40px] text-sm text-center text-black border border-black w-[100px]">
              Balance
            </TableHead>
          </TableRow>
        </TableHeader>
      )}
      <TableBody>
        {pageData.map((row, index) => {
          switch (row.type) {
            case "group":
              return (
                <TableRow
                  key={`group-${index}`}
                  className="h-[40px] w-full border border-black"
                >
                  <TableCell
                    colSpan={6}
                    className="font-semibold text-sm border p-0 border-black w-full pl-5 text-start "
                  >
                    {row.data.headName}
                  </TableCell>
                </TableRow>
              );
            case "txn":
              return (
                <Fragment key={`txn-${index}`}>
                  <TableRow className="h-[40px] border border-black">
                    <TableCell className="p-0 border border-black text-center">
                      {row.data.Ledgare_Name}
                    </TableCell>
                    <TableCell className="p-0 border border-black text-center">
                      {row.data.Opening
                        ? parseFloat(row.data.Opening).toFixed(2)
                        : ""}{" "}
                      {row.data.Opening_Type}
                    </TableCell>
                    <TableCell className="p-0 border border-black text-center">
                      {row.data.Debit
                        ? parseFloat(row.data.Debit).toFixed(2)
                        : ""}
                    </TableCell>
                    <TableCell className="p-0 border border-black text-center">
                      {row.data.Credit
                        ? parseFloat(row.data.Credit).toFixed(2)
                        : ""}
                    </TableCell>
                    <TableCell className="p-0 border border-black text-center">
                      {row.data.Closing
                        ? parseFloat(row.data.Closing).toFixed(2)
                        : ""}{" "}
                      {row.data.Closing_Type}
                    </TableCell>
                    <TableCell className="p-0 border border-black text-center"></TableCell>
                  </TableRow>
                </Fragment>
              );
            case "subTotal":
              return (
                <TableRow className="h-[40px] border-t-2 border-dashed border-black">
                  <TableCell
                    colSpan={5}
                    className="border border-black"
                  ></TableCell>
                  <TableCell className="border p-0 border-black text-center">
                    {row.subTotalClosing ? row.subTotalClosing.toFixed(2) : ""}
                  </TableCell>
                </TableRow>
              );
            case "grandTotal":
              return (
                <TableRow
                  key={`grandTotal-${index}`}
                  className="h-[40px] bg-white border-black"
                >
                  <TableCell className="font-semibold p-0 border border-black text-center">
                    Grand Total
                  </TableCell>
                  <TableCell className="font-semibold p-0 border border-black text-center">
                    {row?.grandTotalOpening
                      ? Number(row?.grandTotalOpening)?.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell className="font-semibold p-0 border border-black text-center">
                    {row?.grandTotalDebit
                      ? Number(row?.grandTotalDebit)?.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell className="font-semibold p-0 border border-black text-center">
                    {row?.grandTotalCredit
                      ? Number(row?.grandTotalCredit)?.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell className="font-semibold p-0  border border-black text-center"></TableCell>
                  <TableCell className="font-semibold p-0  border border-black text-center">
                    {row?.grandTotalClosing
                      ? Number(row?.grandTotalClosing)?.toFixed(2)
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

  return (
    <div
      ref={printRef}
      className="w-[210mm] print:max-w-none print:w-full print:text-black"
    >
      {/* Liabilities Pages */}
      {liablitiesPages.map((liabilitiesPage, pageIndex) => (
        <div
          key={`liabilities-page-${pageIndex}`}
          className="w-full h-[297mm] flex flex-col text-center py-2 px-1 print:break-after-page scale-[.97]"
        >
          {/* HEADER - SHOW ON EVERY PAGE */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              Trail Balance From {fromDate} To {toDate}
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1">
            {renderTable(liabilitiesPage, "Liabilities & Income")}
          </div>

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

      {assetsPages.map((assetsPage, pageIndex) => (
        <div
          key={`assets-page-${pageIndex}`}
          className="w-full h-[297mm] flex flex-col py-2 px-4 print:break-after-page page-break"
        >
          <div className="flex-1">
            {/* Header */}
            <div className="text-sm text-center flex flex-col h-[120px] justify-between uppercase">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
              <p className="text-lg">
                Trial Balance From {fromDate} To {toDate}
              </p>
            </div>

            {renderTable(assetsPage, "Assets & Expenses")}
          </div>

          {/* Footer */}
          <div className="w-full h-[40px] flex items-end justify-between text-xs relative">
            <p>Generated By : {userName}</p>
            <p className="italic text-gray-600 text-center w-full absolute left-1/2 -translate-x-1/2">
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
