import React, { useEffect } from 'react'
import ApplicantsTable from './ApplicantsTable'
import axiosPrivate from '@/hooks/useAxiosPrivate';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axiosPrivate.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);
    return (
        <div className='mx-auto max-w-7xl'>
            <h1 className='my-5 font-bold text-xl'>Number of Applicants  - {applicants?.applications?.length}</h1>
            <ApplicantsTable />
        </div>
    )
}

export default Applicants