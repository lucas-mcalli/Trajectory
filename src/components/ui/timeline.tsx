
import FlightEvent from "~/components/ui/flightEvent"
import Gap from "~components/ui/gap"
import type { TripEvent } from "~types"
import StayEvent from "~components/ui/stayEvent"
import DaytripEvent from "./daytripEvent"
import type { Daytrip } from "~types"

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

  const isDaytripActiveDuringStay = (daytrip: Daytrip): boolean => { // this goes thru the events array and determines if daytrips happen during active stays
  return sorted.some(event => {
    if (event.type !== "stay") return false
    const start = new Date(event.checkIn).getTime()
    const end = new Date(event.checkOut).getTime()
    const dep = new Date(daytrip.departureTime).getTime()
    const ret = new Date(daytrip.returnTime).getTime()
    return dep >= start && ret <= end
  })
}

  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-2">
      {sorted.map((event, i) => {
        const next = sorted[i+1]
        return (
          <div key={i}>
            {event.type === "flight" && <FlightEvent {...event} militaryTime={militaryTime}/>}
            {event.type === "stay" && <StayEvent {...event} militaryTime={militaryTime}/>}
            {event.type === "daytrip" && <DaytripEvent {...event} militaryTime={militaryTime} isActiveDuringStay={isDaytripActiveDuringStay(event)} />}
            {next && getEventStartTime(next).getTime() - getEventEndTime(event).getTime() > 30 && (
              <Gap precedingArrivalTime={getEventEndTime(event)} followingDepartureTime={getEventStartTime(next)} />
            )}
          </div>
        )
      })}
    </div>
  )
}