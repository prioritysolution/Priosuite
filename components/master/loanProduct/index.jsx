"use client";

import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoanProductTable from "./LoanProductTable";
import LoanProductForm from "./LoanProductForm";

const LoanProduct = ({
  getLoading,
  postLoading,
  updateLoading,
  openDialouge,
  setOpenDialouge,
  form,
  handleSubmit,
  editData,
  handleEditData,
  currentPage,
  setCurrentPage,
  lastPage,
  pageLimit,
}) => {
  const loanProductList = useSelector(
    (state) => state?.loanProduct?.loanProductList,
  );

  const isEdit = editData && Object.keys(editData).length > 0;

  return (
    <div className="w-full h-full p-2 sm:p-5 bg-[#fefefe] rounded-lg">
      <div className="h-full w-full flex flex-col border-primary rounded-lg border-[2px] overflow-hidden">
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-border">
          <h2 className="text-lg sm:text-2xl font-semibold text-center sm:text-left">
            Loan Product
          </h2>
          <Button
            type="button"
            className="px-8 py-5 text-base self-end sm:self-auto"
            onClick={() => setOpenDialouge(true)}
          >
            Add New
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-3 sm:px-5 pb-4">
          <LoanProductTable
            data={loanProductList || []}
            handleEditData={handleEditData}
            loading={getLoading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            lastPage={lastPage}
            pageLimit={pageLimit}
          />
        </div>
      </div>

      {openDialouge ? (
        <Dialog open={openDialouge} onOpenChange={setOpenDialouge}>
          <DialogContent
            hideClose
            className="w-[calc(100vw-1rem)] max-w-5xl h-[min(92dvh,860px)] flex flex-col gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-[0_20px_50px_rgba(22,58,95,0.18)]"
          >
            <DialogHeader className="shrink-0 border-b border-[#e8eef5] bg-[#F7FAFD] px-5 py-4 text-left sm:px-6 sm:py-5">
              <DialogTitle className="text-lg font-semibold text-[#163A5F] sm:text-xl">
                {isEdit ? "Edit" : "Add"} Loan Product
              </DialogTitle>
              <DialogDescription className="mt-1 text-[13px] text-[#7A93B0]">
                {isEdit
                  ? "Update the selected loan product details below."
                  : "Fill in the details to add a new loan product."}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              <LoanProductForm
                postLoading={postLoading}
                updateLoading={updateLoading}
                form={form}
                handleSubmit={handleSubmit}
                editData={editData}
                onCancel={() => setOpenDialouge(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default LoanProduct;
