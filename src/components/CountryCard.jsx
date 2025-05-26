export function CountryCard({ country }) {
	return (
		<div style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
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
