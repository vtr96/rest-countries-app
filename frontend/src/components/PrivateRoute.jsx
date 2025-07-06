import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function PrivateRoute() {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/validate', {
            withCredentials: true
        })
            .then(() => setAuth(true))
            .catch(() => setAuth(false));
    }, []);

    if (auth === null) return <p>Loading...</p>;
    if (!auth) return <Navigate to="/" />;

    return <Outlet />;
}

export default PrivateRoute;