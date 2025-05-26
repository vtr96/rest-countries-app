import { CountryCard } from './CountryCard';

export function CountryList({ countries }) {
	if (!countries || countries.length === 0) {
		return <p>No countries found.</p>;
	}

	return (
		<div>
			{countries.map((country) => (
				<CountryCard key={country.cca3} country={country} />
			))}
		</div>
	);
}
