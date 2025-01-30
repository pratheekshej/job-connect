import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axiosPrivate from '@/hooks/useAxiosPrivate';
import Cookies from "js-cookie";
import { COMPANY_API_END_POINT } from "@/utils/constant";


const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const { ROUTE_PATH } = useLocation();

  // Fetch the company list
  useEffect(() => {
    const token = Cookies.get("token"); // Get the token from the cookie

    axiosPrivate.get(`${COMPANY_API_END_POINT}/get`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }).then((response) => {
        console.log(response.data);
        // alert("Company details updated!");
        setCompanies(response.data.companies);
      });
  }, []);

  return (
    <div className="mx-auto p-4 container">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Companies</h1>
        <Link to={`${ROUTE_PATH}/companies/add`}>
          <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-semibold text-white">
            Add New Company
          </button>
        </Link>
      </div>

      <table className="bg-white shadow-md rounded-lg min-w-full overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Website</th>
            <th className="px-4 py-2 border">Location</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.length > 0 ? (
            companies.map((company) => (
              <tr key={company._id} className="border-t">
                <td className="px-4 py-2 border">{company.name}</td>
                <td className="px-4 py-2 border">{company.description}</td>
                <td className="px-4 py-2 border">
                  <a
                    href={company.website}
                    className="text-blue-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.website}
                  </a>
                </td>
                <td className="px-4 py-2 border">{company.location}</td>
                <td className="px-4 py-2 border">
                  <Link to={`edit/${company._id}`}>

                    <button className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-white">
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
                No companies found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;
