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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IoSearch } from "react-icons/io5";
import { useIssueMembership } from "@/container/membership/issueMembership/Hooks";
import MemberSearchTable from "../tables/MemberSearchTable";
import getCookieData from "@/utils/getCookieData";
import { getMemberDataByName } from "@/container/membership/issueMembership/IssueMembershipReducer";

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
      <FormField
        control={form.control}
        name="memberNo"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-muted-foreground">
              {t("memberSearch.cifRefNo")}
            </FormLabel>
            <FormControl>
              <div className="relative w-full">
                <Input
                  placeholder={t("memberSearch.memberNoPlaceholder")}
                  className="w-full pr-10 h-10 rounded-lg border-border focus-visible:ring-primary/30 transition-shadow"
                  type="number"
                  onInput={(e) => {
                    if (e.target.value.length > 5) {
                      e.target.value = e.target.value.slice(0, 5);
                    }
                  }}
                  {...field}
                />
                <div className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                  <DialogTrigger asChild className="cursor-pointer text-lg">
                    <span>
                      <IoSearch />
                    </span>
                  </DialogTrigger>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
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
          className="flex flex-wrap items-center gap-x-3 gap-y-2 shrink-0"
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
            <FormField
              control={form.control}
              name="dialougeMemberName"
              render={({ field }) => (
                <FormItem className="w-full min-w-0">
                  <FormLabel>
                    {RadioData.find(
                      (item) => item.value === selectedRadio,
                    )?.label || t("memberSearch.memberName")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder={t("memberSearch.searchByMemberName")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
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
