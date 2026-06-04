import * as z from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DateTimePicker } from "~components/ui/dateTimePicker"
import AirportCombobox from "~components/ui/airportCombobox"
import AirlineCombobox from "~components/ui/airlineCombobox"

const singleFlightSchema = z.object({
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  airline: z.string().min(1, "Required"),

  departureTime: z
    .date()
    .optional()
    .refine((val) => val instanceof Date, {
      message: "Required"
    }),

  arrivalTime: z
    .date()
    .optional()
    .refine((val) => val instanceof Date, {
      message: "Required"
    }),
})

export const flightFormSchema = z.object({
  flights: z.array(singleFlightSchema).min(1),

  confirmationLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal(""))
})

type FlightFormValues = z.infer<typeof flightFormSchema>

export default function FlightForm() {
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

      confirmationLink: ""
    }
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "flights"
  })

  const onSubmit = (values: FlightFormValues) => {
    // To do: handle form submission, save to Chrome storage
    console.log("Form values:", values)
  }

  return (
    <form
      className="plasmo-flex plasmo-flex-col plasmo-gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="plasmo-flex plasmo-flex-col plasmo-gap-4"
        >
          <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
            <h2 className="plasmo-font-semibold">
              Flight {index + 1}
            </h2>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="plasmo-text-red-500"
              >
                Remove
              </button>
            )}
          </div>

          <DateTimePicker
            label="Departure"
            value={form.watch(`flights.${index}.departureTime`)}
            onChange={(date) => {
              if (date) {
                form.setValue(
                  `flights.${index}.departureTime`,
                  date
                )
              }
            }}
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
          />

          <div className="plasmo-flex plasmo-gap-4">
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

          <AirlineCombobox
            label="Airline"
            value={form.watch(`flights.${index}.airline`)}
            onChange={(icao) => {
              form.setValue(
                `flights.${index}.airline`,
                icao
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
            departureTime: undefined,
            arrivalTime: undefined
          })
        }
        className="plasmo-text-muted-foreground plasmo-text-p plasmo-font-semibold plasmo-self-start"
      >
        + Add return/connecting flight
      </button>

      <button
        type="submit"
        className="plasmo-bg-primary plasmo-text-white plasmo-text-p plasmo-font-semibold plasmo-w-fit plasmo-h-8 plasmo-rounded-md plasmo-px-3 plasmo-self-end"
      >
        Save Flight{fields.length > 1 && "s"}
      </button>
    </form>
  )
}