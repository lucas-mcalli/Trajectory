import * as React from "react"
import { Clock } from "lucide-react"

import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import { InputGroup, InputGroupAddon } from "~/components/ui/input-group"
import type { TimePickerProps } from "~types"


function formatDisplayTime(date: Date | undefined, militaryTime?: boolean): string {
  if (!date || isNaN(date.getTime())) return "Select time"
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: !militaryTime,
  }
  return date.toLocaleTimeString("en-US", timeOptions)
}

export function TimePicker({
  label,
  value,
  onChange,
  militaryTime = false,
  showNextDayIndicator = false,
  error,
  onOpen
}: TimePickerProps) {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const now = new Date()
  const currentHour = value?.getHours() ?? now.getHours()
  const currentMinute = value?.getMinutes() ?? now.getMinutes()
  const isPM = currentHour >= 12
  const displayHour12 = currentHour % 12 === 0 ? 12 : currentHour % 12

  const hoursList = Array.from({ length: militaryTime ? 24 : 12 }, (_, i) => 
    militaryTime ? i : (i === 0 ? 12 : i)
  )
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleTimeSelect = (type: 'hour' | 'minute' | 'ampm', val: number | 'AM' | 'PM') => {
    const newDate = value ? new Date(value) : new Date()
    let h = newDate.getHours()
    let m = newDate.getMinutes()

    if (type === 'hour') {
      if (militaryTime) {
        h = val as number
      } else {
        const isCurrentlyPM = h >= 12
        let newH = val as number
        if (newH === 12) newH = 0
        h = newH + (isCurrentlyPM ? 12 : 0)
      }
    } else if (type === 'minute') {
      m = val as number
    } else if (type === 'ampm') {
      const isCurrentlyPM = h >= 12
      if (val === 'PM' && !isCurrentlyPM) h += 12
      if (val === 'AM' && isCurrentlyPM) h -= 12
    }

    newDate.setHours(h, m, 0)
    onChange(newDate)
  }

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="plasmo-flex plasmo-w-full">
      <Field className="plasmo-flex plasmo-w-full plasmo-flex-col">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-end">
          <FieldLabel>{label}</FieldLabel>
          {error && (
            <p className="plasmo-text-xs plasmo-text-destructive">{error}</p>
          )}
        </div>
        <div className="plasmo-relative" ref={dropdownRef}>
          <InputGroup className={error ? "plasmo-ring-2 plasmo-ring-destructive" : showDropdown ? "plasmo-ring-2 plasmo-ring-ring" : ""}>
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowDropdown(!showDropdown)
                onOpen?.()
              }}
              className={cn(
                "plasmo-flex-1 plasmo-text-left plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-shadow-none plasmo-flex plasmo-items-center plasmo-gap-0.5",
                value ? "plasmo-text-foreground" : "plasmo-text-muted-foreground",
                "focus-visible:plasmo-outline-none focus-visible:plasmo-ring-0",
                "disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50",
                "hover:plasmo-bg-accent/50 plasmo-transition-colors" 
              )}
            >
              <span>{formatDisplayTime(value, militaryTime)}</span>
              {value && showNextDayIndicator && (
                <sup className="plasmo-text-xs plasmo-font-bold plasmo-text-primary-500 plasmo-top-[-0.25em]">
                  +1
                </sup>
              )}
            </button>
            <InputGroupAddon align="inline-end">
              <Clock className="plasmo-size-4 plasmo-text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          {showDropdown && (
            <div className="plasmo-absolute plasmo-top-full plasmo-right-0 plasmo-mt-2 plasmo-bg-background plasmo-border plasmo-border-input plasmo-rounded-md plasmo-shadow-lg plasmo-p-4 plasmo-z-50 plasmo-flex plasmo-gap-2 plasmo-h-[200px]">
              {/* Hours */}
              <div className="plasmo-flex plasmo-flex-col plasmo-gap-1 plasmo-overflow-y-auto plasmo-pr-1" style={{ scrollbarWidth: "none" }}>
                {hoursList.map((h) => {
                  const isSelected = militaryTime ? currentHour === h : displayHour12 === h
                  return (
                    <button
                      key={`h-${h}`}
                      type="button"
                      onClick={() => handleTimeSelect('hour', h)}
                      className={cn(
                        "plasmo-px-3 plasmo-py-1 plasmo-rounded-md plasmo-text-sm plasmo-transition-colors",
                        isSelected ? "plasmo-bg-primary plasmo-text-primary-foreground" : "hover:plasmo-bg-accent plasmo-text-muted-foreground"
                      )}
                    >
                      {militaryTime ? pad(h) : h}
                    </button>
                  )
                })}
              </div>

              {/* Minutes */}
              <div className="plasmo-flex plasmo-flex-col plasmo-gap-1 plasmo-overflow-y-auto plasmo-pr-1" style={{ scrollbarWidth: "none" }}>
                {minutesList.map((m) => {
                  const isSelected = currentMinute === m
                  return (
                    <button
                      key={`m-${m}`}
                      type="button"
                      onClick={() => handleTimeSelect('minute', m)}
                      className={cn(
                        "plasmo-px-3 plasmo-py-1 plasmo-rounded-md plasmo-text-sm plasmo-transition-colors",
                        isSelected ? "plasmo-bg-primary plasmo-text-primary-foreground" : "hover:plasmo-bg-accent plasmo-text-muted-foreground"
                      )}
                    >
                      {pad(m)}
                    </button>
                  )
                })}
              </div>

              {/* AM/PM */}
              {!militaryTime && (
                <div className="plasmo-flex plasmo-flex-col plasmo-gap-1">
                  {['AM', 'PM'].map((ampm) => {
                    const isSelected = (ampm === 'PM' && isPM) || (ampm === 'AM' && !isPM)
                    return (
                      <button
                        key={ampm}
                        type="button"
                        onClick={() => handleTimeSelect('ampm', ampm as 'AM' | 'PM')}
                        className={cn(
                          "plasmo-px-3 plasmo-py-1 plasmo-rounded-md plasmo-text-sm plasmo-font-medium plasmo-transition-colors",
                          isSelected ? "plasmo-bg-primary plasmo-text-primary-foreground" : "hover:plasmo-bg-accent plasmo-text-muted-foreground"
                        )}
                      >
                        {ampm}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </Field>
    </div>
  )
}