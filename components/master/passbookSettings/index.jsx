// "use client";

// import DropdownField from "@/common/formFields/DropdownField";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import InputField from "@/common/formFields/InputField";
// import { useSelector } from "react-redux";
// import { ClipLoader } from "react-spinners";

// const PassbookSettings = ({
//   loading, form, handleSubmit }) => {
//   const moduleData = useSelector(
//     (state) => state?.passbookSettings?.moduleData,
//   );

//   return (
//     <div className="w-full h-full flex justify-between p-5 bg-[#fefefe] rounded-lg ">
//       <div className=" flex flex-col items-center border-primary rounded-lg border-[2px] p-5 w-full gap-5 h-full overflow-hidden">
//         <h3 className="text-2xl font-semibold">Passport Settings</h3>
//         <div className="w-full px-2 sm:px-10 2xl:px-20 overflow-y-scroll  h-full py-5 flex items-start justify-center">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(handleSubmit)}
//               className="w-[500px]  flex flex-col gap-10 p-5 rounded-md border border-primary"
//               autoComplete="off"
//             >
//               <div className="grid grid-cols-1 gap-5 gap-y-5 w-full ">
//                 <DropdownField
//                   control={form.control}
//                   name="moduleId"
//                   label={t("master.passbookSettings.fields.module")}
//                   options={moduleData}
//                   optionLabelKey="Module_Name"
//                   placeholder={t("master.passbookSettings.placeholders.module")}
//                   searchPlaceholder={t("master.passbookSettings.placeholders.searchModule")}
//                 />

//                 <InputField
//                   control={form.control}
//                   name="pageHeight"
//                   label="Page Height (In CM)"
//                   placeholder="Enter page height"
//                   type="number"
//                 />

//                 <InputField
//                   control={form.control}
//                   name="pageWidth"
//                   label="Page Width (In CM)"
//                   placeholder="Enter page width"
//                   type="number"
//                 />

//                 <InputField
//                   control={form.control}
//                   name="firstPageTop"
//                   label={t("master.passbookSettings.fields.firstPageTop")}
//                   placeholder="Enter first page top"
//                   type="number"
//                 />

//                 <InputField
//                   control={form.control}
//                   name="firstPageLine"
//                   label="Line In First Page"
//                   placeholder="Enter line in first page"
//                   type="number"
//                 />

//                 <InputField
//                   control={form.control}
//                   name="secondPageLine"
//                   label="Line In Second Page"
//                   placeholder="Enter line in second page"
//                   type="number"
//                 />

//                 <InputField
//                   control={form.control}
//                   name="middlePageGap"
//                   label="Gap In Middle Page"
//                   placeholder="Enter gap in middle page"
//                   type="number"
//                 />

//                 <InputField
//                   control={form.control}
//                   name="nextPageGap"
//                   label="Gap Of Next Page"
//                   placeholder="Enter gap of next page"
//                   type="number"
//                 />
//               </div>
//               <div className="w-full flex items-center justify-end">
//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? (
//                     <ClipLoader
//                       color="#d7e6f4"
//                       size={20}
//                       speedMultiplier={0.7}
//                     />
//                   ) : (
//                     "Add"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default PassbookSettings;


"use client";

import { useTranslation } from "react-i18next";

import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 mt-1">
    {children}
  </p>
);

const Divider = () => <hr className="border-border" />;

const PassbookSettings = ({ loading, form, handleSubmit }) => {
  const { t } = useTranslation();
  const moduleData = useSelector(
    (state) => state?.passbookSettings?.moduleData,
  );

  return (
    <div className="w-full h-full   bg-muted/30 rounded-xl">
      <div className="flex flex-col h-full rounded-xl border border-primary/30 bg-background shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-background">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            {t("master.passbookSettings.title")}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("master.passbookSettings.subtitle")}
          </p>
        </div>

        {/* Scrollable body */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="px-4 sm:px-6 lg:px-10 py-6 flex justify-center">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                autoComplete="off"
                className="w-full  flex flex-col gap-7"
              >
                {/* Module */}
                <div className="md:w-1/2 w-full">
                  <SectionLabel>{t("master.passbookSettings.sections.module")}</SectionLabel>
                  <DropdownField
                    control={form.control}
                    name="moduleId"
                    label={t("master.passbookSettings.fields.module")}
                    options={moduleData}
                    optionLabelKey="Module_Name"
                    placeholder={t("master.passbookSettings.placeholders.module")}
                    searchPlaceholder={t("master.passbookSettings.placeholders.searchModule")}
                  />
                </div>

                <Divider />

                {/* Page Size */}
                <div>
                  <SectionLabel>{t("master.passbookSettings.sections.pageSize")}</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      control={form.control}
                      name="pageHeight"
                      label={t("master.passbookSettings.fields.pageHeight")}
                      placeholder={t("master.passbookSettings.placeholders.pageHeight")}
                      type="number"
                    />
                    <InputField
                      control={form.control}
                      name="pageWidth"
                      label={t("master.passbookSettings.fields.pageWidth")}
                      placeholder={t("master.passbookSettings.placeholders.pageWidth")}
                      type="number"
                    />
                  </div>
                </div>

                <Divider />

                {/* Line Configuration */}
                <div>
                  <SectionLabel>{t("master.passbookSettings.sections.lineConfiguration")}</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      control={form.control}
                      name="firstPageTop"
                      label={t("master.passbookSettings.fields.firstPageTop")}
                      placeholder={t("master.passbookSettings.placeholders.firstPageTop")}
                      type="number"
                    />
                    <InputField
                      control={form.control}
                      name="firstPageLine"
                      label={t("master.passbookSettings.fields.linesFirstPage")}
                      placeholder={t("master.passbookSettings.placeholders.linesFirstPage")}
                      type="number"
                    />
                    <InputField
                      control={form.control}
                      name="secondPageLine"
                      label={t("master.passbookSettings.fields.linesSecondPage")}
                      placeholder={t("master.passbookSettings.placeholders.linesSecondPage")}
                      type="number"
                    />
                    <InputField
                      control={form.control}
                      name="middlePageGap"
                      label={t("master.passbookSettings.fields.gapMiddlePage")}
                      placeholder={t("master.passbookSettings.placeholders.gapMiddlePage")}
                      type="number"
                    />
                  </div>
                </div>

                <Divider />

                {/* Pagination */}
                <div>
                  <SectionLabel>{t("master.passbookSettings.sections.pagination")}</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                      control={form.control}
                      name="nextPageGap"
                      label={t("master.passbookSettings.fields.gapNextPage")}
                      placeholder={t("master.passbookSettings.placeholders.gapNextPage")}
                      type="number"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 pb-4 flex justify-end">
                  <Button
                    type="submit"
                    className="h-10 px-8 font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={18}
                        speedMultiplier={0.7}
                      />
                    ) : (
                      t("master.passbookSettings.buttons.save")
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PassbookSettings;
