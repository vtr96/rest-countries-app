import { useState } from 'react';

	export function CountryCard({ country, isFavorited , onToggleFavorite }) {
	const [message, setMessage] = useState('');

	const handleClick = async () => {
		const wasFavorited = isFavorited;
		await onToggleFavorite(country);
		setMessage(wasFavorited ? 'Removed from favorites' : 'Added to favorites');
		setTimeout(() => setMessage(''), 2000);
	};

	if (!country || typeof onToggleFavorite !== 'function') {
		console.warn('Missing props in CountryCard');
		return null;
	}



	return (
		<div style={{
			border: '1px solid #ccc',
			padding: '1rem',
			margin: '0.5rem 0',
			borderRadius: '8px',
			boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
			fontFamily: 'monospace'
		}}>
			<button onClick={handleClick} style={{ marginBottom: '0.5rem' }}>
				{isFavorited ? '★ Unfavorite' : '☆ Favorite'}
			</button>
			{message && <p style={{ color: 'green' }}>{message}</p>}
			<h3>{country.name.common}</h3>
			<p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
			<p><strong>Region:</strong> {country.region}</p>
			<p><strong>Population:</strong> {country.population.toLocaleString()}</p>
			<img
				src={country.flags.svg}
				alt={`Flag of ${country.name.common}`}
				style={{ width: '100px', marginTop: '0.5rem' }}
			/>
		</div>
	);
}