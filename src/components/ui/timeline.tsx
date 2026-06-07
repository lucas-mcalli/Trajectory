
import FlightEvent from "~/components/ui/flightEvent"
import Gap from "~components/ui/gap"
import type { TripEvent } from "~types"
import StayEvent from "~components/ui/stayEvent"
import DaytripEvent from "./daytripEvent"

export default function Timeline({ events, militaryTime }: { events: TripEvent[], militaryTime: boolean }) {

  const getEventStartTime = (event: TripEvent) => {
    if (event.type === "flight" || event.type === "daytrip") return new Date (event.departureTime)
    else return event.checkIn
  }

  const getEventEndTime = (event: TripEvent ) => {
    if (event.type === "flight") return new Date(event.arrivalTime)
    if (event.type === "daytrip") return new Date(event.returnTime)
    else return event.checkOut
  }

  const sorted = [...events].sort((a,b) => // .sort() doesnt take a boolean like c++, if you return a negative number, a goes before, 0 = no change, and positive number means b goes before a.
    getEventStartTime(a).getTime() - getEventStartTime(b).getTime()
  )

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
      {sorted.map((event, i) => {
        const next = sorted[i+1]
        return (
          <div key={i}>
            {event.type === "flight" && <FlightEvent {...event} militaryTime={militaryTime}/>}
            {event.type === "stay" && <StayEvent {...event} militaryTime={militaryTime}/>}
            {event.type === "daytrip" && <DaytripEvent {...event} militaryTime={militaryTime}/>}
            {next && <Gap precedingArrivalTime={getEventEndTime(event)} followingDepartureTime={getEventStartTime(next)}/>}
          </div>
        )
      })}
    </div>
  )
}