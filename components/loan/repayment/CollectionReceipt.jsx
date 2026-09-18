import { useTranslation } from "react-i18next";
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

const CollectionReceipt = ({ isOpen, setIsOpen, collectionReceiptData }) => {
  const { t } = useTranslation();

  const [orgName, setOrgName] = useState(null);
  const [orgBranch, setOrgBranch] = useState(null);
  const [orgAddress, setOrgAddress] = useState(null);
  const [orgReg, setOrgReg] = useState(null);
  const [orgLogo, setOrgLogo] = useState("");

  const printRef = useRef(null);

  const generatePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Collection Receipt",
    //   pageStyle: `
    //   body {
    //     display:flex;
    //     justify-content:flex-end;
    //   }
    // `,
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
        <DialogHeader className="justify-center text-2xl font-medium">{t("loan.collectionReceipt")}</DialogHeader>
        <Divider />
        <div className="w-full flex items-center justify-center py-4">
          <div
            ref={printRef}
            className="w-[210mm] h-[145mm] print:w-[297mm] print:h-[210mm] relative p-1"
          >
            <div className="w-full h-full print:w-[calc(210mm-8px)] print:h-[calc((297mm/2)-8px)]  print:-rotate-90 print:absolute print:bottom-[120px] print:-left-[112px] flex flex-col gap-4 justify-between scale-[.97] text-xs">
              <div className=" w-full h-full flex flex-col gap-2 border-2 border-black px-1 ">
                {orgLogo && (
                  <div className="w-full h-full absolute opacity-15 grayscale flex items-center justify-center">
                    <Image src={orgLogo} alt="" height={300} width={300} />
                  </div>
                )}
                <div className="flex flex-col justify-center w-full text-center">
                  <h3 className="font-semibold text-xl font-mono tracking-tight [word-spacing:-.25rem] uppercase">
                    {orgName || ""}
                  </h3>
                  <p className="uppercase">
                    {t("loan.branch")} - {orgBranch} | {t("loan.address")} - {orgAddress || ""}
                  </p>
                  <p className="">{orgReg || ""}</p>
                  <p className="underline text-base">{t("loan.loanCollectionReceipt")}</p>
                  <p>{t("loan.schemeName")} - {collectionReceiptData?.Prod_Name}</p>
                </div>
                <div className="w-full  flex justify-between gap-1">
                  <div className=" flex-1">
                    <p>
                      <span className="relative">
                        {t("loan.name")}
                        {Array.from({ length: 55 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-12 bottom-[.1px]">
                          {collectionReceiptData?.Member_Name}
                        </span>
                      </span>{" "}
                      <span className="relative">
                        {t("loan.receiptDate")}
                        {Array.from({ length: 22 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-24  text-nowrap bottom-[.1px]">
                          {collectionReceiptData?.Repay_Date &&
                            format(
                              collectionReceiptData?.Repay_Date,
                              "dd-MM-yyyy",
                            )}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        {t("loan.addDot")}
                        {Array.from({ length: 89 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-8 bottom-[.1px]">
                          {collectionReceiptData?.Address}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        {t("loan.acNo")}
                        {Array.from({ length: 10 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-12 bottom-[.1px]">
                          {collectionReceiptData?.Account_No}
                        </span>
                      </span>
                      <span className="relative">
                        {t("loan.disbDateDot")}
                        {Array.from({ length: 16 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20 bottom-[.1px]">
                          {collectionReceiptData?.Disburse_Date &&
                            format(
                              collectionReceiptData?.Disburse_Date,
                              "dd-MM-yyyy",
                            )}
                        </span>
                      </span>
                      <span className="relative">
                        {t("loan.finalRepayDate")}
                        {Array.from({ length: 16 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-28 bottom-[.1px]">
                          {collectionReceiptData?.Final_Repay &&
                            format(
                              collectionReceiptData?.Final_Repay,
                              "dd-MM-yyyy",
                            )}
                        </span>
                      </span>
                      <span className="relative">
                        {t("loan.pendingInst")}
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-20 bottom-[.1px]">
                          {collectionReceiptData?.Pending_Inst}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        {t("loan.totalOutstanding")}
                        {Array.from({ length: 32 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-28 bottom-[.1px]">
                          {collectionReceiptData?.Balance?.toFixed(2)}
                        </span>
                      </span>
                      <span className="relative">
                        {t("loan.currentPrincipal")}
                        {Array.from({ length: 32 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-28 bottom-[.1px]">
                          {collectionReceiptData?.CUrr_Outs?.toFixed(2)}
                        </span>
                      </span>
                    </p>
                    <p>
                      <span className="relative">
                        {t("loan.overduePrincipal")}
                        {Array.from({ length: 32 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-28 bottom-[.1px]">
                          {collectionReceiptData?.Od_Outs?.toFixed(2)}
                        </span>
                      </span>
                      <span className="relative">
                        {t("loan.overdueInterest")}
                        {Array.from({ length: 32 }).map((_, i) => (
                          <span key={i}> &#46;</span>
                        ))}
                        <span className="absolute left-28 bottom-[.1px]">
                          {collectionReceiptData?.Due_Intt?.toFixed(2)}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="h-[80px] w-[120px] border-2 border-black rounded-lg text-base ">
                    <p className=" w-full h-1/2 border-b-2 border-black text-center bg-black flex items-center justify-center text-white font-semibold">{t("loan.receiptNo")}</p>
                    <div className="flex flex-col items-center justify-center w-full h-1/2">
                      <span>{collectionReceiptData?.Receipt_No}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full border-2 border-black rounded-lg grid grid-cols-[2fr_1fr] text-sm">
                  <div className="text-center border-r-2 border-black flex flex-col">
                    <p className="h-10 border-b-2 border-black flex items-center justify-center uppercase text-base font-medium flex-shrink-0 flex-grow-0">{t("loan.particulars")}</p>
                    <div className="flex flex-col justify-between w-full h-full">
                      <div className="w-full flex flex-col items-end gap-1  px-3 pt-3">
                        {collectionReceiptData?.Curr_Prn ? (
                          <p className="">{t("loan.currentPrincipal")}</p>
                        ) : null}
                        {collectionReceiptData?.Od_Prn ? (
                          <p className="">{t("loan.overduePrincipal")}</p>
                        ) : null}
                        {collectionReceiptData?.Adv_Prn ? (
                          <p className="">{t("loan.advancePrincipal")}</p>
                        ) : null}
                        {collectionReceiptData?.Curr_Intt ? (
                          <p className="">{t("loan.currentInterest")}</p>
                        ) : null}
                        {collectionReceiptData?.Od_Intt ? (
                          <p className="">{t("loan.overdueInterest")}</p>
                        ) : null}
                      </div>
                      <div className="w-full flex flex-col items-end justify-center gap-2 flex-shrink-0 px-3 h-8  font-medium">
                        <p className="flex items-center gap-2">
                          <span className="font-normal text-xs text-end ">
                            ({t("loan.rupees")}{" "}
                            {convertToWords(
                              (collectionReceiptData?.Curr_Prn || 0) +
                                (collectionReceiptData?.Od_Prn || 0) +
                                (collectionReceiptData?.Adv_Prn || 0) +
                                (collectionReceiptData?.Curr_Intt || 0) +
                                (collectionReceiptData?.Od_Intt || 0),
                            )}{" "}
                            {t("loan.only")})
                          </span>{" "}
                          <span className="text-nowrap ">{t("loan.totalRs")}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center border-black flex flex-col">
                    <p className="h-10 border-b-2 border-black flex items-center justify-center text-base  font-medium flex-shrink-0 flex-grow-0">{t("loan.print.amount")}</p>
                    <div className=" w-full  h-full relative flex flex-col items-end">
                      <div className="w-full h-full flex flex-col items-end gap-1 pt-3 pr-14 relative">
                        {collectionReceiptData?.Curr_Prn ? (
                          <p>
                            {
                              collectionReceiptData?.Curr_Prn?.toFixed(2).split(
                                ".",
                              )[0]
                            }
                          </p>
                        ) : null}
                        {collectionReceiptData?.Od_Prn ? (
                          <p>
                            {
                              collectionReceiptData?.Od_Prn?.toFixed(2).split(
                                ".",
                              )[0]
                            }
                          </p>
                        ) : null}
                        {collectionReceiptData?.Adv_Prn ? (
                          <p>
                            {
                              collectionReceiptData?.Adv_Prn?.toFixed(2).split(
                                ".",
                              )[0]
                            }
                          </p>
                        ) : null}
                        {collectionReceiptData?.Curr_Intt ? (
                          <p>
                            {
                              collectionReceiptData?.Curr_Intt?.toFixed(
                                2,
                              ).split(".")[0]
                            }
                          </p>
                        ) : null}
                        {collectionReceiptData?.Od_Intt ? (
                          <p>
                            {
                              collectionReceiptData?.Od_Intt?.toFixed(2).split(
                                ".",
                              )[0]
                            }
                          </p>
                        ) : null}
                        <div className="h-full w-12 absolute right-0 top-0 pt-3 flex flex-col gap-1">
                          {collectionReceiptData?.Curr_Prn ? (
                            <p>
                              {
                                collectionReceiptData?.Curr_Prn?.toFixed(
                                  2,
                                ).split(".")[1]
                              }
                            </p>
                          ) : null}
                          {collectionReceiptData?.Od_Prn ? (
                            <p>
                              {
                                collectionReceiptData?.Od_Prn?.toFixed(2).split(
                                  ".",
                                )[1]
                              }
                            </p>
                          ) : null}
                          {collectionReceiptData?.Adv_Prn ? (
                            <p>
                              {
                                collectionReceiptData?.Adv_Prn?.toFixed(
                                  2,
                                ).split(".")[1]
                              }
                            </p>
                          ) : null}
                          {collectionReceiptData?.Curr_Intt ? (
                            <p>
                              {
                                collectionReceiptData?.Curr_Intt?.toFixed(
                                  2,
                                ).split(".")[1]
                              }
                            </p>
                          ) : null}
                          {collectionReceiptData?.Od_Intt ? (
                            <p>
                              {
                                collectionReceiptData?.Od_Intt?.toFixed(
                                  2,
                                ).split(".")[1]
                              }
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="h-10 w-full border-t-2 border-black flex text-sm items-center justify-end pr-14 relative">
                        <p>
                          {
                            (
                              (collectionReceiptData?.Curr_Prn || 0) +
                              (collectionReceiptData?.Od_Prn || 0) +
                              (collectionReceiptData?.Adv_Prn || 0) +
                              (collectionReceiptData?.Curr_Intt || 0) +
                              (collectionReceiptData?.Od_Intt || 0)
                            )
                              .toFixed(2)
                              .split(".")[0]
                          }
                        </p>
                        <p className="absolute right-[18px]">
                          {
                            (
                              (collectionReceiptData?.Curr_Prn || 0) +
                              (collectionReceiptData?.Od_Prn || 0) +
                              (collectionReceiptData?.Adv_Prn || 0) +
                              (collectionReceiptData?.Curr_Intt || 0) +
                              (collectionReceiptData?.Od_Intt || 0)
                            )
                              .toFixed(2)
                              .split(".")[1]
                          }
                        </p>
                      </div>
                      <div className="h-full w-[2px] bg-black absolute top-0 right-12" />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-between mb-2">
                  <div className=" flex-1 flex flex-col justify-between">
                    <div className="w-full grid grid-cols-2 pt-2">
                      <p>{t("loan.receivedMode")} {collectionReceiptData?.Mode}</p>
                      <p>{t("loan.receivedBy")} {collectionReceiptData?.Collected_By}</p>
                    </div>
                    <p className="text-nowrap">
                      {t("loan.printedOn")} {currentDate} {currentTime}
                    </p>
                  </div>
                  <div className="w-1/3 self-end">
                    <p className="w-full text-center">{t("loan.eAndOe")}</p>
                    <div className="w-full border-2 border-black rounded-xl h-[80px]">
                      <p className="bg-black text-center text-base text-white font-medium rounded-b-md w-fit px-8 pb-1 mx-auto">{t("loan.cashier")}</p>
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
          >{t("loan.cancel")}</Button>
          <Button size="lg" className="w-32" onClick={() => generatePDF()}>
            {t("loan.print")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionReceipt;
