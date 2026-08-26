"use client";

import DropdownField from "@/common/formFields/DropdownField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

const CreateUser = ({ loading, form, handleSubmit, showForm, setShowForm }) => {
  const userData = useSelector((state) => state?.createUser?.allUserData);
  const userRoleData = useSelector((state) => state?.createUser?.userRoleData);

  return (
    <div className="w-full h-full flex justify-between p-2 lg:p-5 bg-[#fefefe] rounded-lg ">
      <div className=" flex flex-col justify-start items-center border-primary rounded-lg border-[2px] p-2 lg:p-5 w-full gap-5 overflow-hidden">
        <h3 className="text-2xl font-semibold ">Create User</h3>

        <ScrollArea className="w-full px-2 sm:px-10 2xl:px-20">
          <div className="w-full flex flex-col gap-5 items-end">
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="">Add User</Button>
              </DialogTrigger>
              <DialogContent className="w-[calc(100vw-1rem)] sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Add New User
                  </DialogTitle>
                </DialogHeader>
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email"
                              {...field}
                            />
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

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <DropdownField
                          label="User Role"
                          value={field.value}
                          onChange={field.onChange}
                          options={userRoleData}
                          optionLabelKey="Role_Name" // Specify the key for label
                          placeholder="Select role"
                          searchPlaceholder="Search role..."
                        />
                      )}
                    />

                    <Button type="submit" className="w-full">
                      Add
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <div className="w-full flex flex-col border border-primary rounded-lg p-5 gap-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-center">
                      Serial No.
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mail</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Role</TableHead>
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
