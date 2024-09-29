import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "react-toastify"; // assuming you have toast for notifications
import { USER_API_END_POINT } from "@/utils/constant"; // your API endpoint
import emailjs from "@emailjs/browser";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass the email and the function name (for example: "NotionMagicLinkEmail")
      const res = await axios.post(`${USER_API_END_POINT}/reset-password`, {
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
    // Send email using EmailJS
    await emailjs.send(
      import.meta.env.VITE_API_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_API_EMAILJS_TEMPLATE_ID,
      {
        from_name: 'Team Job Connect',
        to_name: userName,
        from_email: 'honeymb916@gmail.com',
        to_email: email,
        message: `http://localhost:5173/change-password/${token}`,
      },
      import.meta.env.VITE_API_EMAILJS_PUBLIC_KEY
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
          onSubmit={submitHandler}
        >
          <h1 className="font-bold text-xl mb-5">Reset Password</h1>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="test@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {loading ? (
            <Button className="w-full my-4">Please wait...</Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Send Reset Email
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
