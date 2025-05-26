export const initialState = {
	loading: false,
	error: null,
	data: [],
};

export function countryReducer(state, action) {
	switch (action.type) {
		case 'FETCH_START':
			return { ...state, loading: true, error: null };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, data: action.payload };
		case 'FETCH_ERROR':
			return { ...state, loading: false, error: action.payload };
		default:
			return state;
	}
}
