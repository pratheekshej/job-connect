import React, { Fragment, useEffect, useState } from 'react'
import { USER_API_END_POINT, USER_ROLE } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/redux/applicationSlice';
import UsersTable from './UsersTable';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import axiosPrivate from '@/hooks/useAxiosPrivate';

const JCUsers = () => {
    const dispatch = useDispatch();
    const { users } = useSelector(store => store.application);
    const jobRoles = ["jobseeker", "recruiter", "all"];
    const [selectedRole, setSelectedRole] = useState('all');

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axiosPrivate.get(`${USER_API_END_POINT}/users`, { withCredentials: true });
                dispatch(setUsers(res.data.users));
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
        fetchAllApplicants();
    }, []);

    return (
        <Fragment>
            <div className='flex justify-between items-center w-full'>
                <h1 className='my-5 font-bold text-xl'>Users ({users?.length})</h1>
                <Select onValueChange={(e) => setSelectedRole(e)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {jobRoles.map((role) => {
                                return (
                                    <SelectItem
                                        key={role}
                                        value={role?.toLowerCase()}
                                    >
                                        {USER_ROLE[role]}
                                    </SelectItem>
                                )
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {users && <UsersTable selectedRole={selectedRole} />}
        </Fragment>
    )
}

export default JCUsers