import { useTranslation } from "react-i18next";
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

const DisburseRegisterTable = ({
  loading,
  tableData,
  totalDisburseAmount,
  totalShareAmount,
  totalInsAmount,
  totalMisAmount,
  totalNetDisburse,
  handleShowLedger,
}) => {
  const { t } = useTranslation();

  return (
    <Table className="min-w-[1000px] whitespace-nowrap">
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className=" text-center">{t("loan.slNo")}</TableHead>
          <TableHead className="">{t("loan.date")}</TableHead>
          <TableHead className="">{t("loan.customerName")}</TableHead>
          <TableHead className="">{t("loan.gurdianName")}</TableHead>
          <TableHead className="">{t("loan.accountNo")}</TableHead>
          <TableHead className="">{t("loan.refAcNo")}</TableHead>
          <TableHead className="">{t("loan.disburse")}</TableHead>
          <TableHead className="">{t("loan.share")}</TableHead>
          <TableHead className="">{t("loan.insAmt")}</TableHead>
          <TableHead className="">{t("loan.misAmt")}</TableHead>
          <TableHead className="">{t("loan.netDisburse")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 11 }).map((_, index) => (
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
                  {data.Disb_Date && format(data.Disb_Date, "dd-MM-yyyy")}
                </TableCell>
                <TableCell
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleShowLedger(data.Id)}
                >
                  {data?.Full_Name}
                </TableCell>
                <TableCell className="">{data?.Relation_Name}</TableCell>
                <TableCell className="">{data?.Account_No}</TableCell>
                <TableCell className="">{data?.Ref_Ac_No}</TableCell>
                <TableCell className="">{data?.Disb_Amt}</TableCell>
                <TableCell className="">{data?.Share_Amt}</TableCell>
                <TableCell className="">{data?.Ins_Amt}</TableCell>
                <TableCell className="">{data?.Mis_Amt}</TableCell>
                <TableCell className="">{data?.Net_Disburse}</TableCell>
              </TableRow>
            ))}
      </TableBody>
      <TableFooter className="sticky bottom-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableCell colSpan={6}>{t("loan.total")}</TableCell>
          <TableCell>{totalDisburseAmount?.toFixed(2)}</TableCell>
          <TableCell>{totalShareAmount?.toFixed(2)}</TableCell>
          <TableCell>{totalInsAmount?.toFixed(2)}</TableCell>
          <TableCell>{totalMisAmount?.toFixed(2)}</TableCell>
          <TableCell>{totalNetDisburse?.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
export default DisburseRegisterTable;
