import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import { fetchCompanies } from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setCompanies, setSearchCompanyByText } from '@/redux/companySlice'
import { Fragment } from 'react'
import useGetUserLocation from '@/hooks/useGetUserLocation'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { RefreshCwIcon } from 'lucide-react'

const Companies = () => {
    const [input, setInput] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentCompany, setCurrentCompany] = useState(null);
    const { ROUTE_PATH } = useGetUserLocation();
    const { companies } = useSelector(state => state.company);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const STATUSES = ["all", "pending", "rejected", "approved",];
    const approvalStatuses = {
        'pending': 'Pending',
        'rejected': 'Rejected',
        'approved': 'Approved',
        'all': 'All',
    }

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    useEffect(() => {
        const getCompanyList = async () => {
            const companyList = await fetchCompanies();
            if (companyList && companyList.length) {
                dispatch(setCompanies(companyList));
                const company = companyList?.find(company => (company?.userData?._id === user._id));
                setCurrentCompany(company);
                if (user?.role === 'recruiter' && !company) {
                    navigate(`${ROUTE_PATH}/companies/create`);
                }
            }
        }
        getCompanyList();
    }, [])

    return (
        <Fragment>
            {user?.role === 'admin' && <h1 className='my-5 font-bold text-xl'>List of companies enrolled ({companies?.length})</h1>}
            {
                user?.role === 'recruiter' &&
                currentCompany &&
                <h1 className='my-5 font-bold text-xl'>
                    {currentCompany?.name} | {currentCompany?.location}
                </h1>
            }
            {
                user?.role === 'recruiter' &&
                !companies?.length &&
                <h1 className='my-5 font-bold text-xl'>Company - N/A</h1>
            }
            {
                (user?.role === 'admin' || user?.role === 'recruiter') &&
                <div className='flex justify-between items-center my-5'>
                    {
                        user?.role === 'admin' &&
                        <div className='flex items-center gap-2 cursor-pointer'>
                            <Input
                                className="w-fit"
                                placeholder="Filter by name"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <RefreshCwIcon onClick={() => setInput('')} />
                        </div>
                    }
                    {
                        user?.role === 'admin' &&
                        <Select onValueChange={(e) => setSelectedStatus(e)} defaultValue='all'>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {STATUSES.map((status) => {
                                        return (
                                            <SelectItem
                                                key={status}
                                                value={status?.toLowerCase()}
                                            >
                                                {approvalStatuses[status]}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    }
                    {
                        (user?.role === 'recruiter' && !currentCompany) &&
                        <Button type="button" onClick={() => navigate(`${ROUTE_PATH}/companies/create`)}>New Company</Button>
                    }
                </div>
            }
            <CompaniesTable selectedStatus={selectedStatus} />
        </Fragment>
    )
}

export default Companies