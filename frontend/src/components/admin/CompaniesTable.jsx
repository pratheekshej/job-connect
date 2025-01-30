import React, { Fragment, useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { CheckCircle2, CircleArrowLeft, Delete, Edit2, MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetUserLocation from '@/hooks/useGetUserLocation'
import axiosPrivate from '@/hooks/useAxiosPrivate'
import { COMPANY_API_END_POINT, USER_API_END_POINT, USER_ROLE } from '@/utils/constant'
import { toast } from 'sonner'
import { setCompanies } from '@/redux/companySlice'
import { truncateDesc } from '@/lib/utils'

const BadgeComponent = (status) => {
    const statusCode = {
        'pending': 'Pending',
        'approved': 'Approved',
        'rejected': 'Rejected',
    };
    const component = (bg) => {
        return (
            <div className={`flex justify-center items-center ${bg} p-1 rounded-sm text-white`}>
                {statusCode[status]}
            </div>
        );
    }
    if (status === 'pending') return component('bg-orange-700')
    if (status === 'approved') return component('bg-green-700')
    if (status === 'rejected') return component('bg-red-700')
    return (
        <div className='flex justify-center items-center bg-gray-500 p-1 rounded-sm text-white'>N/A</div>
    )
}

const CompaniesTable = ({ selectedStatus }) => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const { user } = useSelector(store => store.auth);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    const { ROUTE_PATH } = useGetUserLocation();
    const dispatch = useDispatch();
    const actionClass = "flex items-center gap-2 w-fit cursor-pointer py-1";

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    // A function to fetch all companies
    const fetchCompanies = async () => {
        try {
            const res = await axiosPrivate.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setCompanies(res.data.companies));
                if (user?.role === 'recruiter') {
                    navigate(`${ROUTE_PATH}/companies/create`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const deleteCompany = async (companyId) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await axiosPrivate.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, { withCredentials: true });
                toast.success("Your company has been deleted succesfully!");
            } catch (error) {
                toast.error("Error in deleting!");
            } finally {
                fetchCompanies();
            }
        }
    }

    const approvalAction = async (userData = null, approvalStatus = 'approved') => {
        if (userData) {
            try {
                await axiosPrivate.put(`${USER_API_END_POINT}/approval/${userData._id}`, {
                    approvalStatus
                }, { withCredentials: true });
                if (approvalStatus === 'approved') {
                    toast.success("Approval successful!");
                } else if (approvalStatus === 'rejected') {
                    toast.warning("Not approved!");
                }
            } catch (error) {
                toast.error("Error in deleting!");
            } finally {
                fetchCompanies();
            }
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered company/companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>About</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                            {user?.role === 'admin' ?
                                'Created User' :
                                'User'
                            }
                        </TableHead>
                        {
                            user?.role === 'admin' &&
                            <TableHead>Role</TableHead>
                        }
                        <TableHead>Location</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany &&
                        filterCompany
                            .filter((company) => (
                                (selectedStatus === 'all' || company?.userData?.approvalStatus === selectedStatus) &&
                                ((user?.role === 'recruiter' && company?.userData?._id === user._id) || user?.role === 'admin')
                            ))
                            .map((company) => (
                                <tr key={company.name}>
                                    <TableCell className="px-4 py-2">
                                        <Avatar>
                                            <AvatarImage src={company.logo} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{company.name}</TableCell>
                                    <TableCell className="max-w-56" title={company.description}>
                                        {truncateDesc(company.description)}
                                    </TableCell>
                                    <TableCell>{BadgeComponent(company?.userData?.approvalStatus)}</TableCell>
                                    <TableCell>{company?.userData?.fullname}</TableCell>
                                    {user?.role === 'admin' &&
                                        <TableCell>{USER_ROLE[company?.userData?.role]}</TableCell>
                                    }
                                    <TableCell>{company.location}</TableCell>
                                    <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                    <TableCell className="text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                            <PopoverContent className="relative right-10 w-32">
                                                <div onClick={() => navigate(`${ROUTE_PATH}/companies/${company._id}`)} className={actionClass}>
                                                    <Edit2 className='w-4' />
                                                    <span>Edit</span>
                                                </div>
                                                {
                                                    company?.userData?.approvalStatus !== 'approved' &&
                                                    <div onClick={() => deleteCompany(company._id)} className={actionClass}>
                                                        <Delete className='w-4' />
                                                        <span>Delete</span>
                                                    </div>
                                                }
                                                {
                                                    user?.role === 'admin' &&
                                                    <Fragment>
                                                        {
                                                            company?.userData?.approvalStatus !== 'approved' &&
                                                            <div onClick={() => approvalAction(company?.userData, 'approved')} className={actionClass}>
                                                                <CheckCircle2 className='w-4' />
                                                                <span>Approve</span>
                                                            </div>
                                                        }
                                                        {
                                                            company?.userData?.approvalStatus !== 'rejected' &&
                                                            <div onClick={() => approvalAction(company?.userData, 'rejected')} className={actionClass}>
                                                                <CircleArrowLeft className='w-4' />
                                                                <span>Reject</span>
                                                            </div>
                                                        }
                                                    </Fragment>
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </tr>
                            ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable