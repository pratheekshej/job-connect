import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosPrivate from '@/hooks/useAxiosPrivate';
import Cookies from "js-cookie";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import useGetUserLocation from "@/hooks/useGetUserLocation";

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ROUTE_PATH } = useGetUserLocation();
  const [company, setCompany] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
  });

  useEffect(() => {
    // Fetch company details
    const token = Cookies.get("token"); // Get the token from the cookie
    axiosPrivate.get(`${COMPANY_API_END_POINT}/get/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }).then((response) => {
        setCompany(response.data.company);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const token = Cookies.get("token"); // Get the token from the cookie
    axiosPrivate.put(`${COMPANY_API_END_POINT}/update/${id}`, company, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    }).then(() => {
      alert("Company details updated!");
      navigate(`${ROUTE_PATH}/companies`);
    });
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-lg">
        <h2 className="mb-6 font-semibold text-2xl text-center">Edit Company</h2>
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

export default EditCompany;
