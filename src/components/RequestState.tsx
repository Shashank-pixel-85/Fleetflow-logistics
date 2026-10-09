import { AlertCircle, LoaderCircle } from 'lucide-react'

/** Use while waiting for a real API request. */
export function LoadingState({ message = 'Loading records…' }: { message?: string }) {
  return <div className="request-state" role="status"><LoaderCircle className="spin-icon" size={22} /><strong>{message}</strong><span>Please wait a moment.</span></div>
}

/** Use when an API request fails and the user can retry it. */
export function ErrorState({ message = 'We could not load this information.', onRetry }: { message?: string; onRetry?: () => void }) {
  return <div className="request-state error-state" role="alert"><AlertCircle size={22} /><strong>Something went wrong</strong><span>{message}</span>{onRetry && <button className="secondary-button" onClick={onRetry}>Try again</button>}</div>
}
