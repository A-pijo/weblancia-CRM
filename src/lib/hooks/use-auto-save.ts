"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { UseFormWatch, UseFormGetValues, UseFormSetValue, FieldValues, Path } from "react-hook-form"

interface UseAutoSaveOptions<T extends FieldValues> {
  draftKey: string
  watch: UseFormWatch<T>
  getValues: UseFormGetValues<T>
  setValue: UseFormSetValue<T>
  delay?: number
}

interface UseAutoSaveReturn {
  saved: boolean
  restoreDraft: () => void
  hasDraft: boolean
  clearDraft: () => void
}

export function useAutoSave<T extends FieldValues>({
  draftKey,
  watch,
  getValues,
  setValue,
  delay = 2000,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn {
  const [saved, setSaved] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(draftKey)
      setHasDraft(saved !== null)
    } catch {}
  }, [draftKey])

  const handleAutoSave = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const data = getValues()
        localStorage.setItem(draftKey, JSON.stringify(data))
        setSaved(true)
        clearTimeout(savedTimerRef.current)
        savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
      } catch {}
    }, delay)
  }, [draftKey, getValues, delay])

  useEffect(() => {
    const subscription = watch(() => handleAutoSave())
    return () => {
      subscription.unsubscribe()
      clearTimeout(timerRef.current)
      clearTimeout(savedTimerRef.current)
    }
  }, [watch, handleAutoSave])

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        const data = JSON.parse(saved) as T
        for (const [key, val] of Object.entries(data)) {
          setValue(key as Path<T>, val as T[Path<T>])
        }
        setHasDraft(false)
      }
    } catch {}
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(draftKey)
      setHasDraft(false)
    } catch {}
  }

  return { saved, restoreDraft, hasDraft, clearDraft }
}
