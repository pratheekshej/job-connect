import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "./shared/Footer";
import "./Admin.css"; // Add custom styles
import { useSelector } from "react-redux";

const Admin = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="admin-layout">
      <div className="admin-container">
        <nav className="sidebar">
          <ul>
            <li>
              <NavLink
                to="companies"
                className={({ isActive }) => isActive ? "active-link" : undefined}
              >
                {user && user?.role === "admin" && "Companies"}
                {user && user?.role === "recruiter" && "Company"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="jobs"
                className={({ isActive }) => isActive ? "active-link" : undefined}
              >
                Jobs
              </NavLink>
            </li>
            {
              user && user?.role === "admin" &&
              <li>
                <NavLink
                  to="jc-users"
                  className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                  Users
                </NavLink>
              </li>
            }
          </ul>
        </nav>
        <div className='px-8 p-5 w-[calc(100%-250px)] min-h-screen'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
