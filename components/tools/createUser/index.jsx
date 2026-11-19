"use client";

import DropdownField from "@/common/formFields/DropdownField";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CreateUser = ({ loading, form, handleSubmit, showForm, setShowForm }) => {
  const { t } = useTranslation();

  const userData = useSelector((state) => state?.createUser?.allUserData);
  const userRoleData = useSelector((state) => state?.createUser?.userRoleData);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold text-center">
          {t("createUser.createUser")}
        </h3>

        <ScrollArea className="w-full h-full px-2">
          <div className="w-full flex flex-col gap-4 items-end">
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button>{t("createUser.addUser")}</Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    {t("createUser.addNewUser")}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col gap-4"
                    autoComplete="off"
                  >
                    <InputField
                      control={form.control}
                      name="name"
                      label={t("common.name")}
                      placeholder={t("createUser.enterName")}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="email"
                      type="email"
                      label={t("common.email")}
                      placeholder={t("createUser.enterEmail")}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="mobile"
                      label={t("common.mobile")}
                      placeholder={t("createUser.enterMobile")}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      label={t("common.password")}
                      placeholder={t("createUser.enterPassword")}
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      label={t("createUser.confirmPassword")}
                      placeholder={t("createUser.enterConfirmPassword")}
                      isRequired
                    />

                    <DropdownField
                      control={form.control}
                      name="role"
                      label={t("createUser.userRole")}
                      options={userRoleData}
                      optionLabelKey="Role_Name"
                      placeholder={t("createUser.selectRole")}
                      searchPlaceholder={t("createUser.searchRole")}
                      isRequired
                    />

                    <Button type="submit" className="w-full">
                      {t("common.add")}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-center">
                      {t("common.serialNo")}
                    </TableHead>
                    <TableHead>{t("common.name")}</TableHead>
                    <TableHead>{t("common.mail")}</TableHead>
                    <TableHead>{t("common.mobile")}</TableHead>
                    <TableHead>{t("common.role")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData &&
                    userData.length > 0 &&
                    userData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="w-[100px] text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell>{data?.User_Name}</TableCell>
                        <TableCell>{data?.User_Mail}</TableCell>
                        <TableCell>{data?.User_Mob}</TableCell>
                        <TableCell>{data?.Role_Name}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default CreateUser;
