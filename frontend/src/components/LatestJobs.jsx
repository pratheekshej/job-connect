import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='shadow-xl mx-auto my-20 p-6 rounded-lg max-w-7xl'>
            <h1 className='font-bold text-4xl'><span className='text-[#2f8aaf]'>Latest & Top </span> Job Openings</h1>
            <div className='gap-4 grid grid-cols-3 my-5'>
                {
                    allJobs.length <= 0 ? <span>No Job Available</span> : allJobs?.slice(0, 6).map((job) => <LatestJobCards key={job._id} job={job} />)
                }
            </div>
        </div>
    )
}

export default LatestJobs