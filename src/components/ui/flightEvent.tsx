import type { FlightEventProps } from "~/types"
import { isNextDay, formatTime } from "~/helpers"
import { Plane } from "lucide-react"
import { Button } from "~/components/ui/button"

export default function FlightEvent({ origin, destination, airline, departureTime, arrivalTime, militaryTime, confirmationLink}: FlightEventProps) {
  const month = departureTime.toLocaleString("en-US", { month: "short" })
  const day = departureTime.getDate()
  return (
    <div className="plasmo-inline-flex plasmo-justify-start plasmo-items-start plasmo-gap-6">
      <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-leading-none plasmo-gap-0 plasmo-shrink-0 plasmo-w-6">
        <span className="plasmo-text-black plasmo-text-p plasmo-font-normal">{month}</span>
        <span className="plasmo-text-black plasmo-text-lg plasmo-font-semibold plasmo-leading-none">{day}</span>
      </div>

      <div className="plasmo-w-72 plasmo-h-28 plasmo-relative plasmo-bg-background-subtle plasmo-rounded-lg plasmo-border plasmo-border-border plasmo-overflow-hidden">
        
        {/* Top row — route + icon */}
        <div className="plasmo-absolute plasmo-top-[7px] plasmo-left-0 plasmo-w-full plasmo-px-2 plasmo-flex plasmo-justify-between">
          <span className="plasmo-text-foreground plasmo-text-h4 plasmo-font-semibold">
            {origin}-{destination}
          </span>
          <Plane className="plasmo-size-8 plasmo-stroke-1 plasmo-shrink-0 plasmo-text-foreground" />
        </div>

        {/* Bottom row — airline/time + confirmation */}
        <div className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-w-full plasmo-px-2 plasmo-pb-2 plasmo-flex plasmo-justify-between plasmo-items-end">
          <div className="plasmo-flex plasmo-flex-col">
            <span className="plasmo-text-foreground plasmo-text-p plasmo-font-normal">{airline}</span>
            <span className="plasmo-text-foreground plasmo-text-p">
              {formatTime(departureTime, militaryTime)} - {formatTime(arrivalTime, militaryTime)}
              {isNextDay(departureTime, arrivalTime) && (
                <sup className="plasmo-text-p-sm">+1</sup>
              )}
            </span>
          </div>
          <Button size="xs" onClick={() => window.open(confirmationLink, "_blank")}>
            Confirmation
          </Button>
        </div>

      </div>
    </div>
  )
}
