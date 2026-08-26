"use client";

import { useState } from "react";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import getCookieData from "@/utils/getCookieData";
import {
  getRoleModuleDataAPI,
  getRoleUserDataAPI,
  postUserRoleDataAPI,
} from "./UserRoleApis";
import { getModuleData, getUserData } from "./UserRoleReducer";

export const useUserRole = () => {
  const dispatch = useDispatch();

  const orgId = getCookieData("orgId");
  // const branchId = getCookieData("userBranchId");

  const [openModuleId, setOpenModuleId] = useState([]);

  const roleAssignList = useSelector((state) =>
    state?.userRole?.moduleData?.filter(
      (module) => module.childLinks.length > 0
    )
  );

  const formSchema = yup.object(
    roleAssignList.reduce(
      (schema, module) => {
        schema[`moduleData_${module.Module_Id}`] = yup.array().of(yup.number());
        return schema;
      },
      {
        user: yup.string().default("").required("User is required"), // Add user field with default value ""
      }
    )
  );

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: roleAssignList.reduce(
      (acc, module) => {
        acc[`moduleData_${module.Module_Id}`] = [];
        return acc;
      },
      {
        user: "", // Add user field with default value ""
      }
    ),
  });

  const handleSubmit = async (values) => {
    postUserRoleDataApiCall(values);
  };

  const postUserRoleDataApiCall = async (item) => {
    let data = {
      user_id: item.user,
      org_id: orgId,
      module_array: Object.keys(item)
        .filter((key) => key.startsWith("moduleData_")) // Filter only the moduleData keys
        .reduce((acc, key) => {
          const moduleId = key.split("_")[1]; // Extract the module id from the key
          const menueIds = item[key];

          // For each menue_id in the array, create a new object
          const moduleData = menueIds.map((menueId) => ({
            module_id: parseInt(moduleId), // Module ID as a number
            menue_id: menueId, // Menue ID from the array
          }));

          // Append the generated moduleData to the accumulator
          return [...acc, ...moduleData];
        }, []),
    };

    try {
      const res = await postUserRoleDataAPI(data);

      if (res.message === "Success") {
        toast.success(res.details);
        form.reset({
          user: "", // Reset the user field to default
          ...roleAssignList.reduce((acc, module) => {
            acc[`moduleData_${module.Module_Id}`] = []; // Reset all moduleData fields
            return acc;
          }, {}),
        });
        setOpenModuleId([]);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const getRoleUserDataApiCall = async (orgId) => {
    try {
      const res = await getRoleUserDataAPI(orgId);

      if (res.message === "Data Found") {
        dispatch(getUserData(res.details));
      } else {
        dispatch(getUserData([]));
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getUserData([]));
    }
  };

  const getRoleModuleDataApiCall = async (orgId) => {
    try {
      const res = await getRoleModuleDataAPI(orgId);

      if (res.message === "Data Found") {
        dispatch(getModuleData(res.Data));
      } else {
        dispatch(getModuleData([]));
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      dispatch(getModuleData([]));
    }
  };

  // const postNewUserApiCall = async (item) => {
  //   const data = {
  //     user_role: item.role,
  //     user_name: item.name,
  //     user_mail: item.email,
  //     user_mob: item.mobile,
  //     user_pass: item.password,
  //     confirm_password: item.confirmPassword,
  //     org_id: orgId,
  //     branch_Id: branchId,
  //   };

  //   try {
  //     const res = await postNewUserAPI(data);

  //     if (res.message === "Success") {
  //       form.reset();
  //       getAllUserDataApiCall(orgId);
  //       toast.success(res.details);
  //     } else {
  //       toast.error(res.details);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Something went wrong");
  //   }
  // };

  return {
    getRoleUserDataApiCall,
    getRoleModuleDataApiCall,
    form,
    handleSubmit,
    roleAssignList,
    openModuleId,
    setOpenModuleId,
  };
};
