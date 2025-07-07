import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Search from './components/Search';
import PrivateRoute from "./components/PrivateRoute";
import FavoritesList from './components/FavoritesList';

function App() {
    const location = useLocation();
    const hideNavbar = location.pathname === '/'

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/search" element={<Search />} />
                </Route>
                <Route element={<PrivateRoute />}>
                    <Route path="/favorites" element={<FavoritesList />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
