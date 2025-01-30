import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { axiosPublic } from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify"; // toast for notifications
import { FE_URL, USER_API_END_POINT } from "@/utils/constant"; // your API endpoint
import emailjs from "@emailjs/browser";
import resetImage from "@/assets/resetpwd.jpeg"; // reuse the signup background image
import { Loader2 } from "lucide-react"; // loader icon for loading state

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosPublic.post(`${USER_API_END_POINT}/reset-password`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        email,
      });

      if (res.status === 201) {
        const { token, userName } = res.data;
        await sendEmail(token)(userName);
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error("Failed to send password reset email.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = (token) => async (userName) => {
    await emailjs.send(
      import.meta.env.VITE_API_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_API_EMAILJS_TEMPLATE_ID,
      {
        from_name: 'Team Job Connect',
        to_name: userName,
        from_email: 'honeymb916@gmail.com',
        to_email: email,
        message: `${FE_URL}/change-password/${token}`,
      },
      import.meta.env.VITE_API_EMAILJS_PUBLIC_KEY
    );
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
          className="relative w-full max-w-md my-10 p-8 text-white bg-[#005477] bg-opacity-95 shadow-lg rounded-lg z-10"
          onSubmit={submitHandler}
        >
          <h1 className="font-bold text-2xl mb-6 text-center">Reset Password</h1>
          <div className="my-4">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="test@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full my-4 bg-black hover:bg-black-800 transition duration-200"
            >
              Send Reset Email
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
