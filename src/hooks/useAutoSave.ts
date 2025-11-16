import { useEffect, useRef, useState, useCallback } from 'react'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface UseAutoSaveOptions<T> {
  data: T
  onSave: (data: T) => Promise<void>
  delay?: number // milliseconds
  enabled?: boolean
}

interface UseAutoSaveReturn {
  saveStatus: SaveStatus
  lastSavedAt: Date | null
  saveNow: () => Promise<void>
  error: Error | null
}

export function useAutoSave<T>({
  data,
  onSave,
  delay = 2000,
  enabled = true
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const dataRef = useRef<T>(data)
  const isSavingRef = useRef(false)

  // Update data ref when data changes
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const saveNow = useCallback(async () => {
    if (isSavingRef.current || !enabled) return

    try {
      isSavingRef.current = true
      setSaveStatus('saving')
      setError(null)

      await onSave(dataRef.current)

      setSaveStatus('saved')
      setLastSavedAt(new Date())

      // Reset to idle after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle')
      }, 3000)
    } catch (err) {
      setSaveStatus('error')
      setError(err as Error)
      console.error('Auto-save error:', err)
    } finally {
      isSavingRef.current = false
    }
  }, [enabled, onSave])

  // Debounced auto-save
  useEffect(() => {
    if (!enabled) return

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveNow()
    }, delay)

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, delay, enabled, saveNow])

  return {
    saveStatus,
    lastSavedAt,
    saveNow,
    error
  }
}
