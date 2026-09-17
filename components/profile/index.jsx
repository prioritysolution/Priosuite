"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";

const Profile = ({
  loading,
  updateUserDetailsLoading,
  userDetails,
  form,
  handleSubmit,
  showEditDialog,
  setShowEditDialog,
}) => {
  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" h-full flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Profile</h3>

        <ScrollArea className="w-full px-2 sm:px-10 2xl:px-20">
          <div className="w-full xl:w-1/3 h-full flex flex-col items-center justify-center border border-primary rounded-lg sm:p-5 py-10 gap-5 mx-auto">
            {loading ? (
              <>
                <Skeleton className="w-[100px] h-[100px] rounded-full bg-secondary" />
                <Skeleton className="w-[220px] h-[20px] bg-secondary" />
                <div className="w-full grid grid-cols-2 gap-2 sm:gap-5">
                  <div className="flex flex-col gap-2 font-semibold text-right items-end">
                    <Skeleton className="w-[80px] h-[20px] bg-secondary" />
                    <Skeleton className="w-[100px] h-[20px] bg-secondary" />
                    <Skeleton className="w-[60px] h-[20px] bg-secondary" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-[120px] h-[20px] bg-secondary" />
                    <Skeleton className="w-[80px] h-[20px] bg-secondary" />
                    <Skeleton className="w-[60px] h-[20px] bg-secondary" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-[100px] h-[100px] rounded-full bg-secondary flex items-center justify-center text-5xl font-semibold text-primary">
                  {userDetails &&
                    userDetails.User_Name &&
                    userDetails.User_Name.charAt(0)}
                </div>
                <p className="font-semibold italic text-gray-400">
                  {userDetails?.User_Mail}
                </p>
                <div className="w-full grid grid-cols-2 gap-2 sm:gap-5">
                  <div className="flex flex-col gap-2 font-semibold text-right">
                    <p>Name :</p>
                    <p>Contact :</p>
                    <p>Role :</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>{userDetails?.User_Name}</p>
                    <p>{userDetails?.User_Mob}</p>
                    <p>{userDetails?.Role_Name}</p>
                  </div>
                </div>
              </>
            )}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="w-full flex flex-col gap-5"
                      autoComplete="off"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter mobile" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter confirm password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="w-full flex items-center justify-center gap-y-5">
                        <Button
                          type="submit"
                          className="w-full"
                          // disabled={
                          //   Number(cashInTransactionGrandTotal) -
                          //     Number(cashOutTransactionGrandTotal) !==
                          //   Number(form.getValues("openingAmount"))
                          // }
                        >
                          Save changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
export default Profile;
