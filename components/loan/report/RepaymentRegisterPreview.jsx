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

const RepaymentRegisterPreview = ({
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

  const PAGE_ROWS = 13;

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
          subTotalPrincipal: group.subtotalPrincipal,
          subTotalInterest: group.subtotalInterest,
          subTotalAmount: group.subtotalAmount,
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
        grandTotalPrincipal: groupedData?.find((group) => group.isGrandTotal)
          ?.grandTotalPrincipal,
        grandTotalInterest: groupedData?.find((group) => group.isGrandTotal)
          ?.grandTotalInterest,
        grandTotalAmount: groupedData?.find((group) => group.isGrandTotal)
          ?.grandTotalAmount,
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
            <TableRow className="!h-[40px]">
              <TableHead className="text-black p-0 border-black text-center w-[4.2%]">{t("loan.print.slNo")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[16.1%]">{t("loan.print.customerName")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[14.7%]">{t("loan.print.guardianName")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[9.8%]">{t("loan.print.accountNo")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[8.4%]">{t("loan.print.refAcNo")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[9.8%]">{t("loan.print.transMode")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[12.3%]">{t("loan.print.principal")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[12.3%]">{t("loan.print.interest")}</TableHead>
              <TableHead className="text-black p-0 border-black border-l text-center w-[12.3%]">{t("loan.print.amount")}</TableHead>
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
                    className="!h-[40px] border border-black"
                  >
                    <TableCell
                      colSpan={9}
                      className="font-semibold text-sm border p-0 pl-5 border-black text-center"
                    >
                      {row?.date ? format(row.date, "dd-MM-yyyy") : ""}
                    </TableCell>
                  </TableRow>
                );
              case "txn":
                return (
                  <Fragment key={`txn-${index}`}>
                    <TableRow className="!h-[40px] border border-black">
                      <TableCell className="p-0 border border-black text-center">
                        {row.serial}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Full_Name}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Relation_Name}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Account_No}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Ref_Ac_No}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-center">
                        {row.data.Trans_Type}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Paid_Prn
                          ? Number(row?.data?.Paid_Prn)?.toFixed(2)
                          : ""}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Paid_Intt
                          ? Number(row?.data?.Paid_Intt)?.toFixed(2)
                          : ""}
                      </TableCell>
                      <TableCell className="p-0 border border-black text-right pr-[2px]">
                        {row?.data?.Tot_Amt
                          ? Number(row?.data?.Tot_Amt)?.toFixed(2)
                          : ""}
                      </TableCell>
                    </TableRow>
                  </Fragment>
                );
              case "subTotal":
                return (
                  <TableRow className="!h-[40px] border border-black">
                    <TableCell
                      colSpan={6}
                      className="border border-black text-right p-0 pr-5 "
                    >{t("loan.subTotal")}</TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalPrincipal
                        ? row.subTotalPrincipal.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalInterest
                        ? row.subTotalInterest.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="border p-0 border-black text-right pr-[2px]">
                      {row.subTotalAmount
                        ? row.subTotalAmount.toFixed(2)
                        : "0.00"}
                    </TableCell>
                  </TableRow>
                );
              case "grandTotal":
                return (
                  <TableRow
                    key={`grandTotal-${index}`}
                    className="!h-[40px] bg-white border-black"
                  >
                    <TableCell
                      colSpan={6}
                      className="font-semibold p-0 pr-5 border border-black text-right"
                    >{t("loan.grandTotal")}</TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalPrincipal
                        ? Number(row?.grandTotalPrincipal)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalInterest
                        ? Number(row?.grandTotalInterest)?.toFixed(2)
                        : "0.00"}
                    </TableCell>
                    <TableCell className="font-semibold p-0 border border-black text-right pr-[2px]">
                      {row?.grandTotalAmount
                        ? Number(row?.grandTotalAmount)?.toFixed(2)
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
          data-print-page="true"
          className="w-full h-[210mm] flex flex-col text-center py-2 px-1 print:break-after-page bg-white"
        >
          {/* HEADER - SHOW ON EVERY PAGE */}
          <div className=" text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">
              {t("loan.depositTransactionRegisterFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          {/* TABLE */}
          <div className="flex-1">{renderTable(page)}</div>

          {/* FOOTER */}
          <div className="w-full mt-2 grid grid-cols-3 items-end gap-2 text-[10px]">
            <p className="text-left truncate">{t("loan.generatedBy")} {userName}</p>
            <p className="text-center italic text-gray-600">{t("loan.reportGeneratedByPrioSuite")}</p>
            <p className="text-right whitespace-nowrap">
              {t("loan.generatedOnColon")} {currentDate} {currentTime}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RepaymentRegisterPreview;
