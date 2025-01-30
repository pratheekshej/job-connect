import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { truncateDesc } from '@/lib/utils';

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const clickLatestJobDetailsNavigation = () => {
        if (user) {
            navigate(`/description/${job._id}`)
        } else {
            toast.warning("Please login with you credentials or signup to view the details!");
            return;
        }
    }

    return (
        <div onClick={clickLatestJobDetailsNavigation} className='border-gray-100 bg-white shadow-xl p-5 border rounded-md cursor-pointer'>
            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                <p className='text-gray-500 text-sm'>Canada</p>
            </div>
            <div>
                <h1 className='my-2 font-bold text-lg'>{job?.title}</h1>
                <p className='text-gray-600 text-sm' title={job?.description}>
                    {truncateDesc(job?.description)}
                </p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards