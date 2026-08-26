"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import InputField from "@/common/formFields/InputField";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { ClipLoader } from "react-spinners";

const ForgotPassword = ({
  form,
  loading,
  verifyOtpLoading,
  handleSubmit,
  handleVerifyOtp,
  page,
  mailVerified,
  showResendOtp,
  handleResendOtp,
}) => {
  return (
    <div className="h-full w-full flex flex-col xl:flex-row items-center justify-center relative">
      <div className="h-full w-full flex items-center justify-center relative">
        <div className="h-[300px] sm:h-[500px] xl:h-full w-full bg-primary relative flex items-center justify-center p-20 ">
          <div className="relative w-full h-full">
            <Image
              src="/prioBankLogin.png"
              // sizes="100px"
              fill
              priority
              className="object-contain"
              alt="Login Image"
            />
          </div>
        </div>
        <Image
          src="/prioritySolutionLogo.png"
          width={100}
          height={100}
          className="absolute top-5 left-2 lg:top-10 lg:left-10 h-16 sm:h-24 w-16 sm:w-24"
          alt="Login Image"
        />
      </div>
      <div className="w-full flex items-center justify-center h-full bg-secondary py-16 px-5 xl:px-10 2xl:px-20">
        <div className="w-full flex flex-col items-start justify-center gap-12 border-2 border-primary rounded-lg p-2 sm:p-10 h-full xl:h-fit">
          <div className="text-center w-full">
            <h1 className="text-4xl font-[600] mb-6 text-primary ">
              Welcome to{" "}
              <span
                className={cn(
                  "text-blue-500 text-5xl italic font-libre",
                  // fontLibre.className
                )}
              >
                PrioSuite
              </span>
            </h1>
            <p className="text-gray-800 text-xl">
              {page === 1
                ? "Please enter a valid email"
                : "Please enter code sended to your email and new password"}
            </p>
          </div>
          <div className="w-full  h-full">
            <Form {...form} className="">
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5"
                autoComplete="off"
              >
                {page === 1 ? (
                  <InputField
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="Enter your email"
                    className="bg-gray-50 h-[60px]"
                    isRequired
                  />
                ) : (
                  <>
                    <InputField
                      control={form.control}
                      name="code"
                      label="Code"
                      placeholder="Enter code"
                      type="number"
                      maxLength={6}
                      disabled={mailVerified}
                      className="bg-gray-50 h-[60px]"
                      isRequired
                      endContent={
                        <div
                          onClick={!verifyOtpLoading ? handleVerifyOtp : undefined}
                          className={cn(
                            "text-xl h-[40px] w-[40px] flex items-center justify-center text-white bg-primary rounded-md cursor-pointer",
                            { "text-green-500": mailVerified },
                            { "pointer-events-none opacity-50": verifyOtpLoading }
                          )}
                        >
                          {verifyOtpLoading ? (
                            <ClipLoader color="#d7e6f4" size={16} speedMultiplier={0.7} />
                          ) : (
                            <FaCheckCircle />
                          )}
                        </div>
                      }
                    />

                    {showResendOtp && (
                      <p
                        onClick={handleResendOtp}
                        className="text-sm cursor-pointer text-blue-500 font-medium"
                      >
                        Resend OTP
                      </p>
                    )}

                    <InputField
                      control={form.control}
                      name="password"
                      label="New Password"
                      placeholder="Enter password"
                      type="password"
                      disabled={!mailVerified}
                      className="bg-gray-50 h-[60px]"
                      isRequired
                    />

                    <InputField
                      control={form.control}
                      name="confirmPassword"
                      label="Confirm Password"
                      placeholder="Enter confirm password"
                      type="password"
                      disabled={!mailVerified}
                      className="bg-gray-50 h-[60px]"
                      isRequired
                    />
                  </>
                )}

                <div className="flex items-center justify-end">
                  <Link className=" hover:text-primary" href={`/login`}>
                    Login with us
                  </Link>
                </div>
                <div className="flex items-center justify-end w-full">
                  <Button
                    type="submit"
                    className=" w-1/2 text-lg py-6 hover:bg-primary"
                    disabled={loading || (page === 2 && !mailVerified)}
                    onClick={form.handleSubmit(handleSubmit)}
                  >
                    {loading ? (
                      <ClipLoader
                        color="#d7e6f4"
                        size={30}
                        speedMultiplier={0.7}
                      />
                    ) : page === 1 ? (
                      "Next"
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      <footer className="absolute w-full h-[50px] bottom-0 left-0 flex items-center justify-start px-2 text-sm xl:text-white">
        <p>
          Designed and Developed by{" "}
          <Link
            href={`https://prioritysolutions.in`}
            target="_blank"
            className="font-[500]"
          >
            Priority Solution
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default ForgotPassword;
