import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "src/lib/utils"
import { Button, buttonVariants } from "src/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "plasmo-bg-background plasmo-group/calendar plasmo-p-3 plasmo-[--cell-size:2rem] [[data-slot=card-content]_&]:plasmo-bg-transparent [[data-slot=popover-content]_&]:plasmo-bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("plasmo-w-fit", defaultClassNames.root),
        months: cn(
          "plasmo-relative plasmo-flex plasmo-flex-col plasmo-gap-4 md:plasmo-flex-row",
          defaultClassNames.months
        ),
        month: cn("plasmo-flex plasmo-w-full plasmo-flex-col plasmo-gap-4", defaultClassNames.month),
        nav: cn(
          "plasmo-absolute plasmo-inset-x-0 plasmo-top-0 plasmo-flex plasmo-w-full plasmo-items-center plasmo-justify-between plasmo-gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "plasmo-h-[--cell-size] plasmo-w-[--cell-size] plasmo-select-none plasmo-p-0 aria-disabled:plasmo-opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "plasmo-h-[--cell-size] plasmo-w-[--cell-size] plasmo-select-none plasmo-p-0 aria-disabled:plasmo-opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "plasmo-flex plasmo-h-[--cell-size] plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "plasmo-flex plasmo-h-[--cell-size] plasmo-w-full plasmo-items-center plasmo-justify-center plasmo-gap-1.5 plasmo-text-sm plasmo-font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:plasmo-border-ring plasmo-border-input plasmo-shadow-xs has-focus:plasmo-ring-ring/50 has-focus:plasmo-ring-[3px] plasmo-relative plasmo-rounded-md plasmo-border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "plasmo-bg-popover plasmo-absolute plasmo-inset-0 plasmo-opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "plasmo-select-none plasmo-font-medium",
          captionLayout === "label"
            ? "plasmo-text-sm"
            : "[&>svg]:plasmo-text-muted-foreground plasmo-flex plasmo-h-8 plasmo-items-center plasmo-gap-1 plasmo-rounded-md plasmo-pl-2 plasmo-pr-1 plasmo-text-sm [&>svg]:plasmo-size-3.5",
          defaultClassNames.caption_label
        ),
        table: "plasmo-w-full plasmo-border-collapse",
        weekdays: cn("plasmo-flex", defaultClassNames.weekdays),
        weekday: cn(
          "plasmo-text-muted-foreground plasmo-flex-1 plasmo-select-none plasmo-rounded-md plasmo-text-[0.8rem] plasmo-font-normal",
          defaultClassNames.weekday
        ),
        week: cn("plasmo-mt-2 plasmo-flex plasmo-w-full", defaultClassNames.week),
        week_number_header: cn(
          "plasmo-w-[--cell-size] plasmo-select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "plasmo-text-muted-foreground plasmo-select-none plasmo-text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "plasmo-group/day plasmo-relative plasmo-aspect-square plasmo-h-full plasmo-w-full plasmo-select-none plasmo-p-0 plasmo-text-center [&:first-child[data-selected=true]_button]:plasmo-rounded-l-md [&:last-child[data-selected=true]_button]:plasmo-rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "plasmo-bg-accent plasmo-rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("plasmo-rounded-none", defaultClassNames.range_middle),
        range_end: cn("plasmo-bg-accent plasmo-rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "plasmo-bg-accent plasmo-text-accent-foreground plasmo-rounded-md data-[selected=true]:plasmo-rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "plasmo-text-muted-foreground aria-selected:plasmo-text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "plasmo-text-muted-foreground plasmo-opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("plasmo-invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("plasmo-size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("plasmo-size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("plasmo-size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="plasmo-flex plasmo-size-[--cell-size] plasmo-items-center plasmo-justify-center plasmo-text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:plasmo-bg-primary data-[selected-single=true]:plasmo-text-primary-foreground data-[range-middle=true]:plasmo-bg-accent data-[range-middle=true]:plasmo-text-accent-foreground data-[range-start=true]:plasmo-bg-primary data-[range-start=true]:plasmo-text-primary-foreground data-[range-end=true]:plasmo-bg-primary data-[range-end=true]:plasmo-text-primary-foreground group-data-[focused=true]/day:plasmo-border-ring group-data-[focused=true]/day:plasmo-ring-ring/50 plasmo-flex plasmo-aspect-square plasmo-h-auto plasmo-w-full plasmo-min-w-[--cell-size] plasmo-flex-col plasmo-gap-1 plasmo-font-normal plasmo-leading-none data-[range-end=true]:plasmo-rounded-md data-[range-middle=true]:plasmo-rounded-none data-[range-start=true]:plasmo-rounded-md group-data-[focused=true]/day:plasmo-relative group-data-[focused=true]/day:plasmo-z-10 group-data-[focused=true]/day:plasmo-ring-[3px] [&>span]:plasmo-text-xs [&>span]:plasmo-opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
