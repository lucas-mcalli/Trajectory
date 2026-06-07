import * as z from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DateTimePicker } from "~components/ui/dateTimePicker"
import AirportCombobox from "~components/ui/airportCombobox"
import AirlineCombobox from "~components/ui/airlineCombobox"
import { Storage } from "@plasmohq/storage"
import type { TripEvent } from "~types"

const singleFlightSchema = z.object({
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  airline: z.string().min(1, "Required"),
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
  confirmationLink: z.url("Must be a valid URL").optional()
})

type FlightFormValues = z.infer<typeof flightFormSchema>

export default function FlightForm ({militaryTime, addEvent}: {militaryTime: boolean, addEvent: (event: TripEvent) => void}) {

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),

    defaultValues: {
      flights: [
        {
          origin: "",
          destination: "",
          airline: "",
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
    values.flights.forEach(flight => {
      addEvent({
        type: "flight",
        origin: flight.origin,
        destination: flight.destination,
        airline: flight.airline,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime
      })
    })
  }


  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-4">
      <h1 className="plasmo-text-2xl plasmo-font-semibold">Add new flight</h1>
      <form
        className="plasmo-flex plasmo-flex-col plasmo-gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
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
                />
              </div>
            </div>

            <AirlineCombobox
              label="Airline"
              value={form.watch(`flights.${index}.airline`)}
              onChange={(name) => {
                form.setValue(
                  `flights.${index}.airline`,
                  name
                )
              }}
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
              departureTime: undefined as unknown as Date,
              arrivalTime: undefined as unknown as Date
            })
          }
          className="plasmo-text-muted-foreground plasmo-text-sm plasmo-font-semibold plasmo-self-start hover:plasmo-text-foreground plasmo-transition-colors"
        >
          + Add return/connecting flight
        </button>

        <button
          type="submit"
          className="plasmo-bg-primary plasmo-text-white plasmo-text-p plasmo-font-semibold plasmo-w-fit plasmo-h-8 plasmo-rounded-md plasmo-px-3 plasmo-self-end"
        >
          Save flight{fields.length > 1 && "s"}
        </button>
      </form>
    </div>
  )
}