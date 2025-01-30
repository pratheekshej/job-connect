import React, { useEffect, useState } from "react";

import axiosPrivate from '@/hooks/useAxiosPrivate';

const CompanyDetails = () => {
  const [company, setCompany] = useState({
    name: "",
    address: "",
    website: "",
  });

  useEffect(() => {
    // Fetch company details
    axiosPrivate.get("/api/v1/company/get").then((response) => {
      setCompany(response.data);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axiosPrivate.put("/api/admin/company", company).then((response) => {
      alert("Company details updated!");
    });
  };

  return (
    <div>
      <h2>Company Details</h2>
      <div>
        <label>Name: </label>
        <input
          type="text"
          name="name"
          value={company.name}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Address: </label>
        <input
          type="text"
          name="address"
          value={company.address}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Website: </label>
        <input
          type="text"
          name="website"
          value={company.website}
          onChange={handleInputChange}
        />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default CompanyDetails;
