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
import { useTranslation } from "react-i18next";

const DetailedListTable = ({ tableData, handleShowLedger, loading }) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className="text-center">{t("investment.slNo")}</TableHead>
          <TableHead className="">{t("investment.openingDate")}</TableHead>
          <TableHead className="">{t("common.bankName")}</TableHead>
          <TableHead className="">{t("common.accountNo")}</TableHead>
          <TableHead className="">{t("common.accountType")}</TableHead>
          <TableHead className="">{t("investment.invest")}</TableHead>
          <TableHead className="">{t("investment.roi")}</TableHead>
          <TableHead className="">{t("investment.matureDate")}</TableHead>
          <TableHead className="">{t("investment.provIntt")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading ? (
          <>
            <TableRow>
              <TableCell colSpan={9} className="">
                <Skeleton className="w-40 h-5 bg-secondary mx-auto" />
              </TableCell>
            </TableRow>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <TableCell key={index} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow className="font-medium">
              <TableCell colSpan={5} className="text-right ">
                <Skeleton className="w-32 h-5 bg-secondary" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-full h-5 bg-secondary" />
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Skeleton className="w-full h-5 bg-secondary" />
              </TableCell>
            </TableRow>
          </>
        ) : (
          tableData.map((group, groupIndex) => {
            // Check to skip rendering the last group for the table body (the one that contains the grand total)
            if (groupIndex === tableData.length - 1) return null;

            return (
              <Fragment key={groupIndex}>
                {/* Subheader for Group */}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={9} className="font-medium text-center">
                    {t("common.gl")} - {group.transactions[0].Ledger_Name}
                  </TableCell>
                </TableRow>
                {/* Rows for Transactions */}
                {group.transactions &&
                  group.transactions.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-center">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        {data.Opening_Date &&
                          format(data.Opening_Date, "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleShowLedger(data.Id)}
                      >
                        {data.Bank_Name}
                      </TableCell>
                      <TableCell>{data.Account_No}</TableCell>
                      <TableCell>{data.Acct_Type}</TableCell>
                      <TableCell>{data.Invest_Amt}</TableCell>
                      <TableCell>{data.Roi}</TableCell>
                      <TableCell>
                        {data.Mature_Date &&
                          format(data.Mature_Date, "dd-MM-yyyy")}
                      </TableCell>
                      <TableCell>{data.Prov_Intt}</TableCell>
                    </TableRow>
                  ))}
                {/* Subtotal Row */}
                <TableRow className="bg-gray-50 font-medium">
                  <TableCell colSpan={5} className="text-right">
                    {t("common.subtotal")}
                  </TableCell>
                  <TableCell>{group.subtotalInvest.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{group.subtotalProvIntt.toFixed(2)}</TableCell>
                </TableRow>
              </Fragment>
            );
          })
        )}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        {loading ? (
          <TableRow className="">
            <TableCell colSpan={5}>
              <Skeleton className="w-32 h-5 bg-secondary" />
            </TableCell>
            <TableCell>
              <Skeleton className="w-full h-5 bg-secondary" />
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Skeleton className="w-full h-5 bg-secondary" />
            </TableCell>
          </TableRow>
        ) : (
          tableData.some((group) => group.isGrandTotal) && (
            <TableRow className="bg-gray-100">
              <TableCell colSpan={5} className="font-medium text-right">
                {t("common.grandTotal")}
              </TableCell>
              <TableCell className="font-medium">
                {tableData
                  .find((group) => group.isGrandTotal)
                  .grandTotalInvest.toFixed(2)}
              </TableCell>
              <TableCell className="font-medium"></TableCell>
              <TableCell className="font-medium"></TableCell>
              <TableCell className="font-medium">
                {tableData
                  .find((group) => group.isGrandTotal)
                  .grandTotalProvIntt.toFixed(2)}
              </TableCell>
            </TableRow>
          )
        )}
      </TableFooter>
    </Table>
  );
};
export default DetailedListTable;
