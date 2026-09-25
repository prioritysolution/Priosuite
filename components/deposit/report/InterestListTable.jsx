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
import { format } from "date-fns";

const InterestListTable = ({
  loading,
  tableData,
  totalAmount,
  handleShowLedger,
}) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className=" text-center">{t("deposit.reports.slNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.date")}</TableHead>
          <TableHead className="">{t("deposit.reports.customerName")}</TableHead>
          <TableHead className="">{t("deposit.reports.accountNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.refAcNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.lfNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.amount")}</TableHead>
          <TableHead className="">{t("deposit.reports.narration")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableCell key={index} className="">
                    <Skeleton className="w-full h-5 bg-secondary" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : tableData.map((data, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium text-center">
                  {index + 1}
                </TableCell>
                <TableCell className="">
                  {data.Trans_Date && format(data.Trans_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleShowLedger(data.Id)}
                >
                  {data?.Full_Name}
                </TableCell>
                <TableCell className="">{data?.Account_No}</TableCell>
                <TableCell className="">{data?.Ref_Ac_No}</TableCell>
                <TableCell className="">{data?.Ledg_Folio}</TableCell>
                <TableCell className="">{data?.Amount}</TableCell>
                <TableCell className="">{data?.Narration}</TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableCell colSpan={6}>Total</TableCell>
          <TableCell>{totalAmount?.toFixed(2)}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default InterestListTable;
