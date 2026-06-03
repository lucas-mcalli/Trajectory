import React, { useState } from "react"
import cssText from "data-text:~style.css"
import { Navbar } from "~/navbar"
// @ts-ignore
import "style.css"

import FlightEvent from "~/components/ui/flightEvent"
import Gap from "~/components/gap"
import AccomodationEvent from "~/components/ui/accomodationEvent"
import { TimeDatePicker } from "~components/ui/timeDatePicker"

type Event = {
  id: string
  type: "flight" | "airbnb"
  title: string
  confirmationLink: string
  flightNumber?: string
  originAirport?: string
  destinationAirport?: string
  departureTime?: string
  arrivalTime?: string
  checkinDate?: string
  checkoutDate?: string
  checkinTime?: string
  checkoutTime?: string
  numberofGuests?: string
  details?: string
}

const sampleTrip = (): Event[] => [
  { id: "e1", type: "flight", title: "Flight: SFO → LAX", details: "AA 123 • 9:00 AM", confirmationLink: "https://wwww.aa.com/" },
  { id: "e2", type: "airbnb", title: "Stay: Cozy Cottage", details: "3 nights • Oceanview", confirmationLink: "https://wwww.airbnb.com/"},
  { id: "e3", type: "flight", title: "Flight: LAX → SFO", details: "AA 987 • 6:30 PM", confirmationLink: "https://wwww.aa.com/" }
]

function TimelineItem({ item }: { item: Event }) {
  return (
    <li className="plasmo-p-3 plasmo-rounded plasmo-shadow-sm plasmo-bg-white plasmo-border plasmo-border-gray-200">
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
        <div>
          <div className="plasmo-font-semibold">{item.type === "flight" ? "✈️ " : "🏠 "}{item.title}</div>
          <div className="plasmo-text-sm plasmo-text-gray-500">{item.details}</div>
        </div>
      </div>
    </li>
  )
}

export default function IndexPopup() {
  const [timeline, setTimeline] = useState<Event[] | null>(null)
  const [departure, setDeparture] = React.useState<Date | undefined>(undefined)


  void cssText

  const onCreate = () => setTimeline(sampleTrip())

  const addEvent = (type: Event["type"]) => {
    setTimeline((prev) => {
      const next = prev ? [...prev] : []
      next.push({
        id: String(Date.now()),
        type,
        title: type === "flight" ? "New Flight" : "New Stay",
        details: "details",
        confirmationLink: ""
      })
      return next
    })
  }

  return (
    <div className="plasmo-h-[600px] plasmo-w-[750px] plasmo-rounded-md plasmo-overflow-hidden plasmo-bg-white plasmo-text-slate-900">
      <Navbar />

      <main className="plasmo-p-4">
        {/* <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
        <FlightEvent
          origin="MIA"
          destination="BCN"
          airline="American Airlines"
          departureTime={new Date("2024-07-12T22:00:00")}
          arrivalTime={new Date("2024-07-13T13:35:00")}
          confirmationLink="https://www.aa.com/"
          militaryTime = {true}
        />
        <Gap precedingArrivalTime={new Date("2024-07-13T13:35:00")} followingDepartureTime={new Date("2024-07-13T16:00:00")} />
        <AccomodationEvent
          name="Hotel Arts Barcelona"
          checkIn={new Date("2024-07-13T16:00:00")}
          checkOut={new Date("2024-07-16T11:00:00")}
          location="Barcelona, Spain"
          confirmationLink="https://www.hotelartsbarcelona.com/"
          militaryTime={true}
        />
        </div> */}
        <TimeDatePicker label="Departure" value={departure} onChange={setDeparture} />
      </main>
    </div>
  )
}