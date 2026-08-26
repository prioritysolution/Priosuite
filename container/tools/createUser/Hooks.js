"use client";

import { useState } from "react";
import {
  getAllUserDataAPI,
  getUserRoleDataAPI,
  postNewUserAPI,
} from "./CreateUserApis";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { getAllUserData, getUserRoleData } from "./CreateUserReducer";
import getCookieData from "@/utils/getCookieData";

export const useCreateUser = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  const branchId = getCookieData("userBranchId");

  const [showForm, setShowForm] = useState(false);

  const formSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    mobile: yup.string().required("Mobile is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .test(
        "confirm-password-validation",
        "Confirm password is required and must match password",
        function (value) {
          const { password } = this.parent;
          if (!value) {
            return this.createError({
              message: "Confirm password is required",
            });
          }
          if (value !== password) {
            return this.createError({ message: "Passwords must match" });
          }
          return true;
        }
      ),
    role: yup.string().required("Role is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const handleSubmit = async (values) => {
    postNewUserApiCall(values);
  };

  const getAllUserDataApiCall = async (orgId) => {
    try {
      const res = await getAllUserDataAPI(orgId);

      if (res.message === "Data Found") {
        dispatch(getAllUserData(res.details));
      } else {
        dispatch(getAllUserData([]));
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getAllUserData([]));
    }
  };

  const getUserRoleDataApiCall = async () => {
    try {
      const res = await getUserRoleDataAPI();

      if (res.message === "Data Found") {
        dispatch(getUserRoleData(res.details));
      } else {
        dispatch(getUserRoleData([]));
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getUserRoleData([]));
    }
  };

  const postNewUserApiCall = async (item) => {
    const data = {
      user_role: item.role,
      user_name: item.name,
      user_mail: item.email,
      user_mob: item.mobile,
      user_pass: item.password,
      confirm_password: item.confirmPassword,
      org_id: orgId,
      branch_Id: branchId,
    };

    try {
      const res = await postNewUserAPI(data);

      if (res.message === "Success") {
        form.reset();
        getAllUserDataApiCall(orgId);
        setShowForm(false);
        toast.success(res.details);
      } else {
        toast.error(res.details);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return {
    getAllUserDataApiCall,
    getUserRoleDataApiCall,
    form,
    handleSubmit,
    showForm,
    setShowForm,
  };
};
