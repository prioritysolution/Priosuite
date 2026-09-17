"use client";
import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  getUserProfileDetailsAPI,
  updateUserProfileDetailsAPI,
} from "./ProfileApis";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [updateUserDetailsLoading, setUpdateUserDetailsLoading] =
    useState(false);

  const [userDetails, setUserDetails] = useState(null);

  const [showEditDialog, setShowEditDialog] = useState(false);

  const formSchema = yup.object({
    name: yup.string(),
    mobile: yup.string(),
    password: yup.string(),
    confirmPassword: yup
      .string()
      .test(
        "confirm-password-validation",
        "Confirm password is required and must match password",
        function (value) {
          const { password } = this.parent;
          if (password && password.length > 0) {
            if (!value) {
              return this.createError({
                message: "Confirm password is required",
              });
            }
            if (value !== password) {
              return this.createError({ message: "Passwords must match" });
            }
          }
          return true;
        }
      ),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values) => {
    updateUserProfileDetailsApiCall(values);
  };

  const getUserProfileDetailsApiCall = async () => {
    setLoading(true);
    try {
      const res = await getUserProfileDetailsAPI();
      console.log(res);

      if (res.message === "Data Found") {
        setUserDetails(res.details[0]);
        form.reset({
          name: res.details[0].User_Name || "",
          mobile: res.details[0].User_Mob || "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setUserDetails(null);
        toast.error(res.message);
        form.reset({ name: "", mobile: "", password: "", confirmPassword: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setUserDetails(null);
      form.reset({ name: "", mobile: "", password: "", confirmPassword: "" });
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfileDetailsApiCall = async (item) => {
    setUpdateUserDetailsLoading(true);

    const data = {
      user_name: item.name !== userDetails.User_Name ? item.name : "",
      user_mob: item.mobile !== userDetails.User_Mob ? item.mobile : "",
      user_pass: item.password ? item.password : "",
      confirm_password:
        item.password && item.confirmPassword ? item.confirmPassword : "",
    };

    try {
      const res = await updateUserProfileDetailsAPI(data);
      console.log(res);

      if (res.message === "Success") {
        setShowEditDialog(false);
        toast.success(res.details);
        getUserProfileDetailsApiCall();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setUpdateUserDetailsLoading(false);
    }
  };
  return {
    loading,
    updateUserDetailsLoading,
    getUserProfileDetailsApiCall,
    userDetails,
    form,
    handleSubmit,
    showEditDialog,
    setShowEditDialog,
  };
};
