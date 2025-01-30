import { BellIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies } from '@/hooks/useGetAllCompanies';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { getAllJobsPostedToday, getUserById, updateCompaniesViewedByUser, updateJobsViewedByUser } from '@/lib/utils';
import { setUser } from '@/redux/authSlice';
import { useNavigate } from 'react-router-dom';
import useGetUserLocation from '@/hooks/useGetUserLocation';
import { Dot } from 'lucide-react';

const Notifications = () => {

    const { user } = useSelector((store) => store.auth);
    const { ROUTE_PATH } = useGetUserLocation();
    const [notificationList, setNotificationList] = useState([]);
    const [hasNotifications, setHasNotifications] = useState(true);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const openNotifs = async () => {
        let notifDataList = [];
        const isNotifLoaded = () => {
            setHasNotifications(false);
            if (notifDataList.length) { setHasNotifications(true); }
            setNotificationList(notifDataList);
            setLoading(false);
        }
        try {
            if (user?.role === 'admin') {
                setLoading(true);
                const userData = await getUserById(user._id);
                dispatch(setUser(userData));
                const companyList = await fetchCompanies();
                const { companiesViewed = [] } = userData;
                notifDataList = companyList.filter((notification) => {
                    const pendingStatus = (notification?.userData?.approvalStatus === 'pending');
                    if (companiesViewed && companiesViewed.length) {
                        const companyIndex = companiesViewed.findIndex(
                            (companyId) => notification?.userData?.company === companyId
                        )
                        if (companyIndex < 0 && pendingStatus) {
                            return true;
                        }
                    } else if (companiesViewed && !companiesViewed.length && pendingStatus) {
                        return true;
                    }
                    return false;
                });
                isNotifLoaded();
            } else if (user?.role === 'jobseeker') {
                setLoading(true);
                const userData = await getUserById(user._id);
                const jobData = await getAllJobsPostedToday();
                const { jobsViewed = [] } = userData;
                notifDataList = jobData.filter((notification) => {
                    if (jobsViewed && jobsViewed.length) {
                        const companyIndex = jobsViewed.findIndex((jobId) => notification?._id === jobId)
                        if (companyIndex < 0) { return true; }
                    } else if (jobsViewed && !jobsViewed.length) {
                        return true;
                    }
                    return false;
                });
                isNotifLoaded();
            }
        } catch (error) {
            console.error(error);
            isNotifLoaded();
            setLoading(false);
        }
    }

    const viewNotification = async (notification = null) => {
        if (notification) {
            if (user?.role === 'admin') {
                await updateCompaniesViewedByUser({ companyId: notification._id });
                navigate(`${ROUTE_PATH}/companies`);
                dispatch(setSearchCompanyByText(notification?.name || ''));
            } else if (user?.role === 'jobseeker') {
                await updateJobsViewedByUser({ jobId: notification._id });
                navigate(`/description/${notification?._id}`);
            }
        }
    }

    const getNotificationName = (notification = null) => {
        let name = '';
        if (notification) {
            name = notification.name || notification.title;
        }
        if (user?.role === 'admin') {
            return `${name} - pending approval`;
        } else if (user?.role === 'jobseeker') {
            return <>{name}{notification?.company?.name ? <span className='text-blue-500'>{` - ${notification?.company?.name}`}</span> : ''}</>;
        }
        return name;
    }

    const getNotificationType = (
        user?.role === 'admin' ? 'Pending Approvals' : 'Latest Jobs Posted'
    )

    return (
        <Popover>
            <PopoverTrigger asChild className="hover:cursor-pointer" onClick={openNotifs}>
                <div className='relative'>
                    {hasNotifications && <Dot className='top-[-18px] right-[-13px] absolute w-8 h-8 text-blue-600' />}
                    <BellIcon height={20} width={20} />
                </div>
            </PopoverTrigger>
            <PopoverContent className="relative top-3 right-16 w-80">
                {loading && <div>Loading...</div>}
                {
                    !loading &&
                    notificationList.length > 0 &&
                    <div className='flex flex-col gap-2'>
                        <h2 className='flex justify-center items-center font-normal'>{getNotificationType}</h2>
                        {notificationList.map(notification => (
                            <div
                                key={notification._id}
                                className='font-medium text-[rgb(194_65_12)] italic cursor-pointer 65'
                                onClick={() => viewNotification(notification)}
                            >
                                {getNotificationName(notification)}
                            </div>
                        ))}
                    </div>
                }
                {
                    !loading &&
                    notificationList.length === 0 &&
                    <div>You have no Notifications to view!</div>
                }
            </PopoverContent>
        </Popover>
    )
}

export default Notifications
