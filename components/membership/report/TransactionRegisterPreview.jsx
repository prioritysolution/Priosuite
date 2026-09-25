"use client";
import { useEnglishOnly as useTranslation } from "@/i18n/useEnglishOnly";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";

const TransactionRegisterPreview = ({
  printRef,
  tableData,
  fromDate,
  toDate,
}) => {
  const { t } = useTranslation();

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

  const paginateGroupedDataWithFooter = (groupedData) => {
    const pages = [];
    let currentPage = [];
    let currentRowCount = 0;
    let serial = 1;

    const allRows = [];

    // Aggregate data into allRows
    groupedData.forEach((group) => {
      if (!group.isGrandTotal) {
        allRows.push({ type: "date", date: group.date });

        serial = 1;
        group?.transactions?.forEach((txn) => {
          allRows.push({
            type: "txn",
            data: txn,
            serial: serial++,
          });
        });

        allRows.push({
          type: "subTotal",
          subTotalIssue: group.subtotalIssue,
          subTotalRelease: group.subtotalRelease,
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

    let grandTotalRow = null;

    if (groupedData.some((group) => group.isGrandTotal)) {
      grandTotalRow = {
        type: "grandTotal",
        grandTotalIssue: groupedData?.find((group) => group.isGrandTotal)
          ?.grandTotalIssue,
        grandTotalRelease: groupedData?.find((group) => group.isGrandTotal)
          ?.grandTotalRelease,
      };
    }

    if (currentRowCount >= PAGE_ROWS) {
      pages.push(currentPage);
      currentPage = [grandTotalRow];
    } else {
      currentPage.push(grandTotalRow);
    }

    pages.push(currentPage); // Final push for the last page

    return pages;
  };

  const pages = paginateGroupedDataWithFooter(tableData);

  const renderTable = (pageData) => {
    return (
      <Table className="w-full border-collapse border border-black text-[11px] overflow-hidden">
        {pageData.length > 0 && (
          <TableHeader>
            <TableRow className="h-[40px]">
              <TableHead className="text-black p-0 border-black text-center w-[40px]">{t("membership.reports.print.slNo")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("membership.reports.print.memberType")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[160px]">{t("membership.reports.print.customerName")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[160px]">{t("membership.reports.print.guardianName")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[140px]">{t("membership.reports.print.village")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center">{t("membership.reports.print.lfNo")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("membership.reports.print.transMode")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("membership.reports.print.noOfShare")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">{t("membership.reports.print.issue")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">{t("membership.reports.print.release")}</TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {pageData.map((row, index) => {
            switch (row?.type) {
              case "date":
                return (
                  <TableRow
                    key={`date-${index}`}
                    className="h-[40px] border border-black"
                  >
                    <TableCell
                      colSpan={10}
                      className="font-semibold text-sm border p-0 pl-5 border-black text-start"
                    >
                      {row?.date ? format(row.date, "dd-MM-yyyy") : ""}
                    </TableCell>
                  </TableRow>
                );
              case "txn":
                return (
                  <Fragment key={`txn-${index}`}>
                    <TableRow className="h-[40px] border border-black">
                      <TableCell className="p-0 border border-black text-center">
                        {row.serial}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Member_Type}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Full_Name}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Relation_Name}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Village}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Ledg_Folio}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Vouch_Type}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.No_Share}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row.data.Tot_Issue?.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row.data.Tot_Release?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              case "subTotal":
                return (
                  <TableRow className="h-[40px] border border-black">
                    <TableCell
                      colSpan={8}
                      className="border border-black text-right p-0 pr-5 "
                    >
                      {t("common.subtotal")}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalIssue ? row.subTotalIssue.toFixed(2) : ""}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalRelease
                        ? row.subTotalRelease.toFixed(2)
                        : ""}
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
                      colSpan={8}
                      className="font-semibold p-0 pr-5 border border-black text-right"
                    >
                      {t("common.grandTotal")}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalIssue
                        ? Number(row?.grandTotalIssue)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalRelease
                        ? Number(row?.grandTotalRelease)?.toFixed(2)
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
      className="w-[297mm] print:max-w-none print:w-full print:text-black"
    >
      {/* Liabilities Pages */}
      {pages.map((page, pageIndex) => (
        <div
          key={`page-${pageIndex}`}
          className="w-full h-[210mm] flex flex-col text-center py-2 px-1 print:break-after-page scale-[.98]"
        >
          {/* HEADER - SHOW ON EVERY PAGE */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {t("membership.reports.preview.transactionRegisterFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} {t("membership.reports.preview.to")}{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1">{renderTable(page)}</div>

          {/* FOOTER */}
          <div className="w-full h-[40px] flex items-end justify-between text-xs relative">
            <p>{t("membership.reports.preview.generatedBySpaced")} {userName}</p>
            <p className="italic text-gray-600 text-center w-full absolute  left-1/2 -translate-x-1/2">
              {t("membership.reports.preview.footerNote")}
            </p>
            <p>
              {t("membership.reports.preview.generatedOnSpaced")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionRegisterPreview;
