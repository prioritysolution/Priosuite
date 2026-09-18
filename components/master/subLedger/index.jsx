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
    <div className="w-full h-full flex justify-between p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col lg:flex-row items-center lg:items-start justify-center border-primary rounded-lg border-[2px] p-5 w-full gap-5 xl:gap-20 overflow-hidden">
        <div className="h-full w-full text-center flex flex-col items-center gap-5 overflow-y-scroll">
          <h2 className="text-lg sm:text-2xl font-semibold">{t("master.subLedger.title")}</h2>
          <div className="w-full flex items-center justify-end">
            <Button
              className="px-10 py-6 text-lg"
              onClick={() => setOpenDialouge(true)}
            >
              {t("master.subLedger.addNew")}
            </Button>
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
          </div>
          <div className=" w-[300px] sm:w-full h-full sm:overflow-y-scroll">
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
