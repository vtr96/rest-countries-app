import { CountryCard } from './CountryCard';

export function CountryList({ countries, favorites, onToggleFavorite }) {
	return (
		<div>
			{countries.map((country) => (
				<CountryCard
					key={country.cca3}
					country={country}
					isFavorited={favorites.some(f => f.code === country.cca2)}
					onToggleFavorite={onToggleFavorite}
				/>
			))}
		</div>
	);
}