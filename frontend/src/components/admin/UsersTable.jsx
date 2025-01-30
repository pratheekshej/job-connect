import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { USER_ROLE } from '@/utils/constant';

const shortlistingStatus = ["Accept", "Reject", "Edit", "Delete"];
const actionColors = {
    "Accept": (val = 500) => `text-green-${val}`,
    "Reject": (val = 500) => `text-orange-${val}`,
    "Edit": (val = 500) => `text-gray-${val}`,
    "Delete": (val = 500) => `text-red-${val}`,
}

const UsersTable = ({ selectedRole }) => {
    const { users } = useSelector(store => store.application);

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        {/* <TableHead className="text-right text-red">Action</TableHead> */}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        users &&
                        users
                            .filter((user) => (
                                (selectedRole === 'all' || user?.role === selectedRole) &&
                                user?.role !== 'admin'
                            ))
                            .map((user) => (
                                <tr key={user._id}>
                                    <TableCell>{user?.fullname}</TableCell>
                                    <TableCell>{user?.email}</TableCell>
                                    <TableCell>{user?.phoneNumber}</TableCell>
                                    <TableCell >
                                        {
                                            user.profile?.resume ?
                                                <a
                                                    className="text-blue-600 cursor-pointer"
                                                    href={user?.profile?.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {user?.profile?.resumeOriginalName}
                                                </a> :
                                                <span>NA</span>
                                        }
                                    </TableCell>
                                    <TableCell>{USER_ROLE[user?.role]}</TableCell>
                                    <TableCell>{user?.createdAt.split("T")[0]}</TableCell>
                                </tr>
                            ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default UsersTable