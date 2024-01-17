import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminHeader from "./components/AdminHeader";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../services/index/apiService";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const { data, isLoading, error } = useQuery({
    queryFn: () => {
      return getUserProfile({ token: userState.userInfo.token });
    },
    queryKey: ["profile"],
    onSuccess: (data) => {
      if (!data?.admin) {
        navigate("/");
        toast.error("You are not authorized to access this route.");
      }
    },
    onError: (err) => {
      navigate("/");
      toast.error("You are not authorized to acess this route.");
    },
  });
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span className="loading loading-dots loading-lg text-black" />
      </div>
    );
  }
  return (
    <div className=" flex h-screen flex-col lg:flex-row">
      <AdminHeader />
      <main className="flex-1 bg-[#E2E0DD] p-4 lg:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
