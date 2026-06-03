import * as z from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "~/components/ui/field"

export const flightFormSchema = z.object({
  origin: z.string().min(1, "Required"),
  destination: z.string().min(1, "Required"),
  airline: z.string().min(1, "Required"),
  departureTime: z.date().refine(val => val instanceof Date, { message: "Required" }),
  arrivalTime: z.date().refine(val => val instanceof Date, { message: "Required" }),
  confirmationLink: z.string().url("Must be a valid URL").optional().or(z.literal(""))
})

export default function FlightForm() {
  const form = useForm<z.infer<typeof flightFormSchema>>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      airline: "",
      departureTime: undefined,
      arrivalTime: undefined,
      confirmationLink: "",
    },
  })

  const onSubmit = (values: z.infer<typeof flightFormSchema>) => {
    // TODO - handle form submission by saving to Chrome storage
    console.log("Form values:", values)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel>
          Name on Card
        </FieldLabel>
        <Input
          id="checkout-7j9-card-name-43j"
          placeholder="Evil Rabbit"
          required
        />
      </Field>
    </form>
  )
}