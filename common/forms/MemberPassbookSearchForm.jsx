"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form } from "@/components/ui/form";
import InputField from "../formFields/InputField";
import { IoSearch } from "react-icons/io5";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import MemberSearchTable from "../tables/MemberSearchTable";
import getCookieData from "@/utils/getCookieData";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";
import { premiumRadioGroup } from "../formFields/fieldStyles";

const MemberPassbookSearchForm = ({
  form,
  handleSelectClick,
  dialougeOpen,
  setDialougeOpen,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");

  const {
    getMemberListDataLoading,
    getMemberDataByNameApiCall,
    currentMemberPage,
    setCurrentMemberPage,
    lastMemberPage,
  } = useIssueMembership();

  const RadioData = [
    { label: t("memberSearch.individualCustomer"), value: "1" },
    { label: t("memberSearch.group"), value: "2" },
    { label: t("memberSearch.institution"), value: "3" },
    { label: t("memberSearch.staff"), value: "4" },
  ];

  const [selectedRadio, setSelectedRadio] = useState("1");

  const handleSearchMember = (e) => {
    e?.preventDefault?.();
    if (!orgId) return;
    if (form.getValues("dialougeMemberName")) {
      if (currentMemberPage === 1) {
        getMemberDataByNameApiCall(
          orgId,
          1,
          form.getValues("dialougeMemberName"),
          selectedRadio || "1",
        );
      } else {
        setCurrentMemberPage(1);
      }
    } else {
      toast.error(t("memberSearch.pleaseEnterName"));
    }
  };

  const memberDataByName = useSelector(
    (state) => state?.issueMembership?.memberDataByName,
  );

  const handleDialogueOpenChange = (open) => {
    if (open) {
      form.setValue("dialougeMemberName", "");
      setCurrentMemberPage(1);
      dispatch(getMemberDataByName([]));
    } else {
      dispatch(getMemberDataByName([]));
    }
    setDialougeOpen(open);
  };

  useEffect(() => {
    if (!dialougeOpen || !orgId) return;
    const name = form.getValues("dialougeMemberName");
    if (!name) return;
    getMemberDataByNameApiCall(
      orgId,
      currentMemberPage,
      name,
      selectedRadio || "1",
    );
  }, [currentMemberPage]);

  useEffect(() => {
    if (!dialougeOpen) return;
    dispatch(getMemberDataByName([]));
    setCurrentMemberPage(1);
  }, [selectedRadio]);

  return (
    <Dialog open={dialougeOpen} onOpenChange={handleDialogueOpenChange}>
      <InputField
        control={form.control}
        name="memberNo"
        label={t("memberSearch.cifRefNo")}
        placeholder={t("memberSearch.memberNoPlaceholder")}
        type="number"
        onInput={(e) => {
          if (e.target.value.length > 5) {
            e.target.value = e.target.value.slice(0, 5);
          }
        }}
        endContent={
          <DialogTrigger
            asChild
            className="cursor-pointer text-lg text-muted-foreground hover:text-primary transition-colors"
          >
            <span>
              <IoSearch />
            </span>
          </DialogTrigger>
        }
      />

      <DialogContent className="w-[calc(100vw-1rem)] max-w-[1000px] h-[min(90dvh,640px)] sm:h-auto sm:max-h-[85vh] p-3 sm:p-6 gap-3 overflow-hidden flex flex-col rounded-lg">
        <DialogHeader className="shrink-0 pr-8 text-left">
          <DialogTitle className="text-base sm:text-lg">
            {t("memberSearch.searchMembers")}
          </DialogTitle>
        </DialogHeader>

        <RadioGroup
          defaultValue="1"
          value={selectedRadio}
          onValueChange={setSelectedRadio}
          className={premiumRadioGroup()}
        >
          {RadioData.map((item, index) => (
            <div className="flex items-center gap-2 min-w-0" key={index}>
              <RadioGroupItem
                value={item.value}
                id={`passbook-${item.value}`}
              />
              <Label
                htmlFor={`passbook-${item.value}`}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="w-full min-h-0 flex-1 flex flex-col gap-3 overflow-hidden">
          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-end gap-2 sm:gap-x-4 shrink-0">
            <InputField
              control={form.control}
              name="dialougeMemberName"
              label={
                RadioData.find((item) => item.value === selectedRadio)
                  ?.label || t("memberSearch.memberName")
              }
              autoComplete="off"
              placeholder={t("memberSearch.searchByMemberName")}
            />
            <Button
              type="button"
              className="w-full sm:w-auto px-6 sm:px-10 shrink-0"
              onClick={handleSearchMember}
            >
              {t("memberSearch.search")}
            </Button>
          </div>
          <div className="w-full min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <MemberSearchTable
              loading={getMemberListDataLoading}
              data={memberDataByName}
              handleSelectData={handleSelectClick}
              currentMemberPage={currentMemberPage}
              setCurrentMemberPage={setCurrentMemberPage}
              lastMemberPage={lastMemberPage}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberPassbookSearchForm;
