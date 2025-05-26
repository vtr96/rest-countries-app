import { useReducer } from 'react';
import { countryReducer, initialState } from './contexts/countryReducer';
import { SearchForm } from './components/SearchForm';
import { CountryList } from './components/CountryList';

function App() {
    const [state, dispatch] = useReducer(countryReducer, initialState);

    const handleSearch = async (query) => {
        dispatch({ type: 'FETCH_START' });
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
            if (!response.ok) throw new Error('Country not found');
            const data = await response.json();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (err) {
            dispatch({ type: 'FETCH_ERROR', payload: err.message });
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>Country Search</h1>
            <SearchForm onSearch={handleSearch} />

            {state.loading && <div style={{ color: 'blue' }}>Loading...</div>}
            {state.error && <div style={{ color: 'red', marginTop: '1rem' }}>Error: {state.error}</div>}

            <CountryList countries={state.data} />
        </div>
    );
}

export default App;
