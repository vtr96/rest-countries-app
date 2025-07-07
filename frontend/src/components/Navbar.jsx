export function Navbar() {
    const location = useLocation();
    const inSearch = location.pathname === '/search';

    const gotoFavorites = <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 999,
    }}>
    <Link to="/favorites" style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#333',
        color: 'white',
        borderRadius: '4px',
        textDecoration: 'none'
        }}>
        View Favorites
    </Link>
    </div>

    if (inSearch) {
        return ( gotoFavorites )
    }
}

import { Link, useLocation } from 'react-router-dom';

export default Navbar;