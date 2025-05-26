import { useForm } from 'react-hook-form';

export function SearchForm({ onSearch }) {
	const { register, handleSubmit, formState: { errors } } = useForm();

	const onSubmit = (data) => {
		onSearch(data.query);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input
				placeholder="Country name or region"
				{...register('query', { required: 'Country name/region field is required!' })}
			/>
			{errors.query && <span>{errors.query.message}</span>}

			<button type="submit">Buscar</button>
		</form>
	);
}