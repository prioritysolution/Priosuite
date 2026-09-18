import { Button } from "@/components/ui/button";
import getCookieData from "@/utils/getCookieData";
import convertToWords from "@/utils/numberToWords";
import { Divider } from "@/components/ui/divider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdContentCut } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { useTranslation } from "react-i18next";

const VoucherReceipt = ({ isOpen, setIsOpen, receiptData }) => {
  const { t } = useTranslation();
  const [orgName, setOrgName] = useState(null);
  const [orgBranch, setOrgBranch] = useState(null);
  const [orgAddress, setOrgAddress] = useState(null);
  const [orgReg, setOrgReg] = useState(null);
  const [orgLogo, setOrgLogo] = useState("");

  const printRef = useRef(null);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: t("voucher.generalReceipt"),
    pageStyle: `
    body {
      display:flex;
      justify-content:flex-end;
    }
  `,
  });

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

  useEffect(() => {
    if (typeof window !== null) {
      setOrgName(getCookieData("userOrgName"));
      setOrgBranch(getCookieData("userBranchName"));
      setOrgAddress(getCookieData("userOrgAddress"));
      setOrgReg(getCookieData("userOrgRegistration"));
      setOrgLogo(getCookieData("userOrgLogo") || "");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100vw-1rem)] max-w-4xl max-h-[90dvh]">
        <DialogHeader className="justify-center text-2xl font-medium">
          {t("voucher.generalReceipt")}
        </DialogHeader>
        <Divider />
        <div className="w-full h-full flex items-center justify-center py-4">
          <div
            ref={printRef}
            className="w-[148mm] h-[210mm] flex items-center justify-center p-1 text-sm"
          >
            <div className=" flex flex-col gap-4 justify-between w-full  h-ful scale-[.97] text-[11px]">
              <div className="w-full flex flex-col  relative h-1/2 border-2 border-black px-1">
                {orgLogo && (
                  <div className="w-full h-full absolute opacity-15 grayscale flex items-center justify-center">
                    <Image src={orgLogo} alt="" height={300} width={300} />
                  </div>
                )}
                <div className="flex flex-col justify-center w-full text-center">
                  <h3 className="font-semibold text-lg font-mono tracking-tight [word-spacing:-.5rem] uppercase">
                    {orgName || ""}
                  </h3>
                </div>
                <div className="w-full  flex justify-between gap-1 pb-1">
                  <div className=" flex-1 flex flex-col justify-between py-1">
                    <p className="uppercase text-center">
                      {t("common.branch")} - {orgBranch} | {t("common.address")}{" "}
                      - {orgAddress || ""}
                    </p>
                    <p className=" text-center">{orgReg || ""}</p>
                    <p className="underline text-sm text-center">
                      {t("voucher.generalReceipt")}
                    </p>
                    <p>
                      <span className="relative">
                        {t("voucher.receiptDate")}
                        {Array.from({ length: 25 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-24  text-nowrap bottom-[.1px]">
                          {receiptData?.Trans_Date &&
                            format(receiptData?.Trans_Date, "dd-MM-yyyy")}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="h-[70px] w-[80px] border-2 border-black rounded-lg text-sm ">
                    <p className=" w-full h-1/2  text-center bg-black flex items-center justify-center text-white font-semibold">
                      {t("voucher.receiptNo")}
                    </p>
                    <div className="flex flex-col items-center justify-center w-full h-1/2">
                      <span>{receiptData?.Rec_No}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[130px] border-2 border-black rounded-lg grid grid-cols-[2fr_1fr]">
                  {/* First Child */}
                  <div className="text-center border-r-2 border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center uppercase text-sm font-medium flex-shrink-0 flex-grow-0">
                      {t("voucher.particulars")}
                    </p>
                    <div className="flex flex-col justify-between w-full h-full">
                      <div className="w-full flex flex-col items-start gap-[2px] flex-1  px-3 pt-[2px]">
                        <p className="flex-1 text-start leading-3 ">
                          {t("voucher.onAccount")} :{" "}
                          {receiptData?.Ledger_Name || ""}
                          {receiptData?.For_Ac
                            ? ` - ${receiptData?.For_Ac}`
                            : ""}
                        </p>
                        <p className="flex-1 text-start leading-3">
                          {t("voucher.receivedFor")} :{" "}
                          {receiptData?.Remarks || ""}
                        </p>
                      </div>
                      <div className="w-full flex items-end gap-2 flex-shrink-0 px-3 pb-[2px] h-2/5 font-medium">
                        <p className="text-left w-full flex-1">
                          <span>
                            ({t("common.rupees")}{" "}
                            {convertToWords(receiptData?.Amount || 0)}{" "}
                            {t("common.only")})
                          </span>{" "}
                        </p>
                        <span className="text-nowrap">
                          {t("common.totalRs")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Second Child with Specific Width */}
                  <div className="text-center border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center text-sm  font-medium flex-shrink-0 flex-grow-0">
                      {t("voucher.amountUpper")}
                    </p>
                    <div className=" w-full h-full relative flex flex-col items-end">
                      <div className="w-full h-full flex flex-col items-end gap-[2px] pt-[2px] pr-14 relative">
                        <p>{receiptData?.Amount?.toFixed(2).split(".")[0]}</p>
                        <p className="absolute right-5">
                          {receiptData?.Amount?.toFixed(2).split(".")[1]}
                        </p>
                      </div>
                      <div className="h-7 w-full border-t-2 border-black flex text-sm items-center justify-end pr-14 relative">
                        <p>{receiptData?.Amount?.toFixed(2).split(".")[0]}</p>
                        <p className="absolute right-[18px]">
                          {receiptData?.Amount?.toFixed(2).split(".")[1]}
                        </p>
                      </div>
                      <div className="h-full w-[2px] bg-black absolute top-0 right-12" />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between mb-2">
                  <div className=" flex-1 flex flex-col justify-between">
                    <div className="w-full grid grid-cols-2 pt-2">
                      <p>
                        {t("voucher.receivedMode")} : {receiptData?.Mode}
                      </p>
                      <p>
                        {t("voucher.receivedBy")} : {receiptData?.Received_By}
                      </p>
                    </div>
                    <p className="text-nowrap">
                      {t("common.printedOn")} : {currentDate} {currentTime}
                    </p>
                  </div>
                  <div className="w-1/3 self-end">
                    <p className="w-full text-center">{t("voucher.eAndOe")}</p>
                    <div className="w-full border-2 border-black rounded-xl h-[60px]">
                      <p className="bg-black text-center text-sm text-white font-medium rounded-b-md w-fit px-5 pb-1 mx-auto">
                        {t("voucher.cashier")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black border-dotted relative text-lg z-20">
                <MdContentCut className="absolute right-10 -top-[10px] rotate-180 " />
                <MdContentCut className="absolute left-10 -top-[10px]" />
              </div>

              <div className="w-full flex flex-col  relative h-1/2 border-2 border-black px-1">
                {orgLogo && (
                  <div className="w-full h-full absolute opacity-15 grayscale flex items-center justify-center">
                    <Image src={orgLogo} alt="" height={300} width={300} />
                  </div>
                )}
                <div className="flex flex-col justify-center w-full text-center">
                  <h3 className="font-semibold text-lg font-mono tracking-tight [word-spacing:-.5rem] uppercase">
                    {orgName || ""}
                  </h3>
                </div>
                <div className="w-full  flex justify-between gap-1 pb-1">
                  <div className=" flex-1 flex flex-col justify-between py-1">
                    <p className="uppercase text-center">
                      {t("common.branch")} - {orgBranch} | {t("common.address")}{" "}
                      - {orgAddress || ""}
                    </p>
                    <p className=" text-center">{orgReg || ""}</p>
                    <p className="underline text-sm text-center">
                      {t("voucher.generalReceipt")}
                    </p>
                    <p>
                      <span className="relative">
                        {t("voucher.receiptDate")}
                        {Array.from({ length: 25 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-24  text-nowrap bottom-[.1px]">
                          {receiptData?.Trans_Date &&
                            format(receiptData?.Trans_Date, "dd-MM-yyyy")}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="h-[70px] w-[80px] border-2 border-black rounded-lg text-sm ">
                    <p className=" w-full h-1/2  text-center bg-black flex items-center justify-center text-white font-semibold">
                      {t("voucher.receiptNo")}
                    </p>
                    <div className="flex flex-col items-center justify-center w-full h-1/2">
                      <span>{receiptData?.Rec_No}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[130px] border-2 border-black rounded-lg grid grid-cols-[2fr_1fr]">
                  {/* First Child */}
                  <div className="text-center border-r-2 border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center uppercase text-sm font-medium flex-shrink-0 flex-grow-0">
                      {t("voucher.particulars")}
                    </p>
                    <div className="flex flex-col justify-between w-full h-full">
                      <div className="w-full flex flex-col items-start gap-[2px] flex-1  px-3 pt-[2px]">
                        <p className="flex-1 text-start leading-3 ">
                          {t("voucher.onAccount")} :{" "}
                          {receiptData?.Ledger_Name || ""}
                          {receiptData?.For_Ac
                            ? ` - ${receiptData?.For_Ac}`
                            : ""}
                        </p>
                        <p className="flex-1 text-start leading-3">
                          {t("voucher.receivedFor")} :{" "}
                          {receiptData?.Remarks || ""}
                        </p>
                      </div>
                      <div className="w-full flex items-end gap-2 flex-shrink-0 px-3 pb-[2px] h-2/5 font-medium">
                        <p className="text-left w-full flex-1">
                          <span>
                            ({t("common.rupees")}{" "}
                            {convertToWords(receiptData?.Amount || 0)}{" "}
                            {t("common.only")})
                          </span>{" "}
                        </p>
                        <span className="text-nowrap">
                          {t("common.totalRs")}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Second Child with Specific Width */}
                  <div className="text-center border-black flex flex-col">
                    <p className="h-6 border-b-2 border-black flex items-center justify-center text-sm  font-medium flex-shrink-0 flex-grow-0">
                      {t("voucher.amountUpper")}
                    </p>
                    <div className=" w-full h-full relative flex flex-col items-end">
                      <div className="w-full h-full flex flex-col items-end gap-[2px] pt-[2px] pr-14 relative">
                        <p>{receiptData?.Amount?.toFixed(2).split(".")[0]}</p>
                        <p className="absolute right-5">
                          {receiptData?.Amount?.toFixed(2).split(".")[1]}
                        </p>
                      </div>
                      <div className="h-7 w-full border-t-2 border-black flex text-sm items-center justify-end pr-14 relative">
                        <p>{receiptData?.Amount?.toFixed(2).split(".")[0]}</p>
                        <p className="absolute right-[18px]">
                          {receiptData?.Amount?.toFixed(2).split(".")[1]}
                        </p>
                      </div>
                      <div className="h-full w-[2px] bg-black absolute top-0 right-12" />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between mb-2">
                  <div className=" flex-1 flex flex-col justify-between">
                    <div className="w-full grid grid-cols-2 pt-2">
                      <p>
                        {t("voucher.receivedMode")} : {receiptData?.Mode}
                      </p>
                      <p>
                        {t("voucher.receivedBy")} : {receiptData?.Received_By}
                      </p>
                    </div>
                    <p className="text-nowrap">
                      {t("common.printedOn")} : {currentDate} {currentTime}
                    </p>
                  </div>
                  <div className="w-1/3 self-end">
                    <p className="w-full text-center">{t("voucher.eAndOe")}</p>
                    <div className="w-full border-2 border-black rounded-xl h-[60px]">
                      <p className="bg-black text-center text-sm text-white font-medium rounded-b-md w-fit px-5 pb-1 mx-auto">
                        {t("voucher.cashier")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            size="lg"
            className="w-32"
          >
            {t("common.cancel")}
          </Button>
          <Button size="lg" className="w-32" onClick={() => generatePDF()}>
            {t("common.print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoucherReceipt;
