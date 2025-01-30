import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { axiosPublic } from "@/hooks/useAxiosPrivate";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import signupImage from "@/assets/signup.jpg"; // Image reference from: https://www.pexels.com
import { Upload } from "lucide-react"; // Import the upload icon
import usePasswordChecker from "@/hooks/usePasswordChecker";
import { setLoading } from "@/redux/authSlice";
import Anime from "../shared/Anime";

const INPUT_FIELDS = {
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "",
    file: "",
};

const CLASS_NAME = "text-black rounded-[4px] border border-gray-300 p-2 w-full transition duration-200 focus:outline-none focus:ring focus:ring-blue-500"

const Signup = () => {
    const [input, setInput] = useState(INPUT_FIELDS);
    const { loading, user } = useSelector((store) => store.auth);
    const { debouncedToastFn, isFormValid } = usePasswordChecker();
    const [formValidity, setIsFormValid] = useState(isFormValid);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) { navigate("/"); }
    }, [user, navigate]);

    useEffect(() => {
        if (input.password || input.confirmPassword) {
            setIsFormValid(input.confirmPassword === input.password);
            debouncedToastFn(input.password, input.confirmPassword); // Trigger debounced function only when input changes
        }
        return () => toast.dismiss()
    }, [input.password, input.confirmPassword]);

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
                throw new Error("Password does not match. Please try again!");
            }
            const res = await axiosPublic.post(`${USER_API_END_POINT}/register`, entries, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
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
        <div
            className="relative flex flex-col min-h-screen"
            style={{
                backgroundImage: `url(${signupImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="flex flex-col flex-1 justify-center items-center">
                <form
                    onSubmit={submitHandler}
                    className="relative bg-[#005477] bg-opacity-95 shadow-lg my-10 p-8 rounded-lg w-full max-w-md text-white"
                >
                    <Anime>
                        <h1 className="mb-4 font-bold text-2xl text-center">Sign Up</h1>
                        <div className="my-4">
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeEventHandler}
                                placeholder="Full Name"
                                className={CLASS_NAME}
                            />
                        </div>
                        <div className="my-4">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="test@gmail.com"
                                className={CLASS_NAME}
                            />
                        </div>
                        <div className="my-4">
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeEventHandler}
                                placeholder="8080808080"
                                className={CLASS_NAME}
                            />
                        </div>
                        <div className="my-4">
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Enter Password"
                                className={CLASS_NAME}
                            />
                        </div>
                        <div className="my-4">
                            <Label>Retype Password</Label>
                            <Input
                                type="password"
                                value={input.confirmPassword}
                                name="confirmPassword"
                                onChange={changeEventHandler}
                                placeholder="Confirm Password"
                                className={CLASS_NAME}
                            />
                        </div>
                        <div className="my-4">
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
                                    <Label htmlFor="jobseeker" className="text-sm">Job Seeker</Label>
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
                                    <Label htmlFor="recruiter" className="text-sm">Recruiter</Label>
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
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                            <Label className="flex items-center">
                                <Upload className="mr-2 w-5 h-5 cursor-pointer" />
                                <span>{input.file ? input.file.name : "Upload Profile Picture"}</span>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="hidden"
                                    name="file"
                                />
                            </Label>
                        </div>
                        {loading ? (
                            <Button className="bg-gradient-to-r from-black to-teal-500 hover:opacity-90 my-4 w-full transition duration-500">
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={formValidity ? false : true}
                                className="bg-black hover:bg-black-800 my-4 w-full transition duration-200"
                            >
                                Signup
                            </Button>
                        )}
                        <span className="text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-[#44c8ff] hover:underline">
                                Login
                            </Link>
                        </span>
                    </Anime>
                </form>
            </div>
        </div>
    );
};

export default Signup;
