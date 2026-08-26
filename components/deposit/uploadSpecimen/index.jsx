"use client";

import AccountSearchForm from "@/common/forms/AccountSearchForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { ClipLoader } from "react-spinners";
import SuccessMessage from "@/common/dialog/SuccessMessage";
import { useState } from "react";
import { useEffect } from "react";

const UploadSpecimen = ({
  loading,
  getUploadSpecimenLoading,
  postUploadSpecimenLoading,
  form,
  handleSubmit,
  handleAccountFormSubmit,
  visibleBlock,
  successMessage,
  showSuccessMessage,
  handleCloseSuccessMessage,
  photoLink,
  signatureLink,
  resetTrigger,
}) => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const watchedMemberNo = form.watch("memberNo");

  useEffect(() => {
    if (!watchedMemberNo) {
      setPhotoPreview(null);
      setSignaturePreview(null);
    }
  }, [watchedMemberNo]);

  return (
    <div className="w-full h-full flex justify-between p-1 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Upload Specimen</h3>

        <ScrollArea className="w-full h-full px-2 sm:px-10 2xl:px-20">
          <div className="w-full mb-10">
            <AccountSearchForm
              handleSubmit={handleAccountFormSubmit}
              loading={getUploadSpecimenLoading}
              resetTrigger={resetTrigger}
            />
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full h-full flex flex-col gap-10 justify-between"
              autoComplete="off"
            >
              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Basic Info Block
                  </h3>
                  {getUploadSpecimenLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <div
                          key={index}
                          className="w-full flex flex-col gap-[10px]"
                        >
                          <Skeleton className="h-4 w-28 rounded-none bg-secondary" />
                          <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-3 ">
                      <InputField
                        control={form.control}
                        name="memberNo"
                        label="Member No."
                        placeholder="Enter member no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="cifNo"
                        label="CIF No."
                        placeholder="Enter cif no."
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="memberName"
                        label="Member Name"
                        placeholder="Enter member name"
                        readOnly
                      />
                      <InputField
                        control={form.control}
                        name="gurdianName"
                        label="Gurdian Name"
                        placeholder="Enter gurdian name"
                        readOnly
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Previous Specimen
                  </h3>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-3 items-start justify-center ">
                    <div className="flex flex-col items-center gap-2 text-center font-semibold">
                      <h3>Photo</h3>

                      <div className="w-[200px] h-[200px] border border-primary mx-auto relative flex items-center justify-center">
                        {getUploadSpecimenLoading ? (
                          <ClipLoader
                            color="#00264d"
                            size={50}
                            speedMultiplier={0.7}
                          />
                        ) : (
                          <Image fill alt="Photo" src={photoLink || ""} />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-center font-semibold">
                      <h3>Signature</h3>

                      <div className="w-[200px] h-[50px] border border-primary mx-auto relative flex items-center justify-center">
                        {getUploadSpecimenLoading ? (
                          <ClipLoader
                            color="#00264d"
                            size={50}
                            speedMultiplier={0.7}
                          />
                        ) : (
                          <Image
                            fill
                            alt="Signature"
                            src={signatureLink || ""}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {visibleBlock && (
                <div className="w-full h-full flex flex-col border border-primary rounded-lg p-5 gap-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    New Specimen
                  </h3>
                  {getUploadSpecimenLoading ? (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:gap-20 gap-x-10 gap-y-3 ">
                      <div className="w-full flex flex-col gap-2 items-center">
                        <Skeleton className="w-[80px] h-5 self-start rounded-none bg-secondary" />
                        <Skeleton className="w-[200px] h-[200px] rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                      <div className="w-full flex flex-col gap-2 items-center">
                        <Skeleton className="w-[80px] h-5 self-start rounded-none bg-secondary" />
                        <Skeleton className="w-[200px] h-[200px] rounded-none bg-secondary" />
                        <Skeleton className="h-10 w-full rounded-md bg-secondary" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:gap-20 gap-x-10 gap-y-3 ">
                      <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Photo</FormLabel>
                            <div className="w-[200px] h-[200px] border border-primary mx-auto relative">
                              {photoPreview && (
                                <Image
                                  src={photoPreview}
                                  alt="Photo Preview"
                                  fill
                                />
                              )}
                            </div>
                            <FormControl>
                              <Input
                                placeholder="Upload photo"
                                type="file"
                                accept="image/*"
                                className=""
                                onChange={(e) => {
                                  handlePhotoChange(e);
                                  field.onChange(e.target.files[0]);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="signature"
                        render={({ field }) => (
                          <FormItem className="h-full flex flex-col justify-between">
                            <div>
                              <FormLabel>Signature</FormLabel>
                              <div className="w-[200px] h-[50px] border border-primary mx-auto relative">
                                {signaturePreview && (
                                  <Image
                                    src={signaturePreview}
                                    alt="Signature Preview"
                                    className=""
                                    fill
                                  />
                                )}
                              </div>
                            </div>
                            <FormControl>
                              <Input
                                placeholder="Upload signature"
                                type="file"
                                accept="image/*"
                                className=""
                                onChange={(e) => {
                                  handleSignatureChange(e);
                                  field.onChange(e.target.files[0]);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}

              {visibleBlock && (
                <Button type="submit" className="w-full sm:w-1/5 self-end">
                  {postUploadSpecimenLoading ? (
                    <ClipLoader
                      color="#d7e6f4"
                      size={20}
                      speedMultiplier={0.7}
                    />
                  ) : (
                    "Post"
                  )}
                </Button>
              )}
            </form>
          </Form>
        </ScrollArea>
      </div>
      <SuccessMessage
        successMessage={successMessage}
        showSuccessMessage={showSuccessMessage}
        handleCloseSuccessMessage={handleCloseSuccessMessage}
      />
    </div>
  );
};
export default UploadSpecimen;
