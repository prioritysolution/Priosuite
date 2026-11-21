"use client";

import { useTranslation } from "react-i18next";
import { Trash2, List, X } from "lucide-react";

import { DatePickerField } from "@/common/formFields/DatePickerField";
import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InputField from "@/common/formFields/InputField";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import DepositInterestSlabTable from "./DepositInterestSlabTable";

const DepositInterestSetup = ({
  loading,
  handleSubmit,
  handleAddTableData,
  handleRemoveTableData,
  handleFormAction,
  openSlabListModal = false,
  setOpenSlabListModal,
  getSlabListLoading = false,
  editingSlab = null,
  handleEditSlab,
  handleCancelEdit,
  getDepositIntSlabListApiCall,
  slabCurrentPage = 1,
  setSlabCurrentPage,
  slabLastPage = 1,
  slabPageLimit = 25,
  filterProductId = 0,
  setFilterProductId,
  form,
  tableData,
  orgId,
}) => {
  const { t } = useTranslation();

  const depositInterestProductData = useSelector(
    (state) => state?.depositInterestSetup?.depositInterestProductData,
  );

  const durationUnitData = useSelector(
    (state) => state?.openDepositAccount?.durationTypeData,
  );

  const interestSlabList = useSelector(
    (state) => state?.depositInterestSetup?.interestSlabList || [],
  );

  const handleOpenListModal = () => {
    const prodIdToFetch = filterProductId || 0;
    if (getDepositIntSlabListApiCall && orgId) {
      getDepositIntSlabListApiCall(orgId, prodIdToFetch, slabCurrentPage, slabPageLimit);
    }
    setOpenSlabListModal?.(true);
  };

  const handleProductFilterChange = (prodId) => {
    const numericProdId = Number(prodId) || 0;
    setFilterProductId?.(numericProdId);
    setSlabCurrentPage?.(1);
    if (getDepositIntSlabListApiCall && orgId) {
      getDepositIntSlabListApiCall(orgId, numericProdId, 1, slabPageLimit);
    }
  };

  const handlePageChange = (page) => {
    setSlabCurrentPage?.(page);
    const prodIdToFetch = filterProductId || 0;
    if (getDepositIntSlabListApiCall && orgId) {
      getDepositIntSlabListApiCall(orgId, prodIdToFetch, page, slabPageLimit);
    }
  };

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <div className="w-full relative flex items-center justify-center border-b pb-2">
          <h3 className="text-2xl font-semibold text-center">
            {t("master.depositInterestSetup.title")}
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={handleOpenListModal}
            className="absolute right-0 border-primary text-primary hover:bg-primary/10 font-semibold gap-2 shadow-xs"
          >
            <List className="w-4 h-4" />
            <span>{t("master.depositInterestSetup.buttons.viewSlabs", "Interest Slabs List")}</span>
          </Button>
        </div>

        {/* Dialog for Slabs List */}
        <Dialog open={openSlabListModal} onOpenChange={setOpenSlabListModal}>
          <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl h-[80vh] p-4 sm:p-6 gap-4 overflow-hidden flex flex-col rounded-xl shadow-2xl bg-white">
            <DialogHeader className="shrink-0 pr-8 text-left border-b pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2.5">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <List className="w-5 h-5" />
                  </div>
                  <span>{t("master.depositInterestSetup.dialogTitle", "Deposit Interest Slabs")}</span>
                </DialogTitle>

                {/* Product Filter Dropdown inside Dialog */}
                <div className="w-full sm:w-72">
                  <DropdownField
                    label={t(
                        "master.depositInterestSetup.fields.productName",
                      )}
                    placeholder="All Products"
                    searchPlaceholder="Search product..."
                    value={filterProductId === 0 ? "" : filterProductId}
                    onChange={(val) => handleProductFilterChange(val || 0)}
                    options={[
                      { Id: 0, Option_Value: "All Products", Prd_SH_Name: "All Products" },
                      ...(depositInterestProductData || []).map((item) => ({
                        ...item,
                        Prd_SH_Name: item.Prd_SH_Name || item.Product_Name || item.Option_Value || "",
                      })),
                    ]}
                    optionLabelKey="Prd_SH_Name"
                    optionValueKey="Id"
                  />
                </div>
              </div>
            </DialogHeader>
            <div className="w-full min-h-0 flex-1 overflow-hidden flex flex-col">
              <DepositInterestSlabTable
                data={interestSlabList}
                handleEditData={handleEditSlab}
                loading={getSlabListLoading}
                currentPage={slabCurrentPage}
                setCurrentPage={handlePageChange}
                lastPage={slabLastPage}
                pageLimit={slabPageLimit}
              />
            </div>
          </DialogContent>
        </Dialog>

        <ScrollArea className="w-full h-full">
          <div className="w-full h-full flex flex-col gap-5 py-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFormAction || handleAddTableData)}
                className="w-full h-full"
                autoComplete="off"
              >
                {/* Active edit banner */}
                {editingSlab && (
                  <div className="w-full mb-3 bg-amber-50 border border-amber-300 rounded-md px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-amber-900 font-medium">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>
                        Updating Slab:{" "}
                        <strong>
                          {editingSlab?.Prd_SH_Name ||
                            editingSlab?.Product_Name ||
                            "Selected Slab"}
                        </strong>
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-7 text-xs text-amber-900 hover:bg-amber-100 flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel Edit
                    </Button>
                  </div>
                )}

                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
                    <DropdownField
                      control={form.control}
                      name="productId"
                      label={t(
                        "master.depositInterestSetup.fields.productName",
                      )}
                      options={depositInterestProductData}
                      optionLabelKey="Prd_SH_Name"
                      placeholder={t(
                        "master.depositInterestSetup.placeholders.productName",
                      )}
                      searchPlaceholder={t(
                        "master.depositInterestSetup.placeholders.searchProductName",
                      )}
                    />

                    <DatePickerField
                      control={form.control}
                      name="effectFrom"
                      label={t("master.depositInterestSetup.fields.effectFrom")}
                      startYear={2000}
                      disabledDateAfter={new Date()}
                    />

                    <InputField
                      control={form.control}
                      name="minimumDuration"
                      label={t(
                        "master.depositInterestSetup.fields.minimumDuration",
                      )}
                      placeholder={t(
                        "master.depositInterestSetup.placeholders.minimumDuration",
                      )}
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="maximumDuration"
                      label={t(
                        "master.depositInterestSetup.fields.maximumDuration",
                      )}
                      placeholder={t(
                        "master.depositInterestSetup.placeholders.maximumDuration",
                      )}
                      type="number"
                    />

                    <DropdownField
                      control={form.control}
                      name="durationUnit"
                      label={t(
                        "master.depositInterestSetup.fields.durationUnit",
                      )}
                      options={durationUnitData}
                      optionLabelKey="Option_Value"
                      placeholder={t(
                        "master.depositInterestSetup.placeholders.durationUnit",
                      )}
                      searchPlaceholder={t(
                        "master.depositInterestSetup.placeholders.searchDurationUnit",
                      )}
                    />

                    <InputField
                      control={form.control}
                      name="rateOfInterest"
                      label={t(
                        "master.depositInterestSetup.fields.rateOfInterestGeneral",
                        "Rate Of Interest (General)",
                      )}
                      placeholder={t(
                        "master.depositInterestSetup.placeholders.rateOfInterestGeneral",
                        "Enter general ROI",
                      )}
                      type="number"
                    />

                    <InputField
                      control={form.control}
                      name="srCitizenRateOfInterest"
                      label={t(
                        "master.depositInterestSetup.fields.rateOfInterestSrCitizen",
                        "Rate Of Interest (Sr Citizen)",
                      )}
                      placeholder={t(
                        "master.depositInterestSetup.placeholders.rateOfInterestSrCitizen",
                        "Enter Sr Citizen ROI",
                      )}
                      type="number"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-3 w-full">
                    {editingSlab && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-1/6"
                        onClick={handleCancelEdit}
                      >
                        {t("common.buttons.cancel", "Cancel")}
                      </Button>
                    )}
                    <Button
                      type="submit"
                      className="w-full sm:w-1/5 self-end"
                      disabled={loading}
                    >
                      {loading ? (
                        <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                      ) : editingSlab ? (
                        t("master.depositInterestSetup.buttons.update", "Update")
                      ) : (
                        t("master.depositInterestSetup.buttons.add", "Add")
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>

            {!editingSlab && (
              <div className="w-full border border-primary rounded-md">
                <ScrollArea className="w-full">
                  <Table>
                    {tableData && tableData.length !== 0 && (
                      <TableCaption className="mb-5">
                        {t("master.depositInterestSetup.table.caption")}
                      </TableCaption>
                    )}
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Sl. No.</TableHead>
                        <TableHead className="text-center">
                          {t("master.depositInterestSetup.table.productName")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("master.depositInterestSetup.table.effectFrom")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t(
                            "master.depositInterestSetup.fields.minimumDuration",
                            "Min Duration",
                          )}
                        </TableHead>
                        <TableHead className="text-center">
                          {t(
                            "master.depositInterestSetup.fields.maximumDuration",
                            "Max Duration",
                          )}
                        </TableHead>
                        <TableHead className="text-center">
                          {t(
                            "master.depositInterestSetup.fields.durationUnit",
                            "Duration Unit",
                          )}
                        </TableHead>
                        <TableHead className="text-center">
                          {t(
                            "master.depositInterestSetup.table.generalRoi",
                            "ROI (General)",
                          )}
                        </TableHead>
                        <TableHead className="text-center">
                          {t(
                            "master.depositInterestSetup.table.srCitizenRoi",
                            "ROI (Sr Citizen)",
                          )}
                        </TableHead>
                        <TableHead className="text-center w-20">
                          {t("common.action", "Action")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData && tableData.length !== 0 ? (
                        tableData.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="text-center font-medium text-slate-500">
                              {index + 1}
                            </TableCell>
                            <TableCell className="text-center font-medium text-slate-800">
                              {data.productName}
                            </TableCell>
                            <TableCell className="text-center">
                              {data.effect_frm}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {data.min_dur}
                            </TableCell>
                            <TableCell className="text-center font-mono">
                              {data.max_dur}
                            </TableCell>
                            <TableCell className="text-center">
                              {data.dur_unit_name || data.dur_unit}
                            </TableCell>
                            <TableCell className="text-center font-mono font-medium text-primary">
                              {data.general_roi || data.roi}
                            </TableCell>
                            <TableCell className="text-center font-mono font-medium text-primary">
                              {data.sr_citizen_roi || data.sr_citizen || "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemoveTableData?.(index)}
                                title={t("common.buttons.delete", "Delete")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className="h-24 text-center text-gray-500"
                          >
                            {t("master.depositInterestSetup.table.noData")}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}

            {!editingSlab && (
              <Button
                onClick={handleSubmit}
                className="w-full sm:w-1/5 self-end"
                disabled={loading || !tableData || tableData.length === 0}
              >
                {loading ? (
                  <ClipLoader color="#d7e6f4" size={20} speedMultiplier={0.7} />
                ) : (
                  t("master.depositInterestSetup.buttons.submit")
                )}
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default DepositInterestSetup;
