import React, { useEffect, useState } from "react";
import axiosPrivate from '@/hooks/useAxiosPrivate';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Fetch all job applications
    axiosPrivate.get("/api/admin/applications").then((response) => {
      setApplications(response.data);
    });
  }, []);

  const handleStatusChange = (applicationId, newStatus) => {
    axios
      .patch(`/api/admin/application/${applicationId}`, { status: newStatus })
      .then((response) => {
        // Update the local application state with new status
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );
      });
  };

  return (
    <div>
      <h2>Job Applications</h2>
      <ul>
        {applications.map((application) => (
          <li key={application._id}>
            <p>Applicant: {application.applicant.fullname}</p>
            <p>Job: {application.job.title}</p>
            <p>Status: {application.status}</p>
            <select
              value={application.status}
              onChange={(e) =>
                handleStatusChange(application._id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobApplications;
