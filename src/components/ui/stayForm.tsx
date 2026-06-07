import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "lucide-react"

import { DateTimePicker } from "~components/ui/dateTimePicker"
import { Field, FieldLabel } from "./field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"
import CitiesCombobox from "./citiesCombobox"
import type { TripEvent } from "~types"

const StayFormSchema = z.object({
  name: z.string().min(1, "Required"),
  guests: z.number().min(1, { error: "At least 1 guest" }),
  location: z.string().min(1, "Required"),
  checkInTime: z.date({ error: "Required" }),
  checkOutTime: z.date({ error: "Required" }),
  flagLink: z.url("Must be a valid URL"),
  confirmationLink: z.url("Must be a valid URL").optional()
}).superRefine((data, ctx) => {
  if (data.checkOutTime <= data.checkInTime) {
    ctx.addIssue({
      code: "custom",
      message: "Check-out must be after check-in",
      path: ["checkOutTime"]
    })
  }
})

type StayFormValues = z.infer<typeof StayFormSchema>

export default function StayForm ({militaryTime, addEvent}: {militaryTime: boolean, addEvent: (event: TripEvent) => void}) {

  const form = useForm<StayFormValues>({
    resolver: zodResolver(StayFormSchema),
    defaultValues: {
      name: "",
      guests: 1,
      location: "",
      checkInTime: undefined as unknown as Date,
      checkOutTime: undefined as unknown as Date,
    }
  })


  const onSubmit = (values: StayFormValues) => {
    console.log("submitting", values)
    console.log("errors", form.formState.errors)
    addEvent({
      type: "stay",
      name: values.name,
      guests: values.guests,
      location: values.location,
      checkIn: values.checkInTime,
      checkOut: values.checkOutTime,
      flagLink: values.flagLink,
      confirmationLink: values.confirmationLink
    })
  }


  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-4">
      <h1 className="plasmo-text-2xl plasmo-font-semibold">Add new stay</h1>
      <form className="plasmo-flex plasmo-flex-col plasmo-gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="plasmo-flex plasmo-gap-4">
          <Field className="plasmo-flex-[3]">
            <FieldLabel>Name</FieldLabel>
            <InputGroup>
              <InputGroupInput {...form.register("name")} />
            </InputGroup>
          </Field>
          <Field className="plasmo-flex-1">
            <FieldLabel>Guests</FieldLabel>
            <InputGroup>
              <InputGroupInput {...form.register("guests", { valueAsNumber: true })} type="number" min="1" />
              <InputGroupAddon align="inline-end">
                <User className="plasmo-size-4" />
              </InputGroupAddon>
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
        />

        < CitiesCombobox
          label="Location"
          value={form.watch(`location`)}
          onChange={(location) => {
            if (!location) {
              form.setValue("location", "")
              form.setValue("flagLink", "")
              return
            }
            form.setValue("location", `${location.city}, ${location.country}`)
            form.setValue("flagLink", location.flag)
          }}
        />

         <Field>
            <FieldLabel>Confirmation Link</FieldLabel>
            <InputGroup>
              <InputGroupInput type="url"  {...form.register("confirmationLink")} />
            </InputGroup>
          </Field>

        <button
          type="submit"
          className="plasmo-bg-primary plasmo-text-white plasmo-text-p plasmo-font-semibold plasmo-w-fit plasmo-h-8 plasmo-rounded-md plasmo-px-3 plasmo-self-end"
        >
          Save stay
        </button>
      </form>
      <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
    </div>
  )
}