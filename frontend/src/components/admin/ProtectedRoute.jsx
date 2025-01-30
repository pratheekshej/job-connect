import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Admin from "../Admin";

const ProtectedRoute = () => {
    const { user, loading } = useSelector(store => store.auth); // Assuming `loading` exists in auth state
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user === null) {
            navigate("/", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>; // Optional: Show loading spinner or fallback UI
    }

    return <Admin />;
};

export default ProtectedRoute;
