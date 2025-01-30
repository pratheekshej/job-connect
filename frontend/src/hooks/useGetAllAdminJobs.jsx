import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const apiUrl = user?.role === 'admin' ? 'get' : 'getadminjobs';
                const res = await axiosPrivate.get(`${JOB_API_END_POINT}/${apiUrl}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllAdminJobs();
    }, [])
}

export default useGetAllAdminJobs