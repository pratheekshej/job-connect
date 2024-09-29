import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const INPUT_FIELDS = {
  fullname: "",
  email: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  role: "",
  file: "",
}

const Signup = () => {
  const [input, setInput] = useState(INPUT_FIELDS);
  const { loading, user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const changeEventHandler = (e) => {
    setInput((prevInput) => ({ ...prevInput, [e.target.name]: e.target.value }));
  };

  const changeFileHandler = (e) => {
    setInput((prevInput) => ({ ...prevInput, file: e.target.files?.[0] }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (input.file) {
      formData.append("file", input.file);
    }
    const entries = Object.fromEntries(formData);

    try {
      dispatch(setLoading(true));
      if (input.password !== input.confirmPassword) {
        throw new Error('Password does not match. Please try again!');
      }
      const res = await axios.post(`${USER_API_END_POINT}/register`, entries, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <Label>Full Name</Label>
            <Input
              type="text"
              value={input.fullname}
              name="fullname"
              onChange={changeEventHandler}
              placeholder="FullName"
            />
          </div>
          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="test@gmail.com"
            />
          </div>
          <div className="my-2">
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={input.phoneNumber}
              name="phoneNumber"
              onChange={changeEventHandler}
              placeholder="8080808080"
            />
          </div>
          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter Password"
            />
          </div>
          <div className="my-2">
            <Label>Retype Password</Label>
            <Input
              type="password"
              value={input.confirmPassword}
              name="confirmPassword"
              onChange={changeEventHandler}
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2 w-auto">
                <Input
                  id="jobseeker"
                  type="radio"
                  name="role"
                  value="jobseeker"
                  checked={input.role === "jobseeker"}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-[0.85rem]"
                />
                <Label htmlFor="jobseeker">Job Seeker</Label>
              </div>
              <div className="flex items-center space-x-2 w-auto">
                <Input
                  id="recruiter"
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="recruiter">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label>Profile</Label>
              <Input
                accept="image/*"
                type="file"
                onChange={changeFileHandler}
                className="cursor-pointer"
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Signup
            </Button>
          )}
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
