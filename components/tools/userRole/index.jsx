"use client";

import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Form, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const UserRole = ({
  // loading,
  form,
  handleSubmit,
  roleAssignList,
  openModuleId,
  setOpenModuleId,
}) => {
  const userListData = useSelector((state) => state?.userRole?.userData);

  const [parentStates, setParentStates] = useState({});

  const watchedValues = form.watch();

  useEffect(() => {
    // Dynamically calculate the states of all parent checkboxes
    const updatedStates = {};
    roleAssignList.forEach((module) => {
      const childIds = module.childLinks.map((child) => child.Id);
      const selectedValues =
        form.getValues(`moduleData_${module.Module_Id}`) || [];
      updatedStates[module.Module_Id] = childIds.every((id) =>
        selectedValues.includes(id)
      );
    });

    // Only update parentStates if there is a change
    setParentStates((prevStates) => {
      if (JSON.stringify(prevStates) !== JSON.stringify(updatedStates)) {
        return updatedStates;
      }
      return prevStates; // Prevent unnecessary re-render if the state hasn't changed
    });
  }, [watchedValues, roleAssignList, form]); // Ensure effect re-runs only when needed

  const handleParentChange = (module, checked) => {
    const childIds = module.childLinks.map((child) => child.Id);
    form.setValue(`moduleData_${module.Module_Id}`, checked ? childIds : []);
  };

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">User Role</h3>

        <ScrollArea className="w-full px-2 sm:px-10 2xl:px-20">
          <div className="w-full">
            <Form {...form}>
              <form className="" autoComplete="off">
                <div className="w-full flex gap-5">
                  <div className="w-full h-fit flex flex-col justify-start p-5 border border-primary rounded-lg gap-10">
                    <FormField
                      control={form.control}
                      name="user"
                      render={({ field }) => (
                        <DropdownField
                          label="User"
                          value={field.value}
                          onChange={field.onChange}
                          options={userListData}
                          optionLabelKey="User_Mail" // Specify the key for label
                          placeholder="Select user"
                          searchPlaceholder="Search user..."
                        />
                      )}
                    />
                    <Button
                      type="submit"
                      className="self-end w-1/2 "
                      onClick={form.handleSubmit(handleSubmit)}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="w-full border border-primary rounded-lg p-5 flex flex-col items-start gap-1">
                    <h3 className="font-semibold text-lg pb-5">Select Role</h3>
                    {roleAssignList.map((module) => {
                      const isParentChecked =
                        parentStates[module.Module_Id] || false;

                      return (
                        <Collapsible
                          key={module.Module_Id}
                          open={openModuleId.includes(module.Module_Id)}
                          onOpenChange={() => {
                            let newOpenModuleId = openModuleId.includes(
                              module.Module_Id
                            )
                              ? openModuleId.filter(
                                  (id) => id !== module.Module_Id
                                )
                              : [...openModuleId, module.Module_Id];
                            setOpenModuleId(newOpenModuleId);
                          }}
                          className="w-[350px] space-y-2"
                        >
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-3">
                              {/* Parent Checkbox */}
                              <Checkbox
                                checked={isParentChecked} // Dynamically updated from `parentStates`
                                onCheckedChange={(checked) => {
                                  handleParentChange(module, checked);
                                  setOpenModuleId((prev) =>
                                    !prev.includes(module.Module_Id)
                                      ? [...prev, module.Module_Id]
                                      : prev
                                  );
                                }}
                              />
                              <p>{module.Module_Name}</p>
                            </div>

                            {/* Plus Button for Collapse/Decollapse */}
                            <div
                              className={`w-8 h-8 rounded-full items-center flex justify-center text-primary`}
                              onClick={() => {
                                let newOpenModuleId = openModuleId.includes(
                                  module.Module_Id
                                )
                                  ? openModuleId.filter(
                                      (id) => id !== module.Module_Id
                                    )
                                  : [...openModuleId, module.Module_Id];
                                setOpenModuleId(newOpenModuleId);
                              }}
                            >
                              {openModuleId.includes(module.Module_Id) ? (
                                <FaMinusCircle />
                              ) : (
                                <FaPlusCircle />
                              )}
                            </div>
                          </div>

                          {/* Child Links */}
                          {module.childLinks.map((child) => (
                            <CollapsibleContent
                              key={child.Id}
                              className=" px-8"
                            >
                              <FormField
                                control={form.control}
                                name={`moduleData_${module.Module_Id}`}
                                render={({ field }) => (
                                  <FormItem className="flex items-end gap-3">
                                    <Checkbox
                                      checked={field.value?.includes(child.Id)} // Check if child is selected
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        const updatedValues = checked
                                          ? [...currentValues, child.Id] // Add child ID
                                          : currentValues.filter(
                                              (id) => id !== child.Id
                                            ); // Remove child ID

                                        field.onChange(updatedValues); // Update form value
                                      }}
                                    />
                                    <p className=" text-sm">
                                      {child.Menue_Name}
                                    </p>
                                  </FormItem>
                                )}
                              />
                            </CollapsibleContent>
                          ))}
                        </Collapsible>
                      );
                    })}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default UserRole;
