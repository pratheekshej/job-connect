import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from '@/hooks/useAxiosPrivate';
import Cookies from "js-cookie";
import { USER_API_END_POINT } from "@/utils/constant";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    role: "",
  });

  // Fetch user details by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token"); // Get the token from the cookie
        const { data } = await axiosPrivate.get(`${USER_API_END_POINT}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}`, } // Include the token in the Authorization header
        });
        if (data.success) {
          setUser({
            fullname: data.user.fullname,
            email: data.user.email,
            phoneNumber: data.user.phoneNumber,
            role: data.user?.role,
          });
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`${USER_API_END_POINT}/users/${id}/edit`, user);
      navigate("/admin/users"); // Redirect to user listing page after successful edit
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-3xl">
        <h2 className="mb-6 font-semibold text-3xl text-center text-gray-800">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={user.fullname}
              onChange={handleChange}
              required
              className="border-gray-300 px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring focus:ring-blue-200 w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="border-gray-300 px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring focus:ring-blue-200 w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={user.phoneNumber}
              onChange={handleChange}
              required
              className="border-gray-300 px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring focus:ring-blue-200 w-full"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">Role</label>
            <select
              name="role"
              value={user?.role}
              onChange={handleChange}
              required
              className="border-gray-300 px-4 py-3 border focus:border-blue-500 rounded-lg focus:ring focus:ring-blue-200 w-full"
            >
              <option value="jobseeker">Jobseeker</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg focus:ring-4 focus:ring-blue-300 text-white focus:outline-none transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
