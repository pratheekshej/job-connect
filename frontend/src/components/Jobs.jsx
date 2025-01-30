import React, { useEffect, useState } from 'react'
import FilterCard, { salaryRanges } from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import Anime from './shared/Anime';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    const { user } = useSelector(state => state.auth);
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    useEffect(() => {
        let updatedJobs = [...allJobs]; // Copy the `allJobs` array

        if (user?.savedJobs) {
            updatedJobs = updatedJobs.map(job => {
                return {
                    ...job, // Create a new object
                    saved: user.savedJobs.includes(job?._id),
                };
            });
        }

        if (searchedQuery && searchedQuery.toLowerCase() !== 'all' && searchedQuery.toLowerCase() !== 'saved jobs') {
            updatedJobs = updatedJobs.filter(job =>
                job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                salaryRanges(Number(job.salary))[searchedQuery]
            );
        } else if (searchedQuery && searchedQuery.toLowerCase() === 'saved jobs') {
            updatedJobs = user?.savedJobs
                .map(jobId => updatedJobs.find(job => job?._id === jobId))
                .filter(Boolean); // Remove undefined if any
        }

        setFilterJobs(updatedJobs);
    }, [allJobs, searchedQuery, user]);


    return (
        <div className='flex flex-col'>
            <div className='shadow-md mt-5 px-5 py-5 w-[85%] self-center'>
                <div className='flex gap-5 w-full'>
                    <div className='relative w-[20%]'>
                        <FilterCard />
                    </div>
                    {
                        (filterJobs.length <= 0) ?
                            <div className='flex-1 pt-3 pb-5 w-[90%] min-h-[80vh]'>Jobs not found!</div> :
                            <div className='flex-1 pb-5 w-[80%] min-h-[80vh]'>
                                <div className='gap-9 grid grid-cols-3'>
                                    {filterJobs.map((job) => (
                                        <Anime key={job?._id} val={job?._id}>
                                            <Job job={job} />
                                        </Anime>
                                    ))}
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs