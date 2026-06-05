import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "lucide-react"

import { DateTimePicker } from "~components/ui/dateTimePicker"
import { Field, FieldLabel } from "./field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"

const StayFormSchema = z.object({
  name: z.string().min(1, "Required"),
  guests: z.number().min(1, { error: "At least 1 guest" }),
  location: z.string().min(1, "Required"),
  checkInTime: z.date({ error: "Required" }),
  checkOutTime: z.date({ error: "Required" }),
  confirmationLink: z.url("Must be a valid URL")
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

export default function StayForm ({militaryTime}: {militaryTime: boolean}) {

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


  const onSubmit = async (values: StayFormValues) => {
    // TODO: Figure out Plasmo storage after building all components. Here, we have a 'stay' object, which wouldn't work because we need something to hold flights, stays, and daytrips to build the timeline component.
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
              // 1. Set the check-in time normally
              form.setValue(`checkInTime`, date)

              // 2. Grab the current value of check-out time for this specific stay index
              const currentCheckOut = form.getValues(`checkOutTime`)

              // 3. Create a target date object for the updated check-out
              const newCheckOut = currentCheckOut ? new Date(currentCheckOut) : new Date(date)  

              // 4. Force the check-out date to match the new check-in date
              newCheckOut.setFullYear(date.getFullYear())
              newCheckOut.setMonth(date.getMonth())
              newCheckOut.setDate(date.getDate())

              // 5. Update the check-out time in React Hook Form's state
              form.setValue(`checkOutTime`, newCheckOut)
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

         <Field>
            <FieldLabel>Confirmation Link</FieldLabel>
            <InputGroup>
              <InputGroupInput {...form.register("confirmationLink")} />
            </InputGroup>
          </Field>

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