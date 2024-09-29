import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/change-password`, {
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
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
          onSubmit={submitHandler}
        >
          <h1 className="font-bold text-xl mb-5">Change Password</h1>
          <div className="my-2">
            <Label>New Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="my-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {loading ? (
            <Button className="w-full my-4">Please wait...</Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Change Password
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
