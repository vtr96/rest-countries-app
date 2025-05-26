import './App.css';
import { useReducer } from 'react';
import { countryReducer, initialState } from './contexts/countryReducer';
import { SearchForm } from './components/SearchForm';

function App() {
  const [state, dispatch] = useReducer(countryReducer, initialState);

  const handleSearch = async (query) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
      if (!response.ok) throw new Error('Country/Region not found!');
      const data = await response.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  };

  return (
      <div>
        <h1>Country search</h1>
        <SearchForm onSearch={handleSearch} />

        {state.loading && <p>Loading...</p>}
        {state.error && <p>Error: {state.error}</p>}

        <ul>
          {state.data.map((country) => (
              <li key={country.cca3}>{country.name.common}</li>
          ))}
        </ul>
      </div>
  );
}

export default App;