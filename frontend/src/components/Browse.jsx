import React, { useEffect, useState } from 'react'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import Anime from './shared/Anime';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (searchedQuery) {
            setSearchTerm(searchedQuery);
        }
    }, [searchedQuery])

    return (
        <div className='mx-auto my-10 max-w-7xl'>
            {
                searchTerm &&
                <div className='flex flex-row justify-start items-center gap-3 my-10 mb-5'>
                    <Button
                        variant={"outline"}
                        size={"icon"}
                        onClick={() => navigate("/")}
                        className={cn("h-8 w-8 rounded-full", "-left-12 top-1/2 -translate-y-1/2")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <h1 className='-mt-8 font-bold text-xl'>
                        {`Search results for "${searchTerm}" - (${allJobs.length})`}
                    </h1>
                </div>
            }
            <div className='gap-4 grid grid-cols-3'>
                {
                    allJobs &&
                    allJobs.length > 0 &&
                    allJobs.map((job) => (
                        <Anime key={job?._id}>
                            <Job key={job._id} job={job} />
                        </Anime>
                    ))
                }
                {(!allJobs || !allJobs?.length) && `No records found for the searched term - ${searchTerm}`}
            </div>
        </div>
    )
}

export default Browse