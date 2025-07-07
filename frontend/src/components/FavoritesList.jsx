import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function FavoritesList() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/api/favorites', {
            withCredentials: true
        })
            .then(res => setFavorites(res.data))
            .catch(err => console.error('Error fetching favorites:', err));
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>🌟 My Favorite Countries</h2>

            <Link to="/search" style={{
                display: 'inline-block',
                marginBottom: '1rem',
                background: '#333',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                textDecoration: 'none'
            }}>
                ← Back to Home
            </Link>

            {favorites.length === 0 ? (
                <p style={{ fontStyle: 'italic' }}>No favorites yet.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {favorites.map((fav) => (
                        <li key={fav._id} style={{
                            background: '#f0f0f0',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            marginBottom: '0.75rem',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <span style={{ fontSize: '1.25rem' }}>{fav.flag}</span>{' '}
                            <strong>{fav.name}</strong> ({fav.code}) – {fav.region}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FavoritesList;
