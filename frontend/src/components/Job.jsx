import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { savedJobByUser, truncateDesc } from '@/lib/utils'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'

const Job = ({ job }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(job.saved || false);
    const { user } = useSelector(state => state.auth);

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }

    const saveJobforLater = async () => {
        if (job?.saved) { return; }
        try {
            const res = await savedJobByUser({ jobId: job?._id });
            if (res) {
                setIsSaved(true);
                toast.success(`Your job has been saved for later`);
            }
        } catch (error) {
            toast.error(error.message || 'Error in save for later!');
        }
    }

    return (
        <div className='z-0 border-gray-100 bg-white shadow-xl p-5 border rounded-md min-h-[250px] overflow-hidden'>
            <div className='flex justify-between items-center'>
                <p className='text-gray-500 text-sm'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                {user &&
                    <Button
                        variant="outline"
                        className="rounded-full"
                        size="icon"
                        onClick={saveJobforLater}
                    >
                        {isSaved ?
                            <BookmarkCheck /> :
                            <Bookmark />
                        }
                    </Button>
                }
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-gray-500 text-sm'>{job?.company?.location}</p>
                </div>
            </div>

            <div>
                <h1 className='my-2 font-bold text-lg'>{job?.title}</h1>
                <p className='line-clamp-3 text-gray-600 text-sm' title={job?.description}>
                    {truncateDesc(job?.description)}
                </p>
            </div>

            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} - open</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost" title={job?.jobType}>{job?.jobType}</Badge>
                <Badge className={'text-[#005477] font-bold'} variant="ghost">${job?.salary}</Badge>
            </div>

            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                {!isSaved && user &&
                    <Button
                        className="bg-[#005477]"
                        onClick={saveJobforLater}
                    >
                        Save For Later
                    </Button>
                }
            </div>
        </div>

    )
}

export default Job