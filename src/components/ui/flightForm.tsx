import * as z from "zod"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DateTimePicker } from "~components/ui/dateTimePicker"
import AirportCombobox from "~components/ui/airportCombobox"
import AirlineCombobox from "~components/ui/airlineCombobox"
import type { TimelineEvent } from "~types"
import { Field, FieldLabel } from "~/components/ui/field"
import { InputGroup, InputGroupInput } from "~components/ui/input-group"
import { X } from "lucide-react"
import { useRightPanel } from "~context/rightPanelContext"

const singleFlightSchema = z.object({
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  airline: z.string().min(1, "Required"),
  airlinePhoto: z.url(),
  departureTime: z.date({error: "Required"}),
  arrivalTime: z.date({ error: "Required" })
})

.superRefine((data, ctx) => {
  if (data.arrivalTime <= data.departureTime) {
    ctx.addIssue({
      code: "custom",
      message: "Arrival must be after departure",
      path: ["arrivalTime"]
    })
  }
})

export const flightFormSchema = z.object({
  flights: z.array(singleFlightSchema).min(1),
  confirmationLink: z
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")) // for empty confirmation link state
})

type FlightFormValues = z.infer<typeof flightFormSchema>

export default function FlightForm ({militaryTime, addEvents}: {militaryTime: boolean, addEvents: (event: TimelineEvent[]) => void}) {

  const {setPanel} = useRightPanel()

  const [showConfirmationField, setShowConfirmationField] = useState(false)

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),

    defaultValues: {
      flights: [
        {
          origin: "",
          destination: "",
          airline: "",
          airlinePhoto: "",
          departureTime: undefined,
          arrivalTime: undefined
        }
      ],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flights"
  })

const onSubmit = (values: FlightFormValues) => {
  addEvents(values.flights.map(flight => ({
    type: "flight" as const,
    id: crypto.randomUUID(),
    origin: flight.origin,
    destination: flight.destination,
    airline: flight.airline,
    airlinePhoto: flight.airlinePhoto,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    confirmationLink: values.confirmationLink || undefined
  })))
  setPanel('ambient')
}


  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-4">
      <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
        <h1 className="plasmo-text-2xl plasmo-font-semibold">Add new flight</h1>
        <button className="plasmo-text-gray-600 hover:plasmo-text-destructive plasmo-transition-colors plasmo-duration-200 plasmo-ease-in-out" onClick={() => setPanel("ambient")}><X /></button>
      </div>
      <form
        className="plasmo-flex plasmo-flex-col plasmo-gap-4"
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log("validation errors", errors))}
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="plasmo-flex plasmo-flex-col plasmo-gap-3"
          >

            {fields.length > 1 && (
            <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
                <h2 className="plasmo-font-semibold">Flight {index + 1}</h2>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="plasmo-text-red-500"
                >
                  Remove
                </button>
            </div>
            )}

            <DateTimePicker
              label="Departure"
              value={form.watch(`flights.${index}.departureTime`)}
              onChange={(date) => {
                if (date) {
                  // 1. Set the departure time normally
                  form.setValue(`flights.${index}.departureTime`, date)

                  // 2. Grab the current value of arrival time for this specific flight index
                  const currentArrival = form.getValues(`flights.${index}.arrivalTime`)
                  
                  // 3. Create a target date object for the updated arrival
                  const newArrival = currentArrival ? new Date(currentArrival) : new Date(date)
                  
                  // 4. Force the arrival date to match the new departure date
                  newArrival.setFullYear(date.getFullYear())
                  newArrival.setMonth(date.getMonth())
                  newArrival.setDate(date.getDate())

                  // 5. Update the arrival time in React Hook Form's state
                  form.setValue(`flights.${index}.arrivalTime`, newArrival)
                }
              }}
              militaryTime={militaryTime}
              error={form.formState.errors.flights?.[index]?.departureTime?.message}
              onOpen={() => form.clearErrors(`flights.${index}.departureTime`)}
            />

            <DateTimePicker
              label="Arrival"
              value={form.watch(`flights.${index}.arrivalTime`)}
              onChange={(date) => {
                if (date) {
                  form.setValue(
                    `flights.${index}.arrivalTime`,
                    date
                  )
                }
              }}
              militaryTime={militaryTime}
              error={form.formState.errors.flights?.[index]?.arrivalTime?.message}
              onOpen={() => form.clearErrors(`flights.${index}.arrivalTime`)}
            />

            <div className="plasmo-flex plasmo-gap-4">
              <div className="plasmo-flex-1 plasmo-min-w-0">
                <AirportCombobox
                label="Origin"
                value={form.watch(`flights.${index}.origin`)}
                onChange={(iata) => {
                  form.setValue(
                    `flights.${index}.origin`,
                    iata
                  )
                }}
                error={form.formState.errors.flights?.[index]?.origin?.message}
                onOpen={() => form.clearErrors(`flights.${index}.origin`)}
                />
              </div>
            
              <div className="plasmo-flex-1 plasmo-min-w-0">
                <AirportCombobox
                label="Destination"
                value={form.watch(`flights.${index}.destination`)}
                onChange={(iata) => {
                  form.setValue(
                    `flights.${index}.destination`,
                    iata
                  )
                }}
                error={form.formState.errors.flights?.[index]?.destination?.message}
                onOpen={() => form.clearErrors(`flights.${index}.destination`)}
                />
              </div>
            </div>

            <AirlineCombobox
              label="Airline"
              value={form.watch(`flights.${index}.airline`)}
              onChange={(name, airlinePhoto) => {
                form.setValue(`flights.${index}.airline`, name)
                form.setValue(`flights.${index}.airlinePhoto`, airlinePhoto)
              }}
              error={form.formState.errors.flights?.[index]?.airline?.message}
              onOpen={() => form.clearErrors(`flights.${index}.airline`)}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              origin: "",
              destination: "",
              airline: "",
              airlinePhoto: "",
              departureTime: undefined as unknown as Date,
              arrivalTime: undefined as unknown as Date
            })
          }
          className="plasmo-text-muted-foreground plasmo-text-sm plasmo-font-semibold plasmo-self-start hover:plasmo-text-foreground plasmo-transition-colors"
        >
          + Add return/connecting flight
        </button>

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
          className="plasmo-bg-primary plasmo-text-white plasmo-text-p plasmo-font-semibold plasmo-w-fit plasmo-h-9 plasmo-rounded-md plasmo-px-3 plasmo-self-end"
        >
          Save flight{fields.length > 1 && "s"}
        </button>
      </form>
    </div>
  )
}