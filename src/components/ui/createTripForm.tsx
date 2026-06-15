import { useState } from "react"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "~/components/ui/button"
import { Field, FieldLabel } from "~/components/ui/field"
import { InputGroup, InputGroupInput } from "~/components/ui/input-group"
import RegionCombobox from "~/components/ui/regionCombobox"
import REGIONS_DATA from "~/data/regions.json"
import type { Trip } from "~/types"
import { fetchLocationPhoto } from "~helpers"

const createTripSchema = z.object({
  name: z.string().min(1, "Trip name is required"),
  regionId: z.string().min(1, "Region is required"),
})

type CreateTripValues = z.infer<typeof createTripSchema>

export default function CreateTripForm({ onComplete, onChangeRegion }: { onComplete: (trip: Trip) => void; onChangeRegion: (regionId: string) => void }) {
  const [loading, setLoading] = useState(false)

  const form = useForm<CreateTripValues>({
    resolver: zodResolver(createTripSchema),
    defaultValues: { name: "", regionId: "" },
    shouldFocusError: false
  })

  const nameError = form.formState.errors.name?.message
  const regionError = form.formState.errors.regionId?.message

  const onSubmit = async (values: CreateTripValues) => {
    setLoading(true)
    const region = REGIONS_DATA.find((r: { id: string; label: string }) => r.id === values.regionId)
    const coverPhotoUrl = region ? await fetchLocationPhoto(region.label) : ""

    const newTrip: Trip = {
      id: String(Date.now()),
      name: values.name,
      coverPhotoUrl: coverPhotoUrl ?? undefined,
      regionId: values.regionId,
    }

    setLoading(false)
    onComplete(newTrip)
  }

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-gap-6">
      <div>
        <h2 className="plasmo-text-h2 plasmo-font-semibold plasmo-text-foreground">New trip</h2>
        <p className="plasmo-text-p plasmo-text-muted-foreground plasmo-mt-1">Give your trip a name and pick a region to get started building a timeline.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="plasmo-flex plasmo-flex-col plasmo-gap-4 plasmo-flex-1">

        <Field>
          <div className="plasmo-flex plasmo-justify-between plasmo-items-end">
            <FieldLabel>Name of trip</FieldLabel>
            {nameError && <p className="plasmo-text-xs plasmo-text-destructive">{nameError}</p>}
          </div>
          <InputGroup className={nameError ? "plasmo-ring-2 plasmo-ring-destructive" : ""}>
            <InputGroupInput
              {...form.register("name")}
            />
          </InputGroup>
        </Field>

        <RegionCombobox
          label="Region"
          value={form.watch("regionId")}
          onChange={(id: string) => {
            form.setValue("regionId", id)
            onChangeRegion(id)
          }}
          error={regionError}
        />

        <div className="plasmo-mt-auto plasmo-pb-[2px]">
          <Button type="submit" className="plasmo-w-full" disabled={loading}>
            {loading ? "Creating..." : "Create trip"}
          </Button>
        </div>
      </form>
    </div>
  )
}