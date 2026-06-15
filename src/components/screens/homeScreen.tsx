import { Plus} from "lucide-react"
import type { Trip } from "~/types"
import React from "react"
import TripEvent from "~/components/ui/tripEvent"
import { useStorage } from '@plasmohq/storage/hook'

function TripEventStorageWrapper({ trip, onSelectTrip }: { trip: Trip, onSelectTrip: (trip: Trip) => void }) {
  const [events] = useStorage<any[]>(`events-${trip.id}`, [])
  const normalizedEvents = (events || []).map((event) => // necessary to use the events array for each trip in storage.
    event.type === "flight" || event.type === "daytrip"
      ? { ...event, departureTime: new Date(event.departureTime), arrivalTime: new Date(event.arrivalTime), returnTime: event.returnTime && new Date(event.returnTime) }
      : { ...event, checkIn: new Date(event.checkIn), checkOut: new Date(event.checkOut) }
  )

  return (
    <TripEvent
      trip={trip as any}
      events={normalizedEvents}
      onClick={() => onSelectTrip(trip)}
    />
  )
}

export default function HomeScreen({ onSelectTrip, onCreateTrip, trips }: {
  onSelectTrip: (trip: Trip) => void
  onCreateTrip: () => void
  trips: Trip[]
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

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
        {trips.length >= 1 ? (
          trips?.map((trip) => (
            <TripEventStorageWrapper
              key={trip.id}
              trip={trip}
              onSelectTrip={onSelectTrip}
            />
          ))
        ) : (
        <div className="plasmo-relative plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-1">

          <div className="plasmo-absolute plasmo-top-1 plasmo-left-1 plasmo-w-4 plasmo-h-4 plasmo-border-t-2 plasmo-border-l-2 plasmo-border-muted-foreground/80 plasmo-rounded-tl-sm" />
          <div className="plasmo-absolute plasmo-top-1 plasmo-right-1 plasmo-w-4 plasmo-h-4 plasmo-border-t-2 plasmo-border-r-2 plasmo-border-muted-foreground/80 plasmo-rounded-tr-sm" />
          <div className="plasmo-absolute plasmo-bottom-1 plasmo-left-1 plasmo-w-4 plasmo-h-4 plasmo-border-b-2 plasmo-border-l-2 plasmo-border-muted-foreground/80 plasmo-rounded-bl-sm" />
          <div className="plasmo-absolute plasmo-bottom-1 plasmo-right-1 plasmo-w-4 plasmo-h-4 plasmo-border-b-2 plasmo-border-r-2 plasmo-border-muted-foreground/80 plasmo-rounded-br-sm" />
          
          <div className="plasmo-relative plasmo-flex plasmo-flex-col plasmo-gap-2">
            <h1 className="plasmo-text-center plasmo-text-h2">
              Welcome to Trajectory!
            </h1>
            <p className="plasmo-text-center plasmo-text-muted-foreground plasmo-text-p plasmo-italic">
              Get started by creating your first trip using the button below.
            </p>
          </div>
        </div>
        )}
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