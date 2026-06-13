
import FlightEvent from "~/components/ui/flightEvent"
import Gap from "~components/ui/gap"
import type { TimelineEvent } from "~types"
import StayEvent from "~components/ui/stayEvent"
import DaytripEvent from "./daytripEvent"
import type { Daytrip } from "~types"
import { render } from "react-dom"
import { getEventStartTime, getEventEndTime, sorted} from "~helpers"

export default function Timeline({ events, militaryTime }: { events: TimelineEvent[], militaryTime: boolean }) {

  const isDaytripActiveDuringStay = (daytrip: Daytrip): boolean => { // this goes thru the events array and determines if daytrips happen during active stays
    return sorted(events).some(event => {
      if (event.type !== "stay") return false
      const start = new Date(event.checkIn).getTime()
      const end = new Date(event.checkOut).getTime()
      const dep = new Date(daytrip.departureTime).getTime()
      const ret = new Date(daytrip.returnTime).getTime()
      return dep >= start && ret <= end
    })
  }

  const renderList = sorted(events).reduce<Array<TimelineEvent & { nested?: Daytrip[] }>>((acc, event) => { // renderList is our solution for rendering DaytripEvents inside of StayEvents. We are using .reduce() on sorted to make a new array where each StayEvent with a daytrip within it has a nested field in it.

    if (event.type == "daytrip" && isDaytripActiveDuringStay(event)) return acc // we skip these cause we add them into the nested field of the StayEvent they're part of.

    if (event.type == "stay") { // this does exactly what we were talking about. if we have a stay that has a daytrip inside of it, we filter through sorted to fetch those daytrips and push {...event, nested} to the accumulator (the new renderList array)
      const nested = sorted(events).filter((daytripToAdd) =>
        daytripToAdd.type === "daytrip" && // filtering for daytrips that happen during this stay.
        isDaytripActiveDuringStay(daytripToAdd) &&
        daytripToAdd.departureTime >= event.checkIn &&
        daytripToAdd.returnTime <= event.checkOut
      )
      acc.push({...event, nested: nested as Daytrip[]}) // every stay event now has a nested daytrips array, populated or not.
      return acc
    }

    acc.push(event) // flights, anything else that can just be pushed
    return acc

  }, [])


  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-w-full plasmo-h-full">
      {renderList.length > 0 ? renderList.map((event, i) => {
        const next = renderList[i+1]
        return (
          <div key={i}>
            {event.type === "flight" && <FlightEvent {...event} militaryTime={militaryTime}/>}
            {event.type === "stay" && (
              <StayEvent {...event} militaryTime={militaryTime}>
                {event.nested?.map((daytrip, j) => (
                  <DaytripEvent key={j} {...daytrip} militaryTime={militaryTime} isActiveDuringStay={true} />
                ))}
              </StayEvent>
              )}
            {event.type === "daytrip" && <DaytripEvent {...event} militaryTime={militaryTime} isActiveDuringStay={isDaytripActiveDuringStay(event)} />}
            {next && getEventStartTime(next).getTime() - getEventEndTime(event).getTime() > (30*60*1000) && (
              <Gap precedingArrivalTime={getEventEndTime(event)} followingDepartureTime={getEventStartTime(next)} />
            )}
          </div>
        )
      }) :
      <div className="plasmo-relative plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-1">
        <div className="plasmo-absolute plasmo-top-1 plasmo-left-3 plasmo-w-4 plasmo-h-4 plasmo-border-t-2 plasmo-border-l-2 plasmo-border-muted-foreground/80 plasmo-rounded-tl-sm" />
        <div className="plasmo-absolute plasmo-top-1 plasmo-right-3 plasmo-w-4 plasmo-h-4 plasmo-border-t-2 plasmo-border-r-2 plasmo-border-muted-foreground/80 plasmo-rounded-tr-sm" />
        <div className="plasmo-absolute plasmo-bottom-1 plasmo-left-3 plasmo-w-4 plasmo-h-4 plasmo-border-b-2 plasmo-border-l-2 plasmo-border-muted-foreground/80 plasmo-rounded-bl-sm" />
        <div className="plasmo-absolute plasmo-bottom-1 plasmo-right-3 plasmo-w-4 plasmo-h-4 plasmo-border-b-2 plasmo-border-r-2 plasmo-border-muted-foreground/80 plasmo-rounded-br-sm" />
        <p className="plasmo-text-center plasmo-text-muted-foreground plasmo-text-p plasmo-italic plasmo-max-w-[220px]">
          No events to display. Add one to generate your timeline!
        </p>
      </div>
      }
    </div>
  )
}