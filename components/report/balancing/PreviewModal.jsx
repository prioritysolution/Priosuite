import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getCookieData from "@/utils/getCookieData";

const PAGE_ROWS = 23;

const flattenDataWithSubheaders = (dataGroups) => {
  const flatRows = [];
  dataGroups.forEach(({ type, list }) => {
    if (list.length === 0) return;
    flatRows.push({ isSubHeader: true, productType: type });
    list.forEach((row) => {
      flatRows.push({ ...row, isSubHeader: false });
    });
  });
  return flatRows;
};

const chunkPages = (flatRows) => {
  const pages = [];
  let currentPage = [];
  let maxRows = PAGE_ROWS;
  let count = 0;

  flatRows.forEach((row) => {
    if (count === maxRows) {
      pages.push(currentPage);
      currentPage = [];
      count = 0;
    }
    currentPage.push(row);
    count++;
  });

  if (currentPage.length) {
    pages.push(currentPage);
  }

  return pages;
};

const PreviewModal = ({
  printRef,
  depositList,
  loanList,
  shareList,
  investmentList,
  borrowingsList,
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

  const dataGroups = [
    { type: "SHARE", list: shareList || [] },
    { type: "DEPOSIT", list: depositList || [] },
    { type: "LOAN", list: loanList || [] },
    { type: "INVESTMENT", list: investmentList || [] },
    { type: "BORROWINGS", list: borrowingsList || [] },
  ];

  const flatRows = flattenDataWithSubheaders(dataGroups);
  const pages = chunkPages(flatRows);

  let serialCounter = 1;
  return (
    <div className="w-[210mm]" ref={printRef}>
      {pages.map((pageRows, pageIndex) => (
        <div
          key={pageIndex}
          data-print-page="true"
          className="w-full h-[297mm] py-2 px-1 text-center mb-4 flex flex-col justify-between bg-white overflow-hidden"
        >
          {/* Org Header Only on First Page */}

          <div className="shrink-0 text-xs flex flex-col gap-1 uppercase mb-1">
            <p>{orgName}</p>
            <p>{branchName}</p>
            <p>{address}</p>
            <p>{regNo}</p>
            <p className="text-sm">GL Balancing As On {asOnDate}</p>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0 w-full">
            <Table
              className="w-full border-collapse text-[11px]"
            >
              {/* Main Header Every Page */}
              <TableHeader className="[&_tr]:border-b-0">
                <TableRow className="h-[60px] border-0 hover:bg-transparent">
                  <TableHead
                    style={{ width: "25px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    SL. NO.
                  </TableHead>
                  <TableHead
                    style={{ width: "50px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    PRODUCT NAME
                  </TableHead>
                  <TableHead
                    style={{ width: "160px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    GL HEAD
                  </TableHead>
                  <TableHead
                    style={{ width: "80px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    GL BALANCE
                  </TableHead>
                  <TableHead
                    style={{ width: "100px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    SUB-LEDGER
                  </TableHead>
                  <TableHead
                    style={{ width: "160px" }}
                    className="text-black p-0 border border-black text-center"
                  >
                    DIFFERENCE
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {pageRows.map((row, index) => {
                  if (row.isSubHeader) {
                    serialCounter = 1; // Reset counter on sub-header
                    return (
                      <TableRow
                        key={`sub-${index}`}
                        className="h-[40px] border-0 hover:bg-transparent"
                      >
                        <TableCell
                          colSpan={6}
                          className="text-sm p-0 font-medium border border-black text-center"
                        >
                          PRODUCT TYPE : {row.productType}
                        </TableCell>
                      </TableRow>
                    );
                  } else {
                    return (
                      <TableRow
                        key={index}
                        className="bg-white h-[40px] border-0 hover:bg-transparent"
                      >
                        <TableCell className="border border-black p-0 text-center">
                          {serialCounter++}
                        </TableCell>
                        <TableCell className="border border-black p-0 text-center">
                          {row?.Sub_Heading}
                        </TableCell>
                        <TableCell className="border border-black p-0 text-center">
                          {row?.Ledger_Name}
                        </TableCell>
                        <TableCell className="border border-black p-0 text-center">
                          {row?.Gl_Balance}
                        </TableCell>
                        <TableCell className="border border-black p-0 text-center">
                          {row?.Dl_Balance}
                        </TableCell>
                        <TableCell className="border border-black p-0 text-center">
                          {row?.Remarks}
                        </TableCell>
                      </TableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          </div>

          {/* Footer */}
          <div className="shrink-0 w-full h-[40px] mt-2 flex items-end justify-between text-xs relative">
            <p className="text-nowrap">Generated By: {userName}</p>
            <p
              className="absolute left-[50%] translate-x-[-50%] italic text-nowrap"
              style={{ color: "#4b5563" }}
            >
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

export default PreviewModal;
