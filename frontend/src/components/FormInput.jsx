export function FormInput({ id, label, type = "text", value, onChange, dataTestId, required = true }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        data-testid={`${dataTestId}-input`}
        type={type}
        required={required}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}