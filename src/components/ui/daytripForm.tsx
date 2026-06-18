import * as React from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Switch } from "~/components/ui/switch"
import { DateTimePicker } from "~components/ui/dateTimePicker"
import { TimePicker } from "~/components/ui/timePicker"
import { Field, FieldLabel } from "./field"
import { InputGroup, InputGroupInput } from "./input-group"
import type { TimelineEvent } from "~types"
import { X } from "lucide-react"
import { useRightPanel } from "~context/rightPanelContext"
import { getEventEndTime } from "~helpers"
 

const DaytripFormSchema = z.object({
  name: z.string().min(1, "Required"),
  departureTime: z.date({ error: "Required" }),
  returnTime: z.date({ error: "Required" }),
  returnsNextDay: z.boolean(),
  confirmationLink: z
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")) // for empty confirmation link state
})

type DaytripFormValues = z.input<typeof DaytripFormSchema>

export default function DaytripForm({ militaryTime, addEvents, rawEvents }: { militaryTime: boolean, addEvents: (event: TimelineEvent[]) => void, rawEvents: TimelineEvent[] }) {

  const [showConfirmationField, setShowConfirmationField] = React.useState(false)

  const form = useForm<DaytripFormValues>({
    resolver: zodResolver(DaytripFormSchema),
    defaultValues: {
      name: "",
      departureTime: undefined as unknown as Date,
      returnTime: undefined as unknown as Date,
      returnsNextDay: false
    },
  })

  const isReturnsNextDay = form.watch("returnsNextDay")

  const onSubmit = (values: DaytripFormValues) => {
    addEvents([{
      type: "daytrip",
      id: crypto.randomUUID(),
      name: values.name,
      departureTime: values.departureTime,
      returnTime: values.returnTime,
      returnsNextDay: values.returnsNextDay,
      confirmationLink: values.confirmationLink,
      isActiveDuringStay: false, // This can be enhanced later to check against stay dates
    }])
    setPanel('ambient')
  }

  const { setPanel } = useRightPanel()

  const mostRecentEvent = rawEvents.length > 0 ? rawEvents[rawEvents.length - 1] : undefined
  const defaultMonth = mostRecentEvent ? getEventEndTime(mostRecentEvent) : undefined

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-4 plasmo-w-full plasmo-max-w-md">
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
        <h1 className="plasmo-text-2xl plasmo-font-semibold">Add new daytrip</h1>
        <button className="plasmo-text-gray-600 hover:plasmo-text-destructive plasmo-transition-colors plasmo-duration-200 plasmo-ease-in-out" onClick={() => setPanel("ambient")}><X /></button>
      </div>

      <form className="plasmo-flex plasmo-flex-col plasmo-gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field className="plasmo-flex-[3]">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-end">
              <FieldLabel>Name</FieldLabel>
              {form.formState.errors.name && (
                <p className="plasmo-text-xs plasmo-text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            <InputGroup>
              <InputGroupInput {...form.register("name")} aria-invalid={!!form.formState.errors.name} />
            </InputGroup>
          </Field>

        <div className="plasmo-flex plasmo-flex-col plasmo-gap-1.5">
          <div className="plasmo-flex plasmo-items-center plasmo-justify-end plasmo-w-full">
            
            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
              <label 
                htmlFor="returns-next-day" 
                className="plasmo-text-sm plasmo-text-muted-foreground plasmo-cursor-pointer select-none"
              >
                Returns next day?
              </label>
              <Switch
                id="returns-next-day"
                checked={isReturnsNextDay}
                onCheckedChange={(checked) => form.setValue("returnsNextDay", checked)}
              />
            </div>
          </div>

          <DateTimePicker
            value={form.watch("departureTime")}
            label="Departure"
            onChange={(date) => {
              if (date) {
                form.setValue("departureTime", date)
                
                const currentReturn = form.getValues("returnTime")
                const newReturn = currentReturn ? new Date(currentReturn) : new Date(date)
                
                newReturn.setFullYear(date.getFullYear())
                newReturn.setMonth(date.getMonth())
                newReturn.setDate(date.getDate())
                
                form.setValue("returnTime", newReturn)
              }
            }}
            militaryTime={militaryTime}
            error={form.formState.errors.departureTime?.message}
            onOpen={() => form.clearErrors(`departureTime`)}
            defaultMonth={defaultMonth}
          />
        </div>

          <TimePicker
            value={form.watch("returnTime")}
            label="Return Time"
            onChange={(date) => date && form.setValue("returnTime", date)}
            militaryTime={militaryTime}
            showNextDayIndicator={isReturnsNextDay}
            error={form.formState.errors.returnTime?.message}
            onOpen={() => form.clearErrors(`returnTime`)}
          />

        {showConfirmationField ? (
          <Field>
            <FieldLabel>Confirmation Link</FieldLabel>
            <InputGroup>
              <InputGroupInput 
                type="url"  
                {...form.register("confirmationLink")} 
              />
            </InputGroup>
            {form.formState.errors.confirmationLink && (
              <p className="plasmo-text-xs plasmo-text-destructive plasmo-mt-1">
                {form.formState.errors.confirmationLink.message}
              </p>
            )}
          </Field>
        ) : (
          <button
            type="button"
            onClick={() => setShowConfirmationField(true)}
            className="plasmo-text-muted-foreground plasmo-text-sm plasmo-font-semibold plasmo-self-start hover:plasmo-text-foreground plasmo-transition-colors plasmo-mt-1"
          >
            + Add confirmation link
          </button>
        )}

        <button
          type="submit"
          className="plasmo-bg-primary plasmo-text-white plasmo-text-p plasmo-font-semibold plasmo-w-fit plasmo-h-8 plasmo-rounded-md plasmo-px-3 plasmo-self-end plasmo-mt-2"
        >
          Save daytrip
        </button>
      </form>
    </div>
  )
}