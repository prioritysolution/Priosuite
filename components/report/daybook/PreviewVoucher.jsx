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
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useEnglishOnly } from "@/i18n/useEnglishOnly";

const ROWS_PER_PAGE = 48;

const chunkVoucherPages = (data) => {
  const pages = [];
  let currentPage = [];

  data.forEach((row, i) => {
    if (currentPage.length === ROWS_PER_PAGE) {
      pages.push(currentPage);
      currentPage = [];
    }
    currentPage.push(row);
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  // ✅ If last page is full (48 rows), add a new empty page for total
  if (pages.length && pages[pages.length - 1].length + 2 > ROWS_PER_PAGE) {
    pages.push([]); // reserve space for totals
  }

  return pages;
};

const PreviewVoucher = ({
  printRef,
  voucherDetailsData,
  totalDrAmount,
  totalCrAmount,
  englishOnly = false,
}) => {
  const { t: tLive } = useTranslation();
  const { t: tEn } = useEnglishOnly();
  const t = englishOnly ? tEn : tLive;

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

  const pages = chunkVoucherPages(voucherDetailsData);

  return (
    <div className="w-[210mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => {
        return (
          <div
            key={pageIndex}
            data-print-page="true"
            className={cn(
              "w-full h-[148mm] py-2 px-1 text-center mb-4 flex flex-col justify-between scale-[.97] break-inside-avoid",
              { "h-[297mm]": pageRows.length > 17 },
            )}
          >
            {/* Org Header */}
            <div className="text-xs flex flex-col gap-1 uppercase">
              <p>{orgName}</p>
              <p>{branchName}</p>
              <p>{address}</p>
              <p>{regNo}</p>
            </div>

            {/* Voucher Info */}
            <div className="flex-1 w-full">
              <div className="w-full grid grid-cols-4 gap-1 text-xs my-2">
                <p>
                  <span className="font-semibold">
                    {t("report.daybook.voucherType")} :
                  </span>{" "}
                  {voucherDetailsData[0]?.Vouch_type}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("report.daybook.voucherNo")} :
                  </span>{" "}
                  {voucherDetailsData[0]?.Vouch_No}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("report.daybook.refVcNo")} :
                  </span>{" "}
                  {voucherDetailsData[0]?.Ref_Vouch_No}
                </p>
                <p>
                  <span className="font-semibold">
                    {t("report.daybook.voucherDate")} :
                  </span>{" "}
                  {voucherDetailsData[0]?.Trans_Date &&
                    format(voucherDetailsData[0].Trans_Date, "dd-MM-yyyy")}
                </p>
              </div>

              {/* Table */}
              <Table className="w-full border-collapse border border-black overflow-hidden text-[11px]">
                <TableHeader>
                  <TableRow className="h-[20px]">
                    <TableHead className="text-black p-0 border-black text-center w-[40px] h-[20px]">
                      {t("report.daybook.print.sl")}
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center h-[20px]">
                      {t("report.daybook.print.headOfAccount")}
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[160px] h-[20px]">
                      {t("report.daybook.print.drAmount")}
                    </TableHead>
                    <TableHead className="text-black p-0 border-black border-l text-center w-[160px] h-[20px]">
                      {t("report.daybook.print.crAmount")}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageRows.map((data, index) => (
                    <TableRow key={index} className="bg-white h-[20px]">
                      <TableCell className="border border-black p-0 text-center">
                        {pageIndex * ROWS_PER_PAGE + index + 1}
                      </TableCell>
                      <TableCell className="border border-black p-0 pl-[2px] text-start">
                        {data?.Ledger_Name}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-[2px] text-right">
                        {data?.Trans_Type === "D" && data?.Amount}
                      </TableCell>
                      <TableCell className="border border-black p-0 pr-[2px] text-right">
                        {data?.Trans_Type === "C" && data?.Amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                {pageIndex === pages.length - 1 && (
                  <TableFooter className="font-normal">
                    <TableRow className="bg-white h-[20px]">
                      <TableCell
                        colSpan={2}
                        className="font-medium text-right border p-0 pr-3 border-black"
                      >
                        {t("report.daybook.total")}
                      </TableCell>
                      <TableCell className="text-black border-black text-right border p-0 pr-[2px]">
                        {totalDrAmount?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-black border-black text-right border p-0 pr-[2px]">
                        {totalCrAmount?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-white h-[20px]">
                      <TableCell
                        colSpan={4}
                        className="font-medium text-start border p-0 pl-5 border-black"
                      >
                        {t("report.daybook.narration")} :{" "}
                        {voucherDetailsData[0]?.Particular}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>

            {/* Footer */}
            <div className="w-full h-[20px] flex items-end justify-between text-xs relative">
              <p className="text-nowrap">
                {t("report.daybook.generatedBy")} {userName}
              </p>
              <p className="absolute left-[50%] translate-x-[-50%] italic text-gray-600 text-nowrap">
                {t("report.daybook.generatedByPrioSuite")}
              </p>
              <p className="text-nowrap">
                {t("report.daybook.generatedOn")} {currentDate} {currentTime}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PreviewVoucher;
