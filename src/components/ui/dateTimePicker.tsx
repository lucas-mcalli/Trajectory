import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import { InputGroup, InputGroupAddon } from "~/components/ui/input-group"
import type { DateTimeInputProps, CalendarState} from "~/types"


function formatDisplayDateTime(date: Date | undefined, militaryTime?: boolean): string {
  if (!date || isNaN(date.getTime())) return "Select date and time"
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: !militaryTime,
  }

  return `${date.toLocaleDateString("en-US", dateOptions)} at ${date.toLocaleTimeString("en-US", timeOptions)}`
}

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay()
}

function Calendar({
  selectedDate,
  onDateSelect,
  militaryTime,
  defaultMonth,
}: {
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  militaryTime?: boolean
  defaultMonth?: Date
}) {
  const now = new Date()
  const initial = defaultMonth ?? selectedDate ?? now
  const [state, setState] = React.useState<CalendarState>({
    month: initial.getMonth(),
    year: initial.getFullYear(),
  })

  // Calendar setup
  const daysInMonth = getDaysInMonth(state.month, state.year)
  const firstDay = getFirstDayOfMonth(state.month, state.year)
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  // Time setup
  const currentHour = selectedDate?.getHours() ?? now.getHours()
  const currentMinute = selectedDate?.getMinutes() ?? now.getMinutes()
  const isPM = currentHour >= 12
  const displayHour12 = currentHour % 12 === 0 ? 12 : currentHour % 12

  const hoursList = Array.from({ length: militaryTime ? 24 : 12 }, (_, i) => 
    militaryTime ? i : (i === 0 ? 12 : i)
  )
  const minutesList = Array.from({ length: 12 }, (_, i) => i * 5)

  const handlePrevMonth = () => {
    setState((prev) => {
      if (prev.month === 0) return { month: 11, year: prev.year - 1 }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const handleNextMonth = () => {
    setState((prev) => {
      if (prev.month === 11) return { month: 0, year: prev.year + 1 }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(state.year, state.month, day)
    // Preserve existing time if available, otherwise use midnight
    if (selectedDate) {
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0)
    } else {
      newDate.setHours(0,0,0)
    }
    onDateSelect(newDate)
    // Notice: We don't onClose() here so the user can still select a time
  }

  const handleTimeSelect = (type: 'hour' | 'minute' | 'ampm', val: number | 'AM' | 'PM') => {
    const newDate = selectedDate ? new Date(selectedDate) : new Date(state.year, state.month, now.getDate())
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
    onDateSelect(newDate)
  }

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="plasmo-absolute plasmo-top-full plasmo-right-0 plasmo-mt-2 plasmo-bg-background plasmo-border plasmo-border-input plasmo-rounded-md plasmo-shadow-lg plasmo-p-4 plasmo-z-50 plasmo-flex plasmo-gap-4">
      
      {/* --- Left Side: Calendar --- */}
      <div className="plasmo-w-64">
        <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="plasmo-p-1 hover:plasmo-bg-accent plasmo-rounded plasmo-transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="plasmo-size-4" />
          </button>
          <div className="plasmo-text-sm plasmo-font-semibold">
            {monthNames[state.month]} {state.year}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="plasmo-p-1 hover:plasmo-bg-accent plasmo-rounded plasmo-transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon className="plasmo-size-4" />
          </button>
        </div>

        <div className="plasmo-grid plasmo-grid-cols-7 plasmo-gap-1 plasmo-mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="plasmo-text-xs plasmo-text-muted-foreground plasmo-text-center plasmo-font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="plasmo-grid plasmo-grid-cols-7 plasmo-gap-1">
          {days.map((day, idx) => {
            const isSelected = day && selectedDate && day === selectedDate.getDate() && state.month === selectedDate.getMonth() && state.year === selectedDate.getFullYear()

            return (
              <div key={idx}>
                {day ? (
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "plasmo-w-8 plasmo-h-8 plasmo-rounded-md plasmo-text-sm plasmo-font-medium plasmo-transition-colors",
                      isSelected
                        ? "plasmo-bg-primary plasmo-text-primary-foreground"
                        : "hover:plasmo-bg-accent plasmo-text-foreground"
                    )}
                  >
                    {day}
                  </button>
                ) : (
                  <div className="plasmo-w-8 plasmo-h-8" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* --- Right Side: Time Selector --- */}
      <div className="plasmo-border-l plasmo-border-input plasmo-pl-4 plasmo-flex plasmo-gap-2 plasmo-h-[260px]">
        {/* Hours */}
        <div className="plasmo-flex plasmo-flex-col plasmo-gap-1 plasmo-overflow-y-auto plasmo-pr-1" style={{ scrollbarWidth: "none" }}>
          {hoursList.map((h) => {
            const isSelected = militaryTime ? currentHour === h : displayHour12 === h
            return (
              <button
                type="button"
                key={`h-${h}`}
                onClick={() => handleTimeSelect('hour', h)}
                className={cn(
                  "plasmo-px-2 plasmo-py-1 plasmo-rounded-md plasmo-text-sm plasmo-transition-colors",
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
                type="button"
                key={`m-${m}`}
                onClick={() => handleTimeSelect('minute', m)}
                className={cn(
                  "plasmo-px-2 plasmo-py-1 plasmo-rounded-md plasmo-text-sm plasmo-transition-colors",
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
                  type="button"
                  key={ampm}
                  onClick={() => handleTimeSelect('ampm', ampm as 'AM' | 'PM')}
                  className={cn(
                    "plasmo-px-2 plasmo-py-1 plasmo-rounded-md plasmo-text-sm plasmo-font-medium plasmo-transition-colors",
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

    </div>
  )
}

export function DateTimePicker({
  label,
  value,
  onChange,
  militaryTime = false,
  defaultMonth,
  error,
  onOpen
}: DateTimeInputProps) {
  const [showCalendar, setShowCalendar] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCalendar])

  return (
    <div className="plasmo-flex plasmo-w-full">
      <Field className="plasmo-flex plasmo-w-full plasmo-flex-col">
        <div className="plasmo-flex plasmo-justify-between plasmo-items-end">
          <FieldLabel>{label}</FieldLabel>
          {error && (
            <p className="plasmo-text-xs plasmo-text-destructive">{error}</p>
          )}
        </div>
        <div className="plasmo-relative" ref={calendarRef}>
          <InputGroup className={error ? "plasmo-ring-2 plasmo-ring-destructive" : showCalendar ? "plasmo-ring-2 plasmo-ring-ring" : ""}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setShowCalendar(!showCalendar)
                if (!showCalendar) onOpen?.() // allows the error to be cleared when the field is reopened
              }}
              className={cn(
                "plasmo-flex-1 plasmo-text-left plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-shadow-none",
                value ? "plasmo-text-foreground" : "plasmo-text-muted-foreground",
                "focus-visible:plasmo-outline-none focus-visible:plasmo-ring-0",
                "disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50",
                "hover:plasmo-bg-accent/50 plasmo-transition-colors"
              )}
              data-slot="input-group-control"
            >
              {formatDisplayDateTime(value, militaryTime)}
            </button>
            <InputGroupAddon align="inline-end">
              <CalendarIcon className="plasmo-size-4 plasmo-text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>

          {showCalendar && (
            <Calendar
              selectedDate={value}
              onDateSelect={onChange}
              militaryTime={militaryTime}
              defaultMonth={defaultMonth}
            />
          )}
        </div>
      </Field>
    </div>
  )
}