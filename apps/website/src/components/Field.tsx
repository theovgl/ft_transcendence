export interface IField
{
	id: string
	name: string
	placeholder: string
	size: number
}

export default function Field(option: IField) {
	return (
		<input type="text"
			id={option.id
				? option.id
				: 'id_temp'} 
			name={option.name
				? option.name
				: 'name_temp'} 
			placeholder={option.placeholder
				? option.placeholder
				: 'placeholder_temp'} 
			required
			minLength={4} 
			size={option.size
				? option.size
				: 12}	/>
	);
}
