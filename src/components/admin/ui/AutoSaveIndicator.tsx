'use client'

import { SaveStatus } from '@/hooks/useAutoSave'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

interface AutoSaveIndicatorProps {
  status: SaveStatus
  lastSaved: Date | null
  error?: Error | null
  onRetry?: () => void
}

export default function AutoSaveIndicator({
  status,
  lastSaved,
  error,
  onRetry
}: AutoSaveIndicatorProps) {
  if (status === 'idle' && !lastSaved) {
    return null
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === 'saving' && (
        <>
          <ArrowPathIcon className="w-4 h-4 animate-spin text-deep-teal" />
          <span className="text-deep-teal">Saving...</span>
        </>
      )}

      {status === 'saved' && lastSaved && (
        <>
          <CheckCircleIcon className="w-4 h-4 text-green-600" />
          <span className="text-green-600">
            Saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
          </span>
        </>
      )}

      {status === 'error' && (
        <>
          <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
          <span className="text-red-600">
            {error?.message || 'Failed to save'}
          </span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="ml-2 text-xs underline hover:no-underline"
            >
              Retry
            </button>
          )}
        </>
      )}
    </div>
  )
}
