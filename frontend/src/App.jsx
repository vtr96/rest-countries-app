import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './contexts/Login';
import Search from './contexts/Search';
import PrivateRoute from "./components/PrivateRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/search" element={<Search />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
