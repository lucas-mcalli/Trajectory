import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ClockIcon } from "lucide-react"

import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import { InputGroup, InputGroupAddon } from "~/components/ui/input-group"
import type { DateTimeInputProps } from "~/types"

function formatForDateInput(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  )
}

function formatForTimeInput(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return pad(date.getHours()) + ":" + pad(date.getMinutes())
}

function formatDisplayDate(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return "Select date"
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }
  return date.toLocaleDateString("en-US", options)
}

type CalendarState = {
  month: number
  year: number
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
  onClose,
}: {
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  onClose: () => void
}) {
  const now = new Date()
  const [state, setState] = React.useState<CalendarState>({
    month: selectedDate?.getMonth() ?? now.getMonth(),
    year: selectedDate?.getFullYear() ?? now.getFullYear(),
  })

  const daysInMonth = getDaysInMonth(state.month, state.year)
  const firstDay = getFirstDayOfMonth(state.month, state.year)
  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const handlePrevMonth = () => {
    setState((prev) => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 }
      }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const handleNextMonth = () => {
    setState((prev) => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 }
      }
      return { ...prev, month: prev.month + 1 }
    })
  }

  const handleDayClick = (day: number) => {
    const newDate = new Date(state.year, state.month, day)
    // Preserve existing time if available
    if (selectedDate) {
      newDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        selectedDate.getSeconds()
      )
    }
    onDateSelect(newDate)
    onClose()
  }

  return (
    <div className="plasmo-absolute plasmo-top-full plasmo-left-0 plasmo-mt-2 plasmo-bg-background plasmo-border plasmo-border-input plasmo-rounded-md plasmo-shadow-lg plasmo-p-4 plasmo-z-50 plasmo-w-80">
      {/* Header */}
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-mb-4">
        <button
          onClick={handlePrevMonth}
          className="plasmo-p-1 plasmo-hover:bg-accent plasmo-rounded plasmo-transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="plasmo-size-4" />
        </button>
        <div className="plasmo-text-sm plasmo-font-semibold">
          {monthNames[state.month]} {state.year}
        </div>
        <button
          onClick={handleNextMonth}
          className="plasmo-p-1 plasmo-hover:bg-accent plasmo-rounded plasmo-transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon className="plasmo-size-4" />
        </button>
      </div>

      {/* Day headers */}
      <div className="plasmo-grid plasmo-grid-cols-7 plasmo-gap-2 plasmo-mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="plasmo-text-xs plasmo-text-muted-foreground plasmo-text-center plasmo-font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="plasmo-grid plasmo-grid-cols-7 plasmo-gap-2">
        {days.map((day, idx) => {
          const isSelected =
            day &&
            selectedDate &&
            day === selectedDate.getDate() &&
            state.month === selectedDate.getMonth() &&
            state.year === selectedDate.getFullYear()

          return (
            <div key={idx}>
              {day ? (
                <button
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "plasmo-w-8 plasmo-h-8 plasmo-rounded plasmo-text-sm plasmo-font-medium plasmo-transition-colors",
                    isSelected
                      ? "plasmo-bg-primary plasmo-text-primary-foreground"
                      : "plasmo-hover:bg-accent plasmo-text-foreground"
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
  )
}

export function DateTimePicker({
  label,
  value,
  onChange,
}: DateTimeInputProps) {
  const [showCalendar, setShowCalendar] = React.useState(false)
  const calendarRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false)
      }
    }

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCalendar])

  const handleDateChange = (newDate: Date) => {
    onChange(newDate)
  }

  const handleTimeChange = (timeString: string) => {
    if (!timeString) {
      return
    }

    const [hours, minutes] = timeString.split(":").map(Number)

    if (value && !isNaN(value.getTime())) {
      const newDate = new Date(value)
      newDate.setHours(hours, minutes, 0)
      onChange(newDate)
    } else {
      const now = new Date()
      now.setHours(hours, minutes, 0)
      onChange(now)
    }
  }

  return (
    <div className={cn("plasmo-flex plasmo-w-full plasmo-gap-4 plasmo-justify-between")}>
      {/* Date Field */}
        <Field className="plasmo-flex plasmo-flex-[3] plasmo-flex-col">
          <FieldLabel>{label}</FieldLabel>
          <div className="plasmo-relative" ref={calendarRef}>
            <InputGroup className={showCalendar ? "plasmo-ring-2 plasmo-ring-ring" : ""}>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className={cn(
                  "plasmo-flex-1 plasmo-text-left plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-shadow-none",
                  value ? "plasmo-text-foreground" : "plasmo-text-muted-foreground",
                  "focus-visible:plasmo-outline-none focus-visible:plasmo-ring-0",
                  "disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50",
                  "hover:plasmo-bg-accent/50 plasmo-transition-colors"
                )}
                data-slot="input-group-control"
              >
                {formatDisplayDate(value)}
              </button>
              <InputGroupAddon align="inline-end">
                <CalendarIcon className="plasmo-size-4 plasmo-text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            {showCalendar && (
              <Calendar
                selectedDate={value}
                onDateSelect={handleDateChange}
                onClose={() => setShowCalendar(false)}
              />
            )}
          </div>
        </Field>

      {/* Time Field */}
        <Field className="plasmo-flex plasmo-flex-[1] plasmo-flex-col">
          <FieldLabel>Time</FieldLabel>
          <InputGroup>
            <input
              type="time"
              data-slot="input-group-control"
              value={formatForTimeInput(value)}
              onChange={(e) => handleTimeChange(e.target.value)}
              className={cn(
                "plasmo-flex-1 plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-shadow-none",
                "plasmo-text-foreground placeholder:plasmo-text-muted-foreground",
                "focus-visible:plasmo-outline-none focus-visible:plasmo-ring-0",
                "disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50",
                "[&::-webkit-calendar-picker-indicator]:plasmo-opacity-0 [&::-webkit-calendar-picker-indicator]:plasmo-absolute"
              )}
            />
            <InputGroupAddon align="inline-end">
              <ClockIcon className="plasmo-size-4 plasmo-text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>
  )
}