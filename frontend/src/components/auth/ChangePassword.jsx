import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import axiosPrivate from '@/hooks/useAxiosPrivate';
import { toast } from "react-toastify";
import { toast as sonnerToast } from 'sonner';
import { useParams, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { Loader2 } from "lucide-react"; // loader icon for loading state
import resetImage from "@/assets/resetpwd.jpeg"; // the background image for ResetPassword
import usePasswordChecker from "@/hooks/usePasswordChecker";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { debouncedToastFn, isFormValid } = usePasswordChecker();
  const [formValidity, setIsFormValid] = useState(isFormValid);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (password || confirmPassword) {
      setIsFormValid(confirmPassword === password);
      debouncedToastFn(password, confirmPassword); // Trigger debounced function only when input changes
    }
    return () => sonnerToast.dismiss()
  }, [password, confirmPassword]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosPrivate.post(`${USER_API_END_POINT}/change-password`, {
        password,
        token,
      });

      if (res.status === 201) {
        toast.success("Password changed successfully! Please log in.");
        navigate("/login");
      } else {
        toast.error("Failed to change password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${resetImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col justify-center items-center flex-1">
        <form
          onSubmit={submitHandler}
          className="relative w-full max-w-md my-10 p-8 text-white bg-[#005477] bg-opacity-95 shadow-lg rounded-lg z-10"
        >
          <h1 className="font-bold text-2xl mb-6 text-center">Change Password</h1>
          <div className="my-4">
            <Label>New Password</Label>
            <Input
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              className="text-black rounded-md border border-gray-300 p-2 w-full transition duration-200 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="my-4">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="text-black rounded-md border border-gray-300 p-2 w-full transition duration-200 focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <Button className="w-full my-4 bg-gradient-to-r from-black to-teal-500 hover:opacity-90 transition duration-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={formValidity ? false : true}
              className="w-full my-4 bg-black hover:bg-black-800 transition duration-200"
            >
              Change Password
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
