import AdminJobs from "@/components/admin/AdminJobs";
import Applicants from "@/components/admin/Applicants";
import Companies from "@/components/admin/Companies";
import CompanyCreate from "@/components/admin/CompanyCreate";
import CompanySetup from "@/components/admin/CompanySetup";
import JCUsers from "@/components/admin/JCUsers";
import PostJob from "@/components/admin/PostJob";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import ChangePassword from "@/components/auth/ChangePassword";
import Login from "@/components/auth/Login";
import ResetPassword from "@/components/auth/ResetPassword";
import Signup from "@/components/auth/Signup";
import Browse from "@/components/Browse";
import Home from "@/components/Home";
import JobDescription from "@/components/JobDescription";
import Jobs from "@/components/Jobs";
import Profile from "@/components/Profile";
import Navbar from "@/components/shared/Navbar";
import { Fragment } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";

const HeaderNav = () => {
    return (
        <Fragment>
            <Navbar />
            <Outlet />
        </Fragment>
    )
}

export const adminRecruiterRoutes = ([
    {
        path: "companies",
        element: <Companies />
    },
    {
        path: "companies/create",
        element: <CompanyCreate />
    },
    {
        path: "companies/:id",
        element: <CompanySetup />
    },
    {
        path: "jc-users",
        element: <JCUsers />
    },
    {
        path: "jobs",
        element: <AdminJobs />
    },
    {
        path: "jobs/create",
        element: <PostJob />
    },
    {
        path: "jobs/:id",
        element: <PostJob />
    },
    {
        path: "jobs/:id/applicants",
        element: <Applicants />
    },
]);

export const publicRoutes = ([
    {
        path: "",
        element: <Home />,
    },
    {
        path: "reset-password",
        element: <ResetPassword />,
    },
    {
        path: "change-password/:token",
        element: <ChangePassword />,
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'signup',
        element: <Signup />
    },
    {
        path: "jobs",
        element: <Jobs />
    },
    {
        path: "description/:id",
        element: <JobDescription />
    },
    {
        path: "browse",
        element: <Browse />
    },
    {
        path: "profile",
        element: <Profile />
    },
    {
        path: "/admin",
        element: <ProtectedRoute />, // Wrapping all /admin routes with ProtectedRoute
        children: adminRecruiterRoutes
    },
    {
        path: "/recruiter",
        element: <ProtectedRoute />, // Wrapping all /recruiter routes with ProtectedRoute
        children: adminRecruiterRoutes
    }
]);

export const appRoutes = createBrowserRouter([
    {
        path: "/",
        element: <HeaderNav />,
        children: publicRoutes
    },
])