interface Props {
    value: number;
    onChange: (anio: number) => void;
  }
  
  export function YearSelector({ value, onChange }: Props) {
    const years = [2023, 2024, 2025, 2026];
  
    return (
      <select
        className="border rounded-lg p-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    );
  }