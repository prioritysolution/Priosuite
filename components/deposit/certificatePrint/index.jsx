"use client";


import { useTranslation } from "react-i18next";
import AccountPassbookSearchForm from "@/common/forms/AccountPassbookSearchForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import convertToWords from "@/utils/numberToWords";
import { format } from "date-fns";
import { useState } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const CertificatePrint = ({
  loading,
  form,
  handleSubmit,
  handleSelectAccount,
  dialougeOpen,
  setDialougeOpen,
  pageData,
  handleUpdateCertificate,
}) => {
  const { t } = useTranslation();

  const [showPrintSuccess, setShowPrintSuccess] = useState(false);

  const printRef = useRef(null);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Certificate",
    onAfterPrint: () => setShowPrintSuccess(true),
  });

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("deposit.certificatePrint.title")}</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20 ">
          <div className="w-full mb-10">
            <AccountPassbookSearchForm
              form={form}
              handleSelectClick={handleSelectAccount}
              dialougeOpen={dialougeOpen}
              setDialougeOpen={setDialougeOpen}
              showButton
              handleSubmit={handleSubmit}
              generatePDF={generatePDF}
              pageData={pageData}
            />
          </div>

          {pageData ? (
            <div className="w-full h-full flex justify-center border border-primary rounded-lg p-5 gap-5 text-sm leading-[16px]">
              <div
                className="w-[210mm] h-[297mm] p-[10mm] pl-[12mm] border border-white flex flex-col justify-end items-center gap-[13mm] font-medium"
                ref={printRef}
              >
                <div className="w-full h-[137mm] flex flex-col p-2 border border-white relative overflow-hidden">
                  {pageData && pageData?.Dup_Pr > 0 && (
                    <div className="h-[170%] w-[120%] -top-44 -left-16 absolute opacity-15 flex items-start justify-evenly flex-wrap gap-x-10 gap-y-5 -rotate-45">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <span key={i} className="font-semibold">
                          DUPLICATE
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-full h-[88px]"></div>
                  <div className="grid grid-cols-3 gap-1">
                    <Input
                      className="rounded-none border border-white h-[38px] pl-24"
                      value={pageData?.Account_No || ""}
                    />
                    <Input
                      className="rounded-none border border-white h-[38px] pl-16"
                      value={pageData?.CIF_No || ""}
                    />
                    <Input
                      className="rounded-none border border-white h-[38px] pl-10"
                      value={
                        pageData?.Opening_Date
                          ? format(pageData?.Opening_Date, "dd-MM-yyyy")
                          : ""
                      }
                    />
                  </div>
                  <div className="w-full h-[50px]"></div>
                  <div className="border border-white h-[22px]"></div>
                  <div className="h-[35px] grid grid-cols-7 text-sm">
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Opening_Date
                        ? format(pageData?.Opening_Date, "dd-MM-yyyy")
                        : ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Opening_Date
                        ? format(pageData?.Opening_Date, "dd-MM-yyyy")
                        : ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Duration || ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Maturity_Date
                        ? format(pageData?.Maturity_Date, "dd-MM-yyyy")
                        : ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.ROI || ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Mandatory_Amount || ""}
                    </div>
                    <div className="flex items-center pl-2 border-x border-white">
                      {pageData?.Maturity_Amount || ""}
                    </div>
                  </div>
                  <div className="border border-white grid grid-cols-2">
                    <div className="border-r border-white h-[38px] flex items-center pl-44">
                      {pageData?.Open_Mode || ""}
                    </div>
                    <div className="flex items-center pl-52">
                      {pageData?.Pay_Amt && Number(pageData?.Pay_Amt) > 0
                        ? pageData?.Pay_Amt
                        : ""}
                    </div>
                  </div>
                  <div className=" w-full h-[38px] flex items-end pl-28 text-sm">
                    {pageData?.Full_Name || ""}
                  </div>
                  <div className=" grid grid-cols-3 text-sm">
                    <div className="border-r border-white h-[30px] flex items-end pl-16">
                      {pageData?.Village || ""}
                    </div>
                    <div className="border-r border-white h-[30px] flex items-end pl-16">
                      {pageData?.Post || ""}
                    </div>
                    <div className=" h-[30px] flex items-end pl-16">
                      {pageData?.Dist || ""}
                    </div>
                  </div>
                  <div className=" w-full h-[32px] flex items-end pl-20 text-sm">
                    {pageData?.Mandatory_Amount
                      ? convertToWords(Number(pageData?.Mandatory_Amount)) +
                        " Only"
                      : ""}
                  </div>
                </div>
                <div className="w-full h-[137mm] flex flex-col p-2 border border-white relative overflow-hidden">
                  {pageData && pageData?.Dup_Pr > 0 && (
                    <div className="h-[170%] w-[120%] -top-44 -left-16 absolute opacity-15 flex items-start justify-evenly flex-wrap gap-x-10 gap-y-5 -rotate-45">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <span key={i} className="font-semibold">
                          DUPLICATE
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="w-full h-[88px]"></div>
                  <div className="grid grid-cols-3 gap-1">
                    <Input
                      className="rounded-none border border-white h-[38px] pl-24"
                      value={pageData?.Account_No || ""}
                    />
                    <Input
                      className="rounded-none border border-white h-[38px] pl-16"
                      value={pageData?.CIF_No || ""}
                    />
                    <Input
                      className="rounded-none border border-white h-[38px] pl-10"
                      value={
                        pageData?.Opening_Date
                          ? format(pageData?.Opening_Date, "dd-MM-yyyy")
                          : ""
                      }
                    />
                  </div>
                  <div className="w-full h-[50px]"></div>
                  <div className="border border-white h-[22px]"></div>
                  <div className="h-[35px] grid grid-cols-7 text-sm">
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Opening_Date
                        ? format(pageData?.Opening_Date, "dd-MM-yyyy")
                        : ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Opening_Date
                        ? format(pageData?.Opening_Date, "dd-MM-yyyy")
                        : ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Duration || ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Maturity_Date
                        ? format(pageData?.Maturity_Date, "dd-MM-yyyy")
                        : ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.ROI || ""}
                    </div>
                    <div className="flex items-center pl-2 border-l border-white">
                      {pageData?.Mandatory_Amount || ""}
                    </div>
                    <div className="flex items-center pl-2 border-x border-white">
                      {pageData?.Maturity_Amount || ""}
                    </div>
                  </div>
                  <div className="border border-white grid grid-cols-2">
                    <div className="border-r border-white h-[38px] flex items-center pl-44">
                      {pageData?.Open_Mode || ""}
                    </div>
                    <div className="flex items-center pl-52">
                      {pageData?.Pay_Amt && Number(pageData?.Pay_Amt) > 0
                        ? pageData?.Pay_Amt
                        : ""}
                    </div>
                  </div>
                  <div className=" w-full h-[38px] flex items-end pl-28 text-sm">
                    {pageData?.Full_Name || ""}
                  </div>
                  <div className=" grid grid-cols-3 text-sm">
                    <div className="border-r border-white h-[30px] flex items-end pl-16">
                      {pageData?.Village || ""}
                    </div>
                    <div className="border-r border-white h-[30px] flex items-end pl-16">
                      {pageData?.Post || ""}
                    </div>
                    <div className=" h-[30px] flex items-end pl-16">
                      {pageData?.Dist || ""}
                    </div>
                  </div>
                  <div className=" w-full h-[32px] flex items-end pl-20 text-sm">
                    {pageData?.Mandatory_Amount
                      ? convertToWords(Number(pageData?.Mandatory_Amount)) +
                        " Only"
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </div>
      <Dialog open={showPrintSuccess} onOpenChange={setShowPrintSuccess}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <div className="text-center text-2xl font-medium">
            <p>Did you print successfully ?</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowPrintSuccess(false)}
              className="bg-secondary text-black w-full sm:w-32"
            >
              No
            </Button>
            <Button
              onClick={() => {
                setShowPrintSuccess(false);
                handleUpdateCertificate();
              }}
              className="w-full sm:w-32"
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default CertificatePrint;
