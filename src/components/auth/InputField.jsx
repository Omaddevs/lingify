function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  autoComplete,
  rightElement,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-600">
        {label}
      </label>
      <div
        className={`flex items-center overflow-hidden rounded-2xl border bg-slate-50 transition-all focus-within:bg-white focus-within:ring-4 ${
          error
            ? 'border-red-300 focus-within:border-red-400 focus-within:ring-red-100'
            : 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-indigo-100'
        }`}
      >
        {Icon ? (
          <span className="pl-4 text-slate-400">
            <Icon size={17} />
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        {rightElement}
      </div>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  )
}

export default InputField
