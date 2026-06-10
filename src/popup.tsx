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
import type { TimelineEvent } from "~types"
import Timeline from "~components/ui/timeline"
import HomeScreen from "~/components/ui/homeScreen" 



export default function IndexPopup() {
  const [rawEvents, setEvents] = useStorage<any[]>("events", []) // events will now persist in chrome.storage.sync because of useStorage !
  const events : TimelineEvent[] = (rawEvents ?? []).map(deserializeEvent) // this is what turns the strings into Dates on reopen
  const [militaryTime, setMilitaryTime] = useState(false)

  const addEvents = (events: TimelineEvent[]) => { // this must be plural to handle adding multiple flights at once. works fine for singular additions.
    setEvents(prevEvents => [...(prevEvents ?? []), ...events]) // add new event to existing events, or start a new array if prevEvents is undefined
  }

  function deserializeEvent(event: any): TimelineEvent { // This is necessary because dates are stored as strings in our events object. When the window is reopened, these strings must be constructed back into Date objects to use functions like getTime().
    switch (event.type) {
      case "flight":
        return {
          ...event,
          departureTime: new Date(event.departureTime),
          arrivalTime: new Date(event.arrivalTime)
        }
      case "stay":
        return {
          ...event,
          checkIn: new Date(event.checkIn),
          checkOut: new Date(event.checkOut)
        }
      case "daytrip":
        return {
          ...event,
          departureTime: new Date(event.departureTime),
          returnTime: new Date(event.returnTime)
        }
      default:
        return event as TimelineEvent
    }
  }


  return (
    <div style={{scrollbarWidth: "none" }} className="plasmo-h-[600px] plasmo-w-[775px] plasmo-rounded-md plasmo-flex plasmo-flex-col plasmo-overflow-hidden plasmo-bg-white plasmo-text-slate-900">
      <Navbar setMilitaryTime={setMilitaryTime} />
      <main className="plasmo-px-4 plasmo-pr-5 plasmo-flex-1 plasmo-overflow-hidden">
        <HomeScreen
          onSelectTrip={(trip) => console.log("selected", trip)}
          onCreateTrip={() => console.log("create new trip")}
        />
        {/* <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-4 plasmo-h-full">
          <div style={{ scrollbarWidth: "none" }} className="TIMELINE SIDE plasmo-py-4 plasmo-overflow-y-auto plasmo-h-full">
            <Timeline events={events} militaryTime={militaryTime} />
          </div>
          <div style={{ scrollbarWidth: "none" }} className="USER EDIT SIDE plasmo-py-4 plasmo-overflow-y-auto plasmo-h-full plasmo-flex plasmo-flex-col plasmo-gap-10 plasmo-px-1">
            <FlightForm militaryTime={militaryTime} addEvents={addEvents} />
            <StayForm militaryTime={militaryTime} addEvents={addEvents} />
            <DaytripForm militaryTime={militaryTime} addEvents={addEvents} />
          </div>
        </div> */}
      </main>
    </div>
  )
}