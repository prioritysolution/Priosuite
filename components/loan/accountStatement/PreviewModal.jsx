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

const PAGE_ROWS = 11;

const chunkPagesWithFooterLogic = (rows) => {
  const pages = [];
  let currentPage = [];
  let maxRows = PAGE_ROWS;
  let count = 0;

  rows?.transactions?.forEach((row) => {
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

const PreviewModal = ({ printRef, tableData, fromDate, toDate }) => {
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
              {t("loan.accountStatementFrom")}{" "}
              {fromDate && format(fromDate, "dd-MM-yyyy")} To{" "}
              {toDate && format(toDate, "dd-MM-yyyy")}
            </p>
          </div>

          <div className="h-[120px] w-full border border-black my-1 px-2 py-1 grid grid-cols-3 gap-1 text-xs text-start">
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.memberNameColon")}</p>
              <p>{tableData?.basicData?.Full_Name || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.guardianNameColon")}</p>
              <p>{tableData?.basicData?.Relation_Name || ""}</p>
            </div>
            <div className="w-full flex gap-1 col-span-3">
              <p className="font-semibold text-nowrap">{t("loan.address")}</p>
              <p>{tableData?.basicData?.Address || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.accountNoColon")}</p>
              <p>{tableData?.basicData?.Account_No || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.refAcNoColon")}</p>
              <p>{tableData?.basicData?.Ref_Ac_No || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.ledgerFolioColon")}</p>
              <p>{tableData?.basicData?.Ledg_Folio || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.disbDateColon")}</p>
              <p>
                {tableData?.basicData?.Disb_Date
                  ? format(tableData?.basicData?.Disb_Date, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.print.roi")}</p>
              <p>{tableData?.basicData?.Roi || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.disbAmountColon")}</p>
              <p>{tableData?.basicData?.Disb_Amt || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.repayWithinColon")}</p>
              <p>
                {tableData?.basicData?.Repay_Within
                  ? format(tableData?.basicData?.Repay_Within, "dd-MM-yyyy")
                  : ""}
              </p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.repayModeColon")}</p>
              <p>{tableData?.basicData?.Repay_Mode || ""}</p>
            </div>
            <div className="w-full flex gap-1">
              <p className="font-semibold text-nowrap">{t("loan.productNameColon")}</p>
              <p>{tableData?.basicData?.Prod_Name || ""}</p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 w-full">
            <Table className="w-full border-collapse border border-black text-[11px]">
              {/* Main Header Every Page */}
              <TableHeader>
                <TableRow className="h-[50px] border-black">
                  <TableHead className="text-black p-0 border-black text-center w-[40px]">{t("loan.print.slNo")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[80px]">{t("loan.print.transDate")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center">{t("loan.print.particular")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.disbAmount")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.currPrnPaid")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.currInttPaid")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.odPrnPaid")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.odInttPaid")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.currOuts")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.odOuts")}</TableHead>
                  <TableHead className="text-black p-0 border-black border-l text-center w-[100px]">{t("loan.print.dueIntt")}</TableHead>
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
                      {row?.Particular || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Disb_Amt || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Cur_Prn || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Curr_Intt || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Od_Prn || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Od_Intt || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Curr_Outs || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Od_Outs || ""}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {row?.Due_Intt || ""}
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
                    >{t("loan.total")}</TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.disburse?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.currPrn?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.currIntt?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.odPrn?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.odIntt?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.currOuts?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.odOuts?.toFixed(2) || "0.00"}
                    </TableCell>
                    <TableCell className="border border-black p-0 pr-[2px] text-right">
                      {tableData?.grandTotal?.dueIntt?.toFixed(2) || "0.00"}
                    </TableCell>
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
