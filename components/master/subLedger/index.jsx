"use client";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import SubLedgerTable from "./SubLedgerTable";
import SubLedgerForm from "./SubLedgerForm";

const SubLedger = ({
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
}) => {
  const { t } = useTranslation();

  const subLedgerListData = useSelector(
    (state) => state?.subLedger?.subLedgerData,
  );

  const headListData = useSelector((state) => state?.subLedger?.headData);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <div className="w-full min-h-0 flex flex-col items-center gap-3 overflow-y-auto">
          <div className="shrink-0 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <h2 className="text-lg sm:text-2xl font-semibold text-center sm:text-left">
              {t("master.subLedger.title")}
            </h2>
            <Button
              className="px-8 py-5 text-base self-end sm:self-auto"
              onClick={() => setOpenDialouge(true)}
            >
              {t("master.subLedger.addNew")}
            </Button>
          </div>
          <Modal
            isOpen={openDialouge}
            onOpenChange={setOpenDialouge}
            size="md"
            scrollBehavior="inside"
            placement="center"
            backdrop="opaque"
            isDismissable={false}
            radius="sm"
            // isKeyboardDismissDisabled
          >
            <ModalContent>
              <ModalHeader>
                {editData ? t("common.buttons.edit") + " " : t("common.buttons.add") + " "}
                {t("master.subLedger.title")}
              </ModalHeader>
              <ModalBody>
                <SubLedgerForm
                  postLoading={postLoading}
                  updateLoading={updateLoading}
                  form={form}
                  handleSubmit={handleSubmit}
                  editData={editData}
                  headListData={headListData}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
          <div className="w-full h-full min-h-0 overflow-y-auto">
            <SubLedgerTable
              data={subLedgerListData || []}
              handleEditData={handleEditData}
              loading={getLoading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              lastPage={lastPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubLedger;
