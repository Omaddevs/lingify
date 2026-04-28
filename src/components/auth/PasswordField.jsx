import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import InputField from './InputField'

function PasswordField({ id, label, value, onChange, placeholder, error, autoComplete = 'current-password' }) {
  const [show, setShow] = useState(false)

  return (
    <InputField
      id={id}
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      error={error}
      icon={Lock}
      autoComplete={autoComplete}
      rightElement={
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="pr-4 text-slate-400 transition hover:text-indigo-600"
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      }
    />
  )
}

export default PasswordField
