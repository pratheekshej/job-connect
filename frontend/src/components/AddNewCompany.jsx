import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosPrivate from '@/hooks/useAxiosPrivate';
import Cookies from "js-cookie";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import useGetUserLocation from "@/hooks/useGetUserLocation";

const AddNewCompany = () => {
  const navigate = useNavigate();
  const { ROUTE_PATH } = useGetUserLocation();
  const [company, setCompany] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };


  const handleSave = async () => {
    console.log("company", company);
    // throw new Error("Not implemented");

    const token = Cookies.get("token"); // Get the token from the cookie
    try {
      await axiosPrivate.post(
        `${COMPANY_API_END_POINT}/register`,
        company,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      alert("New company added!");
      navigate(`${ROUTE_PATH}/companies`);
    } catch (error) {
      console.error("Error adding company:", error);
      alert("Failed to add company. Please check your input and try again.");
    }
  };


  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <h2 className="mb-6 font-semibold text-2xl text-center">Add New Company</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium text-gray-700 text-sm">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={company.name}
              onChange={handleInputChange}
              className="block border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full"
              placeholder="Enter company name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block font-medium text-gray-700 text-sm">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              value={company.description}
              onChange={handleInputChange}
              className="block border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full"
              placeholder="Enter company description"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="website" className="block font-medium text-gray-700 text-sm">
              Website
            </label>
            <input
              type="text"
              name="website"
              id="website"
              value={company.website}
              onChange={handleInputChange}
              className="block border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full"
              placeholder="Enter company website"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block font-medium text-gray-700 text-sm">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={company.location}
              onChange={handleInputChange}
              className="block border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full"
              placeholder="Enter company location"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block font-medium text-gray-700 text-sm">
              Logo URL
            </label>
            <input
              type="text"
              name="logo"
              id="logo"
              value={company.logo}
              onChange={handleInputChange}
              className="block border-gray-300 shadow-sm mt-1 p-2 border rounded-md w-full"
              placeholder="Enter company logo url"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCompany;
