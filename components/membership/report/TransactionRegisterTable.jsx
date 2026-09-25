import { useEnglishOnly as useTranslation } from "@/i18n/useEnglishOnly";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Fragment } from "react";
import { HiMiniPrinter } from "react-icons/hi2";

const TransactionRegisterTable = ({
  tableData,
  handleShowLedger,
  loading,
  handleGenerateShareReceipt,
}) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className="text-center">{t("membership.reports.slNo")}</TableHead>
          <TableHead className="">{t("membership.reports.memberType")}</TableHead>
          <TableHead className="">{t("membership.reports.customerName")}</TableHead>
          <TableHead className="">{t("membership.reports.guardianName")}</TableHead>
          <TableHead className="">{t("membership.reports.village")}</TableHead>
          <TableHead className="">{t("membership.reports.lfNo")}</TableHead>
          <TableHead className="">{t("membership.reports.transactionMode")}</TableHead>
          <TableHead className="">{t("membership.reports.numberOfShares")}</TableHead>
          <TableHead className="">{t("membership.reports.issue")}</TableHead>
          <TableHead className="">{t("membership.reports.release")}</TableHead>
          <TableHead className="">{t("membership.reports.action")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading ? (
          <>
            <TableRow>
              <TableCell colSpan={10} className="">
                <Skeleton className="w-40 h-5 bg-secondary mx-auto" />
              </TableCell>
            </TableRow>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 10 }).map((_, index) => (
                  <TableCell key={index} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : (
          tableData.map((group, groupIndex) => {
            // Skip the last group (groupIndex === tableData.length)
            if (groupIndex === tableData.length - 1) {
              return null;
            }

            return (
              <Fragment key={groupIndex}>
                {/* Subheader for Date */}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={11} className="font-medium text-center">
                    Date - {group.date && format(group.date, "dd-MM-yyyy")}
                  </TableCell>
                </TableRow>
                {/* Rows for Transactions */}
                {group.transactions &&
                  group.transactions.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-center">
                        {index + 1 + groupIndex} {/* Global serial */}
                      </TableCell>
                      <TableCell className="">{data?.Member_Type}</TableCell>
                      <TableCell
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleShowLedger(data.Id)}
                      >
                        {data?.Full_Name}
                      </TableCell>
                      <TableCell className="">{data?.Relation_Name}</TableCell>
                      <TableCell className="">{data?.Village}</TableCell>
                      <TableCell className="">{data?.Ledg_Folio}</TableCell>
                      <TableCell className="">{data?.Vouch_Type}</TableCell>
                      <TableCell className="">{data?.No_Share}</TableCell>
                      <TableCell className="">{data?.Tot_Issue}</TableCell>
                      <TableCell className="">{data?.Tot_Release}</TableCell>
                      <TableCell className="">
                        {data?.Tot_Issue ? (
                          <Button
                            onClick={() =>
                              handleGenerateShareReceipt(
                                data?.Txn_Id,
                                group.date,
                              )
                            }
                            className="text-xl"
                          >
                            <HiMiniPrinter />
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                {/* Subtotal Row */}
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={8} className="text-right">
                    Subtotal
                  </TableCell>
                  <TableCell>
                    {group.subtotalIssue && group.subtotalIssue.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {group.subtotalRelease && group.subtotalRelease.toFixed(2)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </Fragment>
            );
          })
        )}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        {loading ? (
          <TableRow>
            <TableCell colSpan={7}>
              <Skeleton className="w-32 h-5 bg-secondary" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-5 bg-secondary" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-5 bg-secondary" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-5 bg-secondary" />
            </TableCell>
          </TableRow>
        ) : (
          tableData.some((group) => group.isGrandTotal) && (
            <TableRow className="bg-gray-100">
              <TableCell colSpan={8} className="font-medium text-right">
                {t("common.grandTotal")}
              </TableCell>
              <TableCell className="font-mediam">
                {tableData
                  .find((group) => group.isGrandTotal)
                  .grandTotalIssue.toFixed(2)}
              </TableCell>
              <TableCell className="font-mediam">
                {tableData
                  .find((group) => group.isGrandTotal)
                  .grandTotalRelease.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          )
        )}
      </TableFooter>
    </Table>
  );
};
export default TransactionRegisterTable;
