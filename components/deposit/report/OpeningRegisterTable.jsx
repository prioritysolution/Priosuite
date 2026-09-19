import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const OpeningRegisterTable = ({ loading, tableData, handleShowLedger }) => {
  const { t } = useTranslation();

  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background z-10">
        <TableRow className="bg-gray-100">
          <TableHead className=" text-center">{t("deposit.reports.slNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.date")}</TableHead>
          <TableHead className="">{t("deposit.reports.customerName")}</TableHead>
          <TableHead className="">{t("deposit.reports.guardianName")}</TableHead>
          <TableHead className="">{t("deposit.reports.accountNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.refAcNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.lfNo")}</TableHead>
          <TableHead className="">{t("deposit.reports.nominee")}</TableHead>
          <TableHead className="">{t("deposit.reports.operationMode")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-y-scroll">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 9 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex} className="">
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
                  {data.Opening_Date && format(data.Opening_Date, "dd-MM-yyyy")}
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
                <TableCell className="">{data?.Ledg_Folio}</TableCell>
                <TableCell className="">{data?.Nominee_Name}</TableCell>
                <TableCell className="">{data?.Operation_Mode}</TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
};

export default OpeningRegisterTable;
