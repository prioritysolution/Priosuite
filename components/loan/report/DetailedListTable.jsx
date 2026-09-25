import { useEnglishOnly as useTranslation } from "@/i18n/useEnglishOnly";
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
import { formatDateForDisplay } from "@/utils/dateHelpers";

const DetailedListTable = ({
  loading,
  tableData,
  totalOpening,
  totalDisburse,
  totalPrn,
  totalIntt,
  totalCurrOuts,
  totalOdOuts,
  totalCurrIntt,
  totalOdIntt,
  handleShowLedger,
}) => {
  const { t } = useTranslation();

  return (
    <Table className="min-w-[1100px] border whitespace-nowrap">
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="border bg-gray-100">
          <TableHead rowSpan={2} className="text-center">{t("loan.slUpper")}</TableHead>
          <TableHead rowSpan={2} className="border">{t("loan.customerName")}</TableHead>
          <TableHead rowSpan={2} className="border">{t("loan.guardianName")}</TableHead>
          <TableHead rowSpan={2} className="border">{t("loan.accountNoShort")}</TableHead>
          <TableHead rowSpan={2} className="border">{t("loan.loanDate")}</TableHead>
          <TableHead rowSpan={2} className="border">{t("loan.opening")}</TableHead>
          <TableHead rowSpan={2} className="border">{t("loan.disburse")}</TableHead>
          <TableHead colSpan={2} className="border text-center">{t("loan.repayment")}</TableHead>
          <TableHead colSpan={2} className="border text-center">{t("loan.outstanding")}</TableHead>
          <TableHead colSpan={2} className="text-center">{t("loan.outsInterest")}</TableHead>
        </TableRow>
        <TableRow className="border bg-gray-100">
          <TableHead className="border">{t("loan.principal")}</TableHead>
          <TableHead className="border">{t("loan.interest")}</TableHead>
          <TableHead className="border">{t("loan.current")}</TableHead>
          <TableHead className="border">{t("loan.overdue")}</TableHead>
          <TableHead className="border">{t("loan.current")}</TableHead>
          <TableHead className="">{t("loan.overdue")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 13 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : tableData.map((data, index) => (
              <TableRow key={data?.Acct_Id || index}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleShowLedger(data.Acct_Id || data.Id)}
                >
                  {data?.Full_Name}
                </TableCell>
                <TableCell>
                  {data?.Guardian_Name || data?.Relation_Name}
                </TableCell>
                <TableCell>{data?.Account_No}</TableCell>
                <TableCell>
                  {formatDateForDisplay(data?.Disb_Date)}
                </TableCell>
                <TableCell>
                  {data?.Opening_Balance || data?.Opening}
                </TableCell>
                <TableCell>{data?.Disb_Amt || data?.Disb}</TableCell>
                <TableCell>
                  {data?.Principal_Paid || data?.Paid_Prn}
                </TableCell>
                <TableCell>
                  {data?.Interest_Paid || data?.Paid_Intt}
                </TableCell>
                <TableCell>
                  {data?.Current_Principal || data?.Curr_Outs}
                </TableCell>
                <TableCell>
                  {data?.Overdue_Principal || data?.OD_Outs}
                </TableCell>
                <TableCell>
                  {data?.Current_Interest || data?.Curr_Intt}
                </TableCell>
                <TableCell>
                  {data?.Overdue_Interest || data?.OD_Intt}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableCell colSpan={5}>{t("loan.total")}</TableCell>
          <TableCell>{totalOpening?.toFixed(2)}</TableCell>
          <TableCell>{totalDisburse?.toFixed(2)}</TableCell>
          <TableCell>{totalPrn?.toFixed(2)}</TableCell>
          <TableCell>{totalIntt?.toFixed(2)}</TableCell>
          <TableCell>{totalCurrOuts?.toFixed(2)}</TableCell>
          <TableCell>{totalOdOuts?.toFixed(2)}</TableCell>
          <TableCell>{totalCurrIntt?.toFixed(2)}</TableCell>
          <TableCell>{totalOdIntt?.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default DetailedListTable;
