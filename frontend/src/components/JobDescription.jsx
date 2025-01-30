import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import axiosPrivate from '@/hooks/useAxiosPrivate';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const navigate = useNavigate();
    const jobId = params.id;
    const dispatch = useDispatch();

    const formatDesc = (description = '') => (
        description?.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
        ))
    )

    const applyJobHandler = async () => {
        try {
            if (user && user.role === 'jobseeker') {
                if(!user?.profile?.resume) {
                    toast.warning('Your profile is incomplete! Please update your profile and apply.');
                    return;
                }
            }
            const res = await axiosPrivate.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true); // Update the local state
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axiosPrivate.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
                const msg = error?.response?.data?.message;
                toast.error(msg ? msg : error?.message);
                navigate(-1);
            }
        }
        fetchSingleJob();
    }, [jobId]);

    return (
        <div className='mx-auto my-10 max-w-7xl'>
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#005477] font-bold'} variant="ghost">${singleJob?.salary}</Badge>
                    </div>
                </div>
                <Button
                    onClick={isApplied ? null : applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#005477] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                </Button>
            </div>
            <h1 className='py-4 border-b-2 border-b-gray-300 font-medium'>Job Description</h1>
            <div className='my-4'>
                <h1 className='my-1 font-bold'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='my-1 font-bold'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='my-1 font-bold'>Description: <span className='pl-4 font-normal text-gray-800'>{formatDesc(singleJob?.description)}</span></h1>
                <h1 className='my-1 font-bold'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experienceLevel} yrs</span></h1>
                <h1 className='my-1 font-bold'>Salary: <span className='pl-4 font-normal text-gray-800'>${singleJob?.salary}</span></h1>
                <h1 className='my-1 font-bold'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='my-1 font-bold'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDescription