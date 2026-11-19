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
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg">
      <div className="h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-3 overflow-hidden">
        <h3 className="text-2xl font-semibold">{t("master.passbookSettings.title")}</h3>

        {/* Scrollable body */}
        <ScrollArea className="w-full h-full">
          <div className="w-full h-full py-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                autoComplete="off"
                className="w-full flex flex-col gap-5 justify-between"
              >
                {/* Module */}
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("master.passbookSettings.sections.module")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3">
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
                </div>

                {/* Page Size */}
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("master.passbookSettings.sections.pageSize")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Line Configuration */}
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("master.passbookSettings.sections.lineConfiguration")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Pagination */}
                <div className="w-full flex flex-col border border-primary rounded-lg p-3 sm:p-5 gap-4">
                  <div className="w-full bg-[#d7e6f4] rounded-md py-1.5 px-3">
                    <h4 className="w-full text-center text-base sm:text-lg font-bold text-[#00264d] tracking-wide">
                      {t("master.passbookSettings.sections.pagination")}
                    </h4>
                  </div>
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Button
                  type="submit"
                  className="w-full sm:w-1/5 self-end"
                  disabled={loading}
                >
                  {loading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    t("master.passbookSettings.buttons.save")
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PassbookSettings;
