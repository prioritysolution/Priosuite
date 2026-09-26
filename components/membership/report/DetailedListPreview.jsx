import { useEnglishOnly as useTranslation } from "@/i18n/useEnglishOnly";
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

const PAGE_ROWS = 15;

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
  totalIssue,
  totalRelease,
  totalClosing,
  totalDividend,
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
          <div className="text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {t("membership.reports.preview.detailedListFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")}{" "}
              {t("membership.reports.preview.to")}{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px]">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="!h-[40px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[40px]">
                    {t("membership.reports.print.slNo")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">
                    {t("membership.reports.print.date")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[60px]">
                    {t("membership.reports.print.memberType")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[130px]">
                    {t("membership.reports.print.customerName")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[130px]">
                    {t("membership.reports.print.guardianName")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[120px]">
                    {t("membership.reports.print.village")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center ">
                    {t("membership.reports.print.lfNo")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("membership.reports.print.opening")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("membership.reports.print.issue")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("membership.reports.print.release")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("membership.reports.print.closing")}
                  </TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">
                    {t("membership.reports.print.divBal")}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) => (
                  <TableRow key={index} className="bg-white !h-[40px]">
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
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Opening}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Tot_Issue}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Tot_Release}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Closing}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Divid_Bal}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              {/* Only show total on last page */}
              {pageIndex === pages.length - 1 && (
                <TableFooter>
                  <TableRow className="bg-white !h-[40px]">
                    <TableCell
                      colSpan={7}
                      className="border border-black p-0 text-center"
                    >
                      {t("common.total")}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalOpening?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalIssue?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalRelease?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalClosing?.toFixed(2)}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {totalDividend?.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>

          {/* Footer */}
          <div className="w-full !h-[40px] mt-2 flex items-end justify-between text-xs relative">
            <p className="text-nowrap">
              {t("membership.reports.preview.generatedBy")} {userName}
            </p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
              {t("membership.reports.preview.footerNote")}
            </p>
            <p className="text-nowrap">
              {t("membership.reports.preview.generatedOn")} {currentDate}{" "}
              {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailedListPreview;
