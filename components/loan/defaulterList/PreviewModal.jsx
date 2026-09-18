import { useTranslation } from "react-i18next";
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

const PAGE_ROWS = 30;

const chunkPagesWithFooterLogic = (rows) => {
  const pages = [];
  let currentPage = [];
  let count = 0;
  const maxRows = PAGE_ROWS;

  rows?.transactions?.forEach((row) => {
    // --- Always place transaction row ---
    if (count === maxRows) {
      pages.push(currentPage);
      currentPage = [];
      count = 0;
    }
    currentPage.push({ ...row, isTransaction: true });
    count++;

    // --- Now stream guarantors one-by-one ---
    if (Array.isArray(row?.Gurantor_Data)) {
      row.Gurantor_Data.forEach((guarantor, gIndex) => {
        if (count === maxRows) {
          pages.push(currentPage);
          currentPage = [];
          count = 0;
        }
        currentPage.push({
          ...guarantor,
          isGuarantor: true,
          isFirstGuarantor: gIndex === 0, // 👈 Only the first guarantor gets the label
        });
        count++;
      });
    }
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // Ensure last page has space for totals
  const lastPageCount = pages[pages.length - 1]?.length || 0;
  if (lastPageCount >= maxRows) {
    pages.push([]);
  }

  return pages;
};

const PreviewModal = ({
  printRef,
  tableData,
  asOnDate,
  productType,
  reportType,
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
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {reportType} of {productType} As On{" "}
              {asOnDate && format(asOnDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px]">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="h-[50px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[40px]">{t("loan.print.slNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.memberNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.accountNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">{t("loan.print.name")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.principal")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.interest")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.odPrincipal")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.odInterest")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[60px]">{t("loan.print.dueMonth")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">{t("loan.print.startDate")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">{t("loan.print.finalRepayDate")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) =>
                  row.isTransaction ? (
                    <TableRow
                      key={`txn-${index}`}
                      className="bg-white h-[20px]"
                    >
                      {/* Transaction Row */}
                      <TableCell className="border border-black p-0 text-center">
                        {globalSerialNo++}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Member_No || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Account_No || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Member_Name || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-[2px] text-right">
                        {row?.Balance || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-[2px] text-right">
                        {row?.Interest || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-[2px] text-right">
                        {row?.OD_Principal || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-[2px] text-right">
                        {row?.OD_Interest || ""}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Due_Month}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Disb_Date && format(row?.Disb_Date, "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell className="border border-black p-0 text-center">
                        {row?.Final_Date &&
                          format(row?.Final_Date, "dd-MM-yyyy")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow
                      key={`guarantor-${index}`}
                      className="bg-white h-[20px]"
                    >
                      <TableCell
                        colSpan={3}
                        className="border border-black p-0 pr-1 text-right"
                      >
                        {row.isFirstGuarantor ? "Guarantor" : ""}
                      </TableCell>
                      <TableCell
                        colSpan={8}
                        className="border border-black p-0 pl-40 text-left"
                      >
                        {row.Gurantor_Name}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>

              {/* Only show total on last page */}
              {pageIndex === pages.length - 1 && (
                <TableFooter>
                  <TableRow className="bg-white h-[20px]">
                    <TableCell
                      colSpan={4}
                      className="border border-black p-0 text-center"
                    >{t("loan.total")}</TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.principal?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.interest?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.odPrincipal?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.odInterest?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell colSpan={3} className="p-0" />
                  </TableRow>
                </TableFooter>
              )}
            </Table>
          </div>

          {/* Footer */}
          <div className="w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
            <p className="text-nowrap">{t("loan.generatedByColon")} {userName}</p>
            <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">{t("loan.reportGeneratedByPrioSuite")}</p>
            <p className="text-nowrap">
              {t("loan.generatedOnColon")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewModal;
