import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from '@/hooks/useAxiosPrivate';
import { USER_API_END_POINT } from "@/utils/constant";

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axiosPrivate.get(`${USER_API_END_POINT}/users`);
        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Handle edit button click
  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6 min-h-screen">
      <div className="bg-white shadow-md rounded-lg w-full max-w-4xl overflow-hidden">
        <h2 className="py-6 border-b font-semibold text-2xl text-center text-gray-800">User List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 text-sm uppercase leading-normal">
                <th className="px-6 py-3 text-left">Full Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone Number</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {users.map((user) => (
                <tr key={user._id} className="border-gray-200 hover:bg-gray-100 border-b">
                  <td className="px-6 py-3 text-left">{user.fullname}</td>
                  <td className="px-6 py-3 text-left">{user.email}</td>
                  <td className="px-6 py-3 text-left">{user.phoneNumber}</td>
                  <td className="px-6 py-3 text-left">{user?.role}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white transition duration-300"
                      onClick={() => handleEdit(user._id)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
