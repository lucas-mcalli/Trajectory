import * as React from "react"
import { CalendarIcon } from "lucide-react"
 
import { cn } from "~/lib/utils"
import { Field, FieldLabel } from "~/components/ui/field"
import { InputGroup, InputGroupAddon } from "~/components/ui/input-group"
 
export type DateTimeInputProps = {
  label: string
  value?: Date
  onChange: (date: Date | undefined) => void
  className?: string
}
 
function formatForInput(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return ""
  // datetime-local requires "YYYY-MM-DDTHH:MM"
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  )
}
 
export function TimeDatePicker({
  label,
  value,
  onChange,
  className,
}: DateTimeInputProps) {
  return (
    <Field className={className}>
      <FieldLabel>{label}</FieldLabel>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <CalendarIcon className="plasmo-size-4 plasmo-text-muted-foreground" />
        </InputGroupAddon>
        <input
          type="datetime-local"
          data-slot="input-group-control"
          value={formatForInput(value)}
          onChange={(e) => {
            const val = e.target.value
            if (!val) {
              onChange(undefined)
              return
            }
            const parsed = new Date(val)
            onChange(isNaN(parsed.getTime()) ? undefined : parsed)
          }}
          className={cn(
            "plasmo-flex-1 plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-px-2 plasmo-py-2 plasmo-text-sm plasmo-shadow-none",
            "plasmo-text-foreground placeholder:plasmo-text-muted-foreground",
            "focus-visible:plasmo-outline-none focus-visible:plasmo-ring-0",
            "disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50",
            // Hide the native calendar picker icon since we show our own
            "[&::-webkit-calendar-picker-indicator]:plasmo-opacity-0 [&::-webkit-calendar-picker-indicator]:plasmo-absolute"
          )}
        />
      </InputGroup>
    </Field>
  )
}