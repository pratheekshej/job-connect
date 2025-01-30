import React, { Fragment, useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosPrivate from '@/hooks/useAxiosPrivate';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { LOGO_IMG_PATH, USER_IMG_PATH } from '@/lib/utils';
import useGetUserLocation from '@/hooks/useGetUserLocation';
import { setSearchedQuery } from '@/redux/jobSlice';
import Notifications from './Notifications';
import { setCompanies } from '@/redux/companySlice';
import { removeAllStorage } from '@/hooks/useLocalStorage';

const Navbar = () => {
    const { user } = useSelector((store) => store.auth);
    const { companies } = useSelector((store) => store.company);
    const { ROUTE_PATH } = useGetUserLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [companyList, setCompanyList] = useState([]);
    const navClassName = ({ isActive }) => (isActive ? 'text-sky-600' : undefined);
    const clearSearchQuery = () => {
        dispatch(setSearchedQuery(''));
    };

    const logoutHandler = async () => {
        try {
            const res = await axiosPrivate.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true,
            });
            removeAllStorage();
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        if (user && user.role && companies && companies.length) {
            setCompanyList(companies);
            dispatch(setCompanies(companies));
        }
    }, [companies])

    return (
        <div className="top-0 z-[1] sticky bg-white shadow-md text-black">
            <div className="flex justify-between items-center mx-auto px-5 w-full h-16">
                <div className='flex items-center gap-3'>
                    <Avatar className="w-16 h-16 cursor-pointer">
                        <AvatarImage
                            src={LOGO_IMG_PATH}
                            alt="Job Connect Image"
                            title="Job Connect! You are the one"
                        />
                    </Avatar>
                    <span className='font-bold text-blue-500/100'></span>
                </div>
                <div className="flex items-center gap-4">
                    <ul className="flex items-center gap-5 font-medium">
                        {user && (user?.role === 'admin' || user?.role === 'recruiter') ? (
                            <>
                                {user?.role === 'recruiter' && (
                                    <li>
                                        <NavLink to={`${ROUTE_PATH}/companies`} className={navClassName}>
                                            Company
                                        </NavLink>
                                    </li>
                                )}
                                {user?.role === 'admin' && (
                                    <li>
                                        <NavLink to={`${ROUTE_PATH}/companies`} className={navClassName}>
                                            Companies
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink to={`${ROUTE_PATH}/jobs`} className={navClassName}>
                                        Jobs
                                    </NavLink>
                                </li>

                                {user?.role === 'admin' && (
                                    <li>
                                        <NavLink to={`${ROUTE_PATH}/jc-users`} className={navClassName}>
                                            Users
                                        </NavLink>
                                    </li>
                                )}
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/" className={navClassName}>
                                        Home
                                    </NavLink>
                                </li>
                                <li onClick={clearSearchQuery}>
                                    <NavLink to="/jobs" className={navClassName}>
                                        Jobs
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <NavLink to="/login" className={navClassName}>
                                <Button variant="outline">Login</Button>
                            </NavLink>
                            <NavLink to="/signup" className={navClassName}>
                                <Button className="bg-[#005477] hover:bg-[#004B6D]">Signup</Button>
                            </NavLink>
                        </div>
                    ) : (
                        <Fragment>
                            {
                                (user.role === 'admin' || user.role === 'jobseeker') &&
                                <Notifications companyList={companyList} />
                            }
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || USER_IMG_PATH}
                                            alt="@shadcn"
                                        />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="flex flex-col gap-2 w-80">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto || USER_IMG_PATH}
                                                alt="@shadcn"
                                            />
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium">{user?.fullname}</h4>
                                            {user?.profile?.bio &&
                                                <p className="text-muted-foreground text-sm">{user?.profile?.bio}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-gray-600">
                                        {user &&
                                            (user?.role === 'jobseeker' || user?.role === 'recruiter') && (
                                                <div
                                                    className="flex items-center gap-2 pl-2 w-fit cursor-pointer"
                                                >
                                                    <User2 />
                                                    <Button variant="link">
                                                        <Link to="/profile">View Profile</Link>
                                                    </Button>
                                                </div>
                                            )}
                                        <div
                                            className="flex items-center gap-2 pl-2 w-fit cursor-pointer"
                                        >
                                            <LogOut />
                                            <Button onClick={logoutHandler} variant="link">
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
