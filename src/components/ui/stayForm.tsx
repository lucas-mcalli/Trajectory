import * as z from "zod"
import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import Icon from '@mdi/react';
import { mdiCreation } from '@mdi/js';
import { DateTimePicker } from "~components/ui/dateTimePicker"
import { Field, FieldLabel } from "./field"
import { InputGroup, InputGroupInput } from "./input-group"
import CitiesCombobox from "./citiesCombobox"
import type { TimelineEvent } from "~types"
import { useRightPanel } from "~context/rightPanelContext"
import { getEventEndTime } from "~helpers"
import LOCATIONS_DATA from "~/data/cities.json"
import type { LocationEntry } from "~/types"

const ALL_LOCATIONS: LocationEntry[] = LOCATIONS_DATA as LocationEntry[]

const createStayFormSchema = (existingEvents: TimelineEvent[]) => z.object({
  name: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  checkInTime: z.date({ error: "Required" }),
  checkOutTime: z.date({ error: "Required" }),
  flagLink: z.url("Must be a valid URL"),
  confirmationLink: z
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")) // for empty confirmation link state
}).superRefine((data, ctx) => {
  if (data.checkOutTime <= data.checkInTime) {
    ctx.addIssue({
      code: "custom",
      message: "Check-out must be after check-in",
      path: ["checkOutTime"]
    })
  }

  if (existingEvents.some((event) => event.type === "stay" && data.checkInTime < event.checkOut && data.checkOutTime > event.checkIn)) {
    ctx.addIssue({
      code: "custom",
      message: "This stay overlaps an existing stay",
      path: ["checkInTime"]
    })
  }
})

type StayFormValues = z.infer<ReturnType<typeof createStayFormSchema>>

export default function StayForm ({militaryTime, addEvents, events, rawEvents, onAutofill}: {militaryTime: boolean, addEvents: (event: TimelineEvent[]) => void, events: TimelineEvent[], rawEvents: TimelineEvent[], onAutofill: (onResult: (data: any) => void) => void}) {
    const [showConfirmationField, setShowConfirmationField] = React.useState(false)
  const StayFormSchema = React.useMemo(() => createStayFormSchema(events), [events])

  const form = useForm<StayFormValues>({
    resolver: zodResolver(StayFormSchema),
    defaultValues: {
      name: "",
      location: "",
      checkInTime: undefined as unknown as Date,
      checkOutTime: undefined as unknown as Date,
    }
  })


  const onSubmit = (values: StayFormValues) => {
    console.log("submitting", values)
    console.log("errors", form.formState.errors)
    addEvents([{
      type: "stay",
      id: crypto.randomUUID(),
      name: values.name,
      location: values.location,
      checkIn: values.checkInTime,
      checkOut: values.checkOutTime,
      flagLink: values.flagLink,
      confirmationLink: values.confirmationLink
    }])
    setPanel('ambient')
  }

  const { setPanel } = useRightPanel()

  const mostRecentEvent = rawEvents.length > 0 ? rawEvents[rawEvents.length - 1] : undefined
  const defaultMonth = mostRecentEvent ? getEventEndTime(mostRecentEvent) : undefined

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-4">
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <button className="plasmo-text-gray-600 hover:plasmo-text-destructive plasmo-transition-colors plasmo-duration-200 plasmo-ease-in-out" onClick={() => setPanel("ambient")}><ChevronLeft /></button>
          <h1 className="plasmo-text-2xl plasmo-font-semibold">Add stay</h1>
        </div>
        <button
          type="button"
          onClick={() => onAutofill((apiResponse) => {
            const stay = apiResponse.decision
            const match = ALL_LOCATIONS.find(loc => loc.city.toLowerCase() === stay.city.toLowerCase() && loc.country.toLowerCase() === stay.country.toLowerCase())
            form.setValue("name", stay.name)
            form.setValue("checkInTime", new Date(stay.checkIn))
            form.setValue("checkOutTime", new Date(stay.checkOut))
            form.setValue("location", `${stay.city}, ${stay.country}`)
            form.setValue("flagLink", match?.flag ?? "")
          })}
          // disabled={isAutofilling}
          className="plasmo-inline-flex plasmo-items-center plasmo-gap-1.5 plasmo-text-p plasmo-font-semibold plasmo-cursor-pointer plasmo-transition-opacity plasmo-bg-transparent"
          style={{ opacity: 0.75 }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.75")}
        >
          <Icon path={mdiCreation} size={0.75} style={{ color: "#7c3aed" }} />
          <span className="ai-gradient-text">Autofill from page</span>
        </button>
      </div>
      <form className="plasmo-flex plasmo-flex-col plasmo-gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="plasmo-flex plasmo-gap-4">
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
        </div>
        <DateTimePicker
          label="Check-in"
          value={form.watch(`checkInTime`)}
          onChange={(date) => {
            if (date) {
              form.setValue(`checkInTime`, date)
            }
          }}
          militaryTime={militaryTime}
          error={form.formState.errors.checkInTime?.message}
          onOpen={() => form.clearErrors(`checkInTime`)} 
          defaultMonth={defaultMonth}     
        />

        <DateTimePicker
          label="Check-out"
          value={form.watch(`checkOutTime`)}
          onChange={(date) => {
            if (date) {
              form.setValue(
                `checkOutTime`,
                date
              )
            }
          }}
          militaryTime={militaryTime}
          defaultMonth={form.watch("checkInTime")}
          error={form.formState.errors.checkOutTime?.message}
          onOpen={() => form.clearErrors(`checkOutTime`)}         
        />

        <CitiesCombobox
          label="Location"
          value={form.watch("location")}
          onChange={(location) => {
            if (!location) {
              form.setValue("location", "")
              form.setValue("flagLink", "")
              return
            }
            form.setValue("location", `${location.city}, ${location.country}`)
            form.setValue("flagLink", location.flag)
          }}
          error={form.formState.errors.location?.message ?? form.formState.errors.flagLink?.message}
          onOpen={() => {
            form.clearErrors("location")
            form.clearErrors("flagLink")
          }}
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
          className="plasmo-bg-primary plasmo-text-white plasmo-text-p plasmo-font-semibold plasmo-w-fit plasmo-h-8 plasmo-rounded-md plasmo-px-3 plasmo-self-end"
        >
          Save stay
        </button>
      </form>
    </div>
  )
}