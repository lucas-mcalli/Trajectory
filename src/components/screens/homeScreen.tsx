import { useState } from "react"
import { Plus, MoreHorizontal } from "lucide-react"
import { cn } from "~/lib/utils"
import type { Trip } from "~/types"
import React from "react"
import TripCard from "~/components/ui/tripEvent"

const SAMPLE_TRIPS: Trip[] = [
  {
    id: "1",
    name: "Trip to Europe",
    outboundFlight: undefined,
    returnFlight: undefined,
    events: [],
    coverPhotoUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    createdAt: new Date().toISOString(),
    startDate: new Date("2024-07-12"),
    endDate: new Date("2024-07-24"),
    destinationCount: 3,
  },
  {
    id: "2",
    name: "Miami Weekend",
    outboundFlight: undefined,
    returnFlight: undefined,
    events: [],
    coverPhotoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    createdAt: new Date().toISOString(),
    startDate: new Date("2024-08-02"),
    endDate: new Date("2024-08-05"),
    destinationCount: 1,
  },
    {
    id: "3",
    name: "Miami Weekend",
    outboundFlight: undefined,
    returnFlight: undefined,
    events: [],
    coverPhotoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    createdAt: new Date().toISOString(),
    startDate: new Date("2024-08-02"),
    endDate: new Date("2024-08-05"),
    destinationCount: 1,
  },
]

export default function HomeScreen({ onSelectTrip, onCreateTrip }: {
  onSelectTrip: (trip: Trip) => void
  onCreateTrip: () => void
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const trips = SAMPLE_TRIPS

  return (
    <main className="plasmo-flex plasmo-flex-col plasmo-h-full plasmo-overflow-hidden">
      
      <div 
        ref={scrollRef}
        onWheel={(e) => {
          e.preventDefault()
          scrollRef.current!.scrollLeft += e.deltaY
        }}
        className="plasmo-scroll-smooth plasmo-flex plasmo-flex-row plasmo-gap-3 plasmo-overflow-x-auto -plasmo-mx-4 plasmo-px-4 plasmo-py-4 plasmo-h-5/6 [&::-webkit-scrollbar]:plasmo-hidden"
      >
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip as any}
            onClick={() => onSelectTrip(trip)}
          />
        ))}
      </div>

      <div className="plasmo-flex plasmo-items-center plasmo-justify-end plasmo-px-4 plasmo-h-1/6 -plasmo-translate-y-2">
        <button
          onClick={onCreateTrip}
          className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-p plasmo-text-muted-foreground hover:plasmo-text-foreground plasmo-transition-colors"
        >
          <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-size-10 plasmo-rounded-full plasmo-border plasmo-border-border">
            <Plus className="plasmo-size-6" />
          </div>
          <span>New trip</span>
        </button>
      </div>
    </main>
  )
}