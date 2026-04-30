import { Component } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('[Lingify Error]', error, errorInfo)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const { error } = this.state
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Nimadir xato ketdi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Kutilmagan xatolik yuz berdi. Sahifani yangilang yoki bosh sahifaga qayting.
          </p>
          {import.meta.env.DEV && error && (
            <details className="mt-4 rounded-xl bg-slate-50 p-3 text-left">
              <summary className="cursor-pointer text-xs font-semibold text-slate-600">
                Texnik ma'lumot (Dev)
              </summary>
              <pre className="mt-2 overflow-auto text-[11px] text-red-600 leading-5 whitespace-pre-wrap">
                {error.message}
              </pre>
            </details>
          )}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => window.location.replace('/')}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Home size={15} />Bosh sahifa
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
            >
              <RefreshCw size={15} />Qayta yuklash
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
