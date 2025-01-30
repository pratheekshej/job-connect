import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axiosPrivate from '@/hooks/useAxiosPrivate'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const fetchCompanies = async (dispatch) => {
    try {
        const res = await axiosPrivate.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
        console.log('called');
        if (dispatch && res.data.companies) {
            dispatch(setCompanies(res.data.companies));
        }
        return res.data.companies;
    } catch (error) {
        console.log(error);
        return [];
    }
}

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        fetchCompanies(dispatch);
    }, [])
}

export default useGetAllCompanies