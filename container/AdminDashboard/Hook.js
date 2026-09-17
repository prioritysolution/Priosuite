"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export const useAdminDashboard = () => {
  const formSchema = yup.object().shape({
    branchName: yup.string().required("Branch is required"),
  });

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      branchName: "",
    },
  });

  return {
    form,
  };
};
