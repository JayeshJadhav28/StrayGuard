interface FilterChipsProps {
	selected: string;
	onChange: (value: string) => void;
	options: string[];
}

export function FilterChips({ selected, onChange, options }: FilterChipsProps) {
	return (
		<div className="flex flex-wrap gap-2">
			{options.map((option) => {
				const isActive = selected === option;

				return (
					<button
						key={option}
						type="button"
						onClick={() => onChange(option)}
						className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
							isActive
								? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
								: 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
						}`}
					>
						{option === 'all' ? 'All Zones' : `${option.charAt(0).toUpperCase() + option.slice(1)} Risk`}
					</button>
				);
			})}
		</div>
	);
}