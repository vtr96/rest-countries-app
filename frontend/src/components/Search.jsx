import { useReducer, useEffect, useState } from "react";
import { countryReducer, initialState } from "../contexts/countryReducer";
import { SearchForm } from "./SearchForm";
import { CountryList } from "./CountryList";
import axios from "axios";

function Search() {
    const [state, dispatch] = useReducer(countryReducer, initialState);
    const [favorites, setFavorites] = useState([]);

    // 🔁 Fetch all favorite countries from DB
    const fetchFavorites = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/favorites", {
                withCredentials: true,
            });
            setFavorites(res.data);
        } catch (err) {
            console.error("Error fetching favorites:", err);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // 🔎 Search countries from REST Countries API
    const handleSearch = async (query) => {
        dispatch({ type: "FETCH_START" });

        const regions = ["africa", "americas", "asia", "europe", "oceania"];
        const formattedQuery = query.trim().toLowerCase();
        const url = regions.includes(formattedQuery)
            ? `https://restcountries.com/v3.1/region/${formattedQuery}`
            : `https://restcountries.com/v3.1/name/${formattedQuery}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("No countries found");
            const data = await response.json();
            dispatch({ type: "FETCH_SUCCESS", payload: data });
        } catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
    };

    // ⭐ Toggle favorite/unfavorite
    const handleToggleFavorite = async (country) => {
        const isAlready = favorites.some((f) => f.code === country.cca2);
        try {
            if (isAlready) {
                await axios.delete(
                    `http://localhost:3000/api/favorites/${country.cca2}`,
                    { withCredentials: true }
                );
            } else {
                await axios.post(
                    "http://localhost:3000/api/favorites",
                    {
                        name: country.name.common,
                        code: country.cca2,
                        flag: country.flag,
                        region: country.region,
                    },
                    { withCredentials: true }
                );
            }
            await fetchFavorites();
        } catch (err) {
            console.error("Error toggling favorite:", err);
        }
    };

    return (
        <div className={'search-div'}
            style={{
                maxWidth: "600px",
                margin: "2rem auto",
                fontFamily: 'monospace',
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                padding: "2rem",
                borderRadius: "8px",
            }}
        >
            <h1 className={'title'}>Country Search</h1>
            <SearchForm onSearch={handleSearch} />

            {state.loading && <div style={{ color: "blue" }}>Loading...</div>}
            {state.error && (
                <div style={{ color: "red", marginTop: "1rem" }}>
                    Error: {state.error}
                </div>
            )}

            <CountryList
                countries={state.data}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
            />
        </div>
    );
}

export default Search;