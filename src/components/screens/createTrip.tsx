import CreateTripForm from "~/components/ui/createTripForm"
import type { Trip } from "~/types"
import TripFormPreview from "~components/ui/tripFormPreview"
import { useState } from "react" 

export default function CreateTripScreen({ onComplete }: { onComplete: (trip: Trip) => void; }) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>("")

  return (
    <div className="plasmo-h-full plasmo-flex plasmo-gap-8 plasmo-py-8 plasmo-px-4">
      <div className="plasmo-w-[calc(3/7*100%)]">
        <CreateTripForm onComplete={onComplete} onChangeRegion={setSelectedRegionId} />
      </div>
      <div className="plasmo-w-[calc(4/7*100%)]">
        <TripFormPreview regionId={selectedRegionId} />
      </div>
    </div>
  )
}