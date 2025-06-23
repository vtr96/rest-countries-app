import { useForm } from 'react-hook-form';

export function SearchForm({ onSearch }) {
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		onSearch(data.query);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '1rem' }}>
			<input
				placeholder="Enter country name or region (e.g., Europe)"
				{...register('query', {
					required: 'This field is required',
					validate: value => value.trim().length > 0 || 'Cannot be empty or spaces only'
				})}
				style={{ padding: '0.5rem', width: '100%' }}
			/>
			{errors.query && <div style={{ color: 'red' }}>{errors.query.message}</div>}

			<button type="submit" style={{ marginTop: '0.5rem', padding: '0.5rem 1rem' }}>
				Search
			</button>
		</form>
	);
}
