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
import { useEffect, useState } from "react";

const PreviewModal = ({
  printRef,
  ledgerTableLiablitiesData,
  ledgerTableAssetsData,
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

  const PAGE_ROWS = 15;

  const paginateGroupedDataWithFooter = (groupedData, totalAmount) => {
    const pages = [];
    let currentPage = [];
    let currentRowCount = 0;

    const allRows = [];

    groupedData.forEach((group) => {
      const validTxns = group.transactions.filter(
        (txn) => txn?.Ledger_Id !== null,
      );
      allRows.push({ type: "group", data: group });

      if (validTxns.length > 0) {
        validTxns.forEach((txn) => {
          allRows.push({ type: "txn", data: txn });
        });
      }
    });

    allRows.forEach((row) => {
      const limit = PAGE_ROWS;

      if (currentRowCount >= limit) {
        pages.push(currentPage);
        currentPage = [];
        currentRowCount = 0;
      }

      currentPage.push(row);
      currentRowCount++;
    });

    if (currentPage.length > 0) {
      currentPage.push({ type: "grandTotal", amount: totalAmount });
      pages.push(currentPage);
    }

    return pages;
  };

  const leftTablePages = paginateGroupedDataWithFooter(
    ledgerTableLiablitiesData?.groupedData || [],
    ledgerTableLiablitiesData?.grandTotals?.grandTotalAmount || 0,
  );

  const rightTablePages = paginateGroupedDataWithFooter(
    ledgerTableAssetsData?.groupedData || [],
    ledgerTableAssetsData?.grandTotals?.grandTotalAmount || 0,
  );

  const totalPages = Math.max(leftTablePages.length, rightTablePages.length, 1);
  const lastLeftPage = leftTablePages[totalPages - 1] || [];
  const lastRightPage = rightTablePages[totalPages - 1] || [];
  const needExtraPage = lastLeftPage.length > 11 || lastRightPage.length > 11;

  const renderTable = (pageData, isLeft, pageIndex) => (
    <div key={isLeft ? "left" : "right"} className="w-1/2">
      <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
        {(pageIndex === 0 || pageData.length > 0) && (
          <TableHeader>
            <TableRow className="h-[40px]">
              <TableHead className="text-black p-0 text-center border-black h-[40px]">
                {isLeft ? "Liabilities" : "Assets"}
              </TableHead>
              <TableHead className="text-black p-0 border-l text-center border-black w-[120px] h-[40px]">
                Break Up
              </TableHead>
              <TableHead className="text-black p-0 border-l text-center border-black w-[120px] h-[40px]">
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
                  <TableRow key={`group-${index}`} className="h-[40px]">
                    <TableCell
                      colSpan={2}
                      className="font-semibold border p-0 pl-2 text-start border-black"
                    >
                      {row.data.headName}
                    </TableCell>
                    <TableCell className="font-semibold border p-0 pr-[2px] text-right border-black">
                      {row.data.subtotalAmount?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              case "txn":
                return row.data.Ledger_Id !== null ? (
                  <TableRow key={`txn-${index}`} className="h-[40px]">
                    <TableCell className="border border-black p-0 pl-5 text-start">
                      {row.data.Ledger_Name}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {parseFloat(row.data.Amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row.data.Debit
                        ? parseFloat(row.data.Debit).toFixed(2)
                        : ""}
                    </TableCell>
                  </TableRow>
                ) : null;
              case "grandTotal":
                return (
                  <TableRow key={`grandTotal-${index}`} className="h-[40px]">
                    <TableCell
                      colSpan={2}
                      className="font-semibold bg-white border border-black p-0 text-center"
                    >
                      Grand Total
                    </TableCell>
                    <TableCell className="font-semibold border border-black p-0 text-center">
                      {parseFloat(row.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              default:
                return null;
            }
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="w-[297mm] h-full" ref={printRef}>
      {Array.from({ length: totalPages + (needExtraPage ? 1 : 0) }).map(
        (_, pageIndex) => {
          const leftPageData = leftTablePages[pageIndex] || [];
          const rightPageData = rightTablePages[pageIndex] || [];

          const isLastPage = pageIndex === totalPages - 1 && !needExtraPage;
          const isExtraPage = needExtraPage && pageIndex === totalPages;

          return (
            <div
              key={pageIndex}
              data-print-page="true"
              className="w-full h-[210mm] flex flex-col text-center py-2 px-1 bg-white overflow-hidden print:break-after-page"
            >
              <div className="shrink-0 text-xs flex flex-col gap-1 uppercase mb-1">
                <p>{orgName}</p>
                <p>{branchName}</p>
                <p>{address}</p>
                <p>{regNo}</p>
                <p className="text-sm">Balance Sheet As On {asOnDate}</p>
              </div>

              <div className="flex-1 min-h-0">
              {!isExtraPage ? (
                <div className="flex flex-col w-full border border-black">
                  <div className="flex">
                    {renderTable(leftPageData, true, pageIndex)}
                    {renderTable(rightPageData, false, pageIndex)}
                  </div>
                  {isLastPage && (
                    <div className="text-[11px] mt-16 text-left px-2">
                      <h2 className="text-center text-xs font-semibold mb-1">
                        Auditor&#39;s Certificate
                      </h2>
                      <p>
                        I report that I have audited the above balance Sheet as
                        on 31-March-2023 and the annexed Profit and Loss Account
                        for the year ended 31-March-2023 and have obtained all
                        the information and explanation I have required. In my
                        opinion the Balance Sheet and the Profit and Loss
                        Account have been drawn up inconformity with the law and
                        subject to my separate report of even date, the Balance
                        Sheet exhibits a true and correct view of the state of
                        the society&#39;s affair according to the best of
                        information and explanations given to me and as shown by
                        the book of the society. In my opinion the books of
                        accounts have been kept as required under the Act, the
                        rules and the By-Laws.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[11px] pt-16 pb-2 text-left px-2 border border-black">
                  <h2 className="text-center text-xs font-semibold mb-1">
                    Auditor&#39;s Certificate
                  </h2>
                  <p>
                    I report that I have audited the above balance Sheet as on
                    31-March-2023 and the annexed Profit and Loss Account for
                    the year ended 31-March-2023 and have obtained all the
                    information and explanation I have required. In my opinion
                    the Balance Sheet and the Profit and Loss Account have been
                    drawn up inconformity with the law and subject to my
                    separate report of even date, the Balance Sheet exhibits a
                    true and correct view of the state of the society&#39;s
                    affair according to the best of information and explanations
                    given to me and as shown by the book of the society. In my
                    opinion the books of accounts have been kept as required
                    under the Act, the rules and the By-Laws.
                  </p>
                </div>
              )}
              </div>

              <div className="shrink-0 w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
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
        },
      )}
    </div>
  );
};

export default PreviewModal;
