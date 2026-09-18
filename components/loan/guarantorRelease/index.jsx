"use client";


import { useTranslation } from "react-i18next";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import LoanAccountSearchForm from "@/common/forms/LoanAccountSearchForm";
import LoanLedger from "@/common/ledger/loanLedger/LoanLedger";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import TextareaField from "@/common/formFields/TextareaField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MdDeleteForever } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GuarantorRelease = ({
  loading,
  deleteGuarantorLoading,
  form,
  handleAccountFormSubmit,
  visibleBlock,
  guarantorDetails,
  handleShowDeleteDialog,
  handleCancelDelete,
  handleConfirmDelete,
  showDeleteDialog,
  setShowDeleteDialog,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 w-full gap-2 overflow-hidden">
        <h3 className="text-2xl font-semibold ">{t("loan.guarantorRelease")}</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10">
          <div className="w-full mb-2">
            <LoanAccountSearchForm handleSubmit={handleAccountFormSubmit} />
          </div>
          <Form {...form}>
            <form
              className="w-full h-full flex flex-col gap-2 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2">
                  <h3 className="w-full text-center text-xl font-semibold">{t("loan.accountDetails")}</h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                    <InputField
                      control={form.control}
                      name="accountNo"
                      label={t("loan.accountNo")}
                      placeholder={t("loan.enterAccountNo")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="memberName"
                      label={t("loan.memberName")}
                      placeholder={t("loan.enterMemberName")}
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="gurdianName"
                      label={t("loan.gurdianName")}
                      placeholder={t("loan.enterGurdianName")}
                      readOnly
                    />

                    <TextareaField
                      control={form.control}
                      name="address"
                      label={t("loan.address")}
                      placeholder={t("loan.enterAddress")}
                      className="resize-none"
                      readOnly
                    />

                    <InputField
                      control={form.control}
                      name="mobile"
                      label={t("loan.mobileNo")}
                      placeholder={t("loan.enterMobileNo")}
                      readOnly
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
          {visibleBlock && (
            <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 py-2 gap-2 mt-2">
              <h3 className="w-full text-center text-xl font-semibold">{t("loan.guarantorDetails")}</h3>
              <div className="w-full">
                {guarantorDetails?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead align="center" className="text-center">{t("loan.slNoDot")}</TableHead>
                        <TableHead align="center" className="text-center">{t("loan.guarantorName")}</TableHead>
                        <TableHead align="center" className="text-center">{t("loan.guardianName")}</TableHead>
                        <TableHead align="center" className="text-center">{t("loan.memberNo2")}</TableHead>
                        <TableHead align="center" className="text-center">{t("loan.cIFNo2")}</TableHead>
                        <TableHead align="center" className="text-center">{t("loan.action")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guarantorDetails?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-center">
                            {index + 1}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Full_Name || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Relation_Name || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.Member_No || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            {item?.CIF_No || ""}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={() => handleShowDeleteDialog(item)}
                              className="text-2xl"
                            >
                              <MdDeleteForever />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
          <DialogHeader className={`w-full flex items-center justify-center`}>
            <DialogTitle className="text-center text-xl font-semibold">{t("loan.areYouSureYouWantToReleaseTheGuarantor")}</DialogTitle>
          </DialogHeader>
          <div className="w-full flex flex-col-reverse sm:flex-row gap-5">
            <Button
              onClick={handleCancelDelete}
              className=" w-full bg-gray-500"
            >{t("loan.cancel")}</Button>
            <Button onClick={handleConfirmDelete} className=" w-full">{t("loan.confirm")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuarantorRelease;
