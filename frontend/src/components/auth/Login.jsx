import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import loginImage from "@/assets/login.jpg"; //Image reference from : https://www.pexels.com
import Anime from "../shared/Anime";
import { axiosPublic } from "@/hooks/useAxiosPrivate";
import { setStorageItem } from "@/hooks/useLocalStorage";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showRadios = false;

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const successHandler = (res) => {
    if (res.data.success) {
      const userData = res?.data?.user;
      const token = res?.data?.token;
      setStorageItem({token});
      dispatch(setUser(userData));
      const userRole = userData.role;
      if (userRole === "admin") {
        navigate("/admin/jc-users");
      } else if (userRole === "recruiter") {
        if (!(userData.profile && userData.profile.company)) {
          navigate("/recruiter/companies/create");
        } else {
          navigate("/recruiter/jobs");
        }
      } else {
        navigate("/");
      }
      toast.success(res.data.message);
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    let inputData = { ...input };
    if (input.email === 'admin.jobconnect@yopmail.com') {
      setInput((prevInputData) => ({ ...prevInputData, role: 'admin' }));
      inputData = { ...inputData, role: 'admin' }
    }
    try {
      dispatch(setLoading(true));
      const res = await axiosPublic.post(`${USER_API_END_POINT}/login`, inputData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      successHandler(res);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div
      className="relative flex flex-col min-h-[94vh]"
      style={{
        backgroundImage: `url(${loginImage})`, // Use the login image as the background
        backgroundSize: "cover", // Ensures the background covers the entire container
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents image from repeating
        backgroundAttachment: "fixed", // Keeps the background fixed during scroll
      }}
    >
      <div className="flex flex-col flex-1 justify-center items-center">
        <form
          onSubmit={submitHandler}
          className="relative bg-[#005477] bg-opacity-90 shadow-lg p-8 rounded-lg w-full max-w-md text-white"
        >
          <Anime>
            <h1 className="mb-6 font-bold text-2xl text-center">Login</h1>
            <div className="my-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="test@gmail.com"
                className="border-gray-300 p-2 border rounded-md focus:ring focus:ring-blue-500 w-full text-black transition duration-200 focus:outline-none"
              />
            </div>

            <div className="my-4">
              <Label>Password</Label>
              <Input
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Password"
                className="border-gray-300 p-2 border rounded-md focus:ring focus:ring-blue-500 w-full text-black transition duration-200 focus:outline-none"
              />
            </div>

            {showRadios && <div className="flex justify-between items-center my-4">
              <RadioGroup className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Input
                    id="jobseeker"
                    type="radio"
                    name="role"
                    value="jobseeker"
                    checked={input.role === "jobseeker"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Label htmlFor="jobseeker">Job Seeker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="recruiter"
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <Label htmlFor="recruiter">Recruiter</Label>
                </div>
                {/* <div className="flex items-center space-x-2">
                <Input
                  id="admin"
                  type="radio"
                  name="role"
                  value="admin"
                  checked={input.role === "admin"}
                  onChange={changeEventHandler}
                  className="w-4 h-4 cursor-pointer"
                />
                <Label htmlFor="admin">Admin</Label>
              </div> */}
              </RadioGroup>
            </div>}

            {loading ? (
              <Button className="bg-gradient-to-r from-black to-teal-500 hover:opacity-90 my-4 w-full transition duration-500">
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="bg-black hover:bg-black-700 my-4 w-full transition duration-200">
                Login
              </Button>
            )}

            {/* Aligning the account and password recovery links */}
            <div className="text-center text-sm">
              <div>
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-[#44c8ff] hover:underline">
                  Signup
                </Link>
              </div>
              <div>
                Forgot Your Password?{" "}
                <Link to="/reset-password" className="font-semibold text-[#44c8ff] hover:underline">
                  Reset Password
                </Link>
              </div>
            </div>
          </Anime>
        </form>
      </div>
    </div>
  );
};

export default Login;
