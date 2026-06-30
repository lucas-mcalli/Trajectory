import Timeline from "~/components/ui/timeline"
import FlightForm from "~/components/ui/flightForm"
import StayForm from "~/components/ui/stayForm"
import DaytripForm from "~/components/ui/daytripForm"
import type { TimelineEvent, Trip } from "~types"
import React, { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { useRightPanel } from "~context/rightPanelContext"
import AmbientCard from "~components/ui/ambientCard"
import { sendToBackground } from "@plasmohq/messaging"
 


export default function TripScreen({ trip, militaryTime }: { trip: Trip, militaryTime: boolean }) {

  const [isAutofilling, setIsAutofilling] = useState(false) // this is used to set the autofill button loading state while the API is being called, to prevent multiple calls at once.

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

const handleAutofill = async (onResult: (data: any) => void) => {
  setIsAutofilling(true)
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    if (!tab?.id) {
      throw new Error("No active tab")
    }

    console.log("[POPUP] Active tab:", tab)

    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "GET_PAGE_TEXT"
    })

    console.log(response)
    
    const apiResponse = await fetch("https://trajectory-api.lmcalli124.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: response.text, url: response.url })
    }).then(r => r.json())

    console.log("[POPUP] API response:", apiResponse)
    
    onResult(apiResponse)
  } catch (error) {
    console.error("[POPUP] Error:", error)
  } finally {
    setIsAutofilling(false)
  }
}

  const [rawEvents, setEvents] = useStorage<any[]>(`events-${trip.id}`, []) // events will now persist in chrome.storage.sync because of useStorage !
  const events : TimelineEvent[] = (rawEvents ?? []).map(deserializeEvent) // this is what turns the strings into Dates on reopen
  const { panel } = useRightPanel() // imported from context/rightPanelContext, this dictates what's on the right side panel based on the user's actions on the timeline.

  const addEvents = (events: TimelineEvent[]) => { // this must be plural to handle adding multiple flights at once. works fine for singular additions.
    setEvents(prevEvents => [...(prevEvents ?? []), ...events]) // add new event to existing events, or start a new array if prevEvents is undefined
  }

  const deleteEvent = (id: string) => {
    setEvents(prevEvents => (prevEvents ?? []).filter(e => e.id !== id))
  } 
  
  return (
      <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-4 plasmo-h-full">
      <div style={{ scrollbarWidth: "none" }} className="TIMELINE SIDE plasmo-py-4 plasmo-overflow-y-auto plasmo-h-full">
        <Timeline events={events} militaryTime={militaryTime} onDelete={deleteEvent} />
      </div>
      <div style={{ scrollbarWidth: "none" }} className="USER EDIT SIDE plasmo-py-4 plasmo-overflow-y-auto plasmo-h-full plasmo-flex plasmo-flex-col plasmo-gap-10 plasmo-px-1">
        {panel === "ambient" && <AmbientCard trip={trip} events={events}/>}
        {panel === "flight" && <FlightForm militaryTime={militaryTime} addEvents={addEvents} rawEvents={rawEvents} onAutofill={handleAutofill} isAutofilling={isAutofilling} />}
        {panel === "stay" && <StayForm militaryTime={militaryTime} addEvents={addEvents} events={events} rawEvents={rawEvents} onAutofill={handleAutofill} isAutofilling={isAutofilling} />}
        {panel === "daytrip" && <DaytripForm militaryTime={militaryTime} addEvents={addEvents} rawEvents={rawEvents} />}
      </div>
    </div>
  )
}