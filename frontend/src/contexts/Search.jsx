import { useReducer } from "react";
import { countryReducer, initialState } from "./countryReducer";
import { SearchForm } from "../components/SearchForm";
import { CountryList } from "../components/CountryList";

function Search() {
    const [state, dispatch] = useReducer(countryReducer, initialState)

    const handleSearch = async (query) => {
        dispatch({ type: 'FETCH_START' })

        const regions = ['africa', 'americas', 'asia', 'europe', 'oceania']
        const formattedQuery = query.trim().toLocaleLowerCase()

        let url = ''

        if (regions.includes(formattedQuery)) {
            url = `https://restcountries.com/v3.1/region/${formattedQuery}`
        } else {
            url = `https://restcountries.com/v3.1/name/${formattedQuery}`
        }

        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error('No countries found')
            const data = await response.json()
            dispatch({ type: 'FETCH_SUCCESS', payload: data })
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message })
        }
    }

    return (
        <div style={{
            maxWidth: '600px',
            margin: '2rem auto',
            fontFamily: 'Arial, sans-serif',
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            padding: '2rem',
            borderRadius: '8px'
        }}>
            <h1>Country Search</h1>
            <SearchForm onSearch={handleSearch} />

            {state.loading && <div style={{ color: 'blue' }}>Loading...</div>}
            {state.error && <div style={{ color: 'red', marginTop: '1rem' }}>Error: {state.error}</div>}

            <CountryList countries={state.data} />
        </div>
    )
}

export default Search;