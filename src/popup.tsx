import React, { useState } from "react"
import { Navbar } from "~components/ui/navbar"
// @ts-ignore
import "style.css"

import FlightEvent from "~/components/ui/flightEvent"
import Gap from "~components/ui/gap"
import AccomodationEvent from "~components/ui/stayEvent"
import FlightForm from "~/components/ui/flightForm"
import StayForm from "~components/ui/stayForm"
import DaytripForm from "~components/ui/daytripForm"
import DaytripEvent from "~components/ui/daytripEvent"
import { useStorage } from "@plasmohq/storage/hook"
import type { TripEvent } from "~types"
import Timeline from "~components/ui/timeline"



export default function IndexPopup() {
  const [events, setEvents] = useStorage<TripEvent[]>("events", []) // events will now persist in chrome.storage.sync because of useStorage !
  const [militaryTime, setMilitaryTime] = useState(false)

  const addEvent = (event: TripEvent) => {
    setEvents(prevEvents => [...(prevEvents ?? []), event]) // add new event to existing events, or start a new array if prevEvents is undefined
  }


  return (
    <div style={{scrollbarWidth: "none" }} className="plasmo-h-[600px] plasmo-w-[775px] plasmo-rounded-md plasmo-flex plasmo-flex-col plasmo-overflow-hidden plasmo-bg-white plasmo-text-slate-900">
      <Navbar setMilitaryTime={setMilitaryTime} />
      <main style={{scrollbarWidth: "none" }} className="plasmo-p-4 plasmo-pr-5 plasmo-flex-1 plasmo-overflow-y-auto">
        <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-4">
          <Timeline events={events} militaryTime={militaryTime} />
          <div className="plasmo-flex plasmo-flex-col plasmo-gap-10">
            <FlightForm militaryTime={militaryTime} addEvent={addEvent} />
            <StayForm militaryTime={militaryTime} addEvent={addEvent} />
            <DaytripForm militaryTime={militaryTime} addEvent={addEvent} />
          </div>
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
              checkOut={new Date("2024-07-13T17:00:00")}
              location="Spain"
              flagLink="https://flagsapi.com/ES/flat/64.png"
              confirmationLink="https://www.hotelartsbarcelona.com/"
              militaryTime={true}
            />
          </div>
          <FlightForm militaryTime={true} />
          <DaytripForm militaryTime={true} /> */}
        </div>
      </main>
    </div>
  )
}