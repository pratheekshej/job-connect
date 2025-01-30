import { useSelector } from 'react-redux'

const useGetUserLocation = () => {
    const { user } = useSelector((state) => state.auth);
    if (user && (user?.role === 'admin' || user?.role === 'recruiter')) {
        return { ROUTE_PATH: `/${user?.role}` };
    }
    return { ROUTE_PATH: `` };
}

export default useGetUserLocation
