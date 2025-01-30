import { setAllJobs, setSearchedQuery } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const fetchAllJobs = (dispatch = null) => async (searchedQuery = '') => {
    try {
        const res = await axiosPrivate.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, { withCredentials: true });
        if (res.data.success && dispatch) {
            dispatch(setAllJobs(res.data.jobs));
            return res.data.jobs;
        }
        return [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobsToDispatch = async () => {
            try {
                await fetchAllJobs(dispatch)(searchedQuery);
                if (searchedQuery) {
                    dispatch(setSearchedQuery(""));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllJobsToDispatch();
    }, [])
}

export default useGetAllJobs