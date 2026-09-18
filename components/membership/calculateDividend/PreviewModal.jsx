"use client";


import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PreviewModal = ({ tableData, printRef }) => {
  const { t } = useTranslation();

  return (
    <div className="w-[210mm] h-full " ref={printRef}>
      {Array.from({ length: Math.ceil(tableData?.length / 17) }).map(
        (_, pageIndex) => {
          const startIdx = pageIndex * 17;
          const pageData = tableData.slice(startIdx, startIdx + 17);
          const remainingRows = 16 - pageData.length;
          const isLastPage = pageIndex === Math.ceil(tableData.length / 17) - 1;
          return (
            <div
              className="w-full h-[297mm] py-2 px-1 text-[11px] text-black scale-[.97]"
              key={pageIndex}
            >
              <Table className="border-collapse border-black">
                <TableHeader>
                  <TableRow className="h-[60px]">
                    <TableHead className="text-black border border-black p-0 text-center w-[50px]">{t("membership.calculateDividend.table.sl")}</TableHead>
                    <TableHead className="text-black border border-black p-0 text-center w-[80px]">{t("membership.calculateDividend.table.memberCode")}</TableHead>
                    <TableHead className="text-black border border-black p-0 text-center w-[160px]">{t("membership.calculateDividend.table.memberName")}</TableHead>
                    <TableHead className="text-black border border-black p-0 text-center w-[160px]">{t("membership.calculateDividend.table.guardianName")}</TableHead>
                    <TableHead className="text-black border border-black p-0 text-center">{t("membership.calculateDividend.table.village")}</TableHead>
                    <TableHead className="text-black border border-black p-0 text-center w-[100px]">{t("membership.calculateDividend.table.shareBalance")}</TableHead>
                    <TableHead className="text-black border border-black p-0 text-center w-[100px]">{t("membership.calculateDividend.table.dividendAmount")}</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageData.map((data, index) => (
                    <TableRow key={index} className="h-[60px]">
                      <TableCell className="p-0 text-center border border-black">
                        {startIdx + index + 1}
                      </TableCell>
                      <TableCell className="p-0 text-center border border-black">
                        {data?.CIF_No}
                      </TableCell>
                      <TableCell className="p-0 text-center border border-black">
                        {data?.Full_Name}
                      </TableCell>
                      <TableCell className="p-0 text-center border border-black">
                        {data?.Relation_Name}
                      </TableCell>
                      <TableCell className="p-0 text-center border border-black">
                        {data?.Village}
                      </TableCell>
                      <TableCell className="p-0 pr-[2px] text-right border border-black">
                        {data?.Balance?.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-0 pr-[2px] text-right border border-black">
                        {data?.Dividend?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Add empty rows to push the footer to the bottom */}
                  {isLastPage &&
                    Array.from({ length: remainingRows }).map((_, index) => (
                      <TableRow key={`empty-${index}`} className="h-[60px]">
                        <TableCell colSpan={7}></TableCell>
                      </TableRow>
                    ))}
                </TableBody>

                {/* Add Footer on the last page */}
                {isLastPage && (
                  <TableFooter>
                    <TableRow className="h-[60px]">
                      <TableCell
                        colSpan={6}
                        className=" p-0 text-center border border-black"
                      >{t("common.total")}</TableCell>
                      <TableCell className="text-right p-0 pr-[2px] border border-black">
                        {tableData
                          .reduce((sum, item) => sum + item.Dividend, 0)
                          .toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          );
        }
      )}
    </div>
  );
};
export default PreviewModal;
