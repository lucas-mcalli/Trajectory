import { Signpost } from "lucide-react"
import { Button } from "~/components/ui/button"
import { formatTime } from "~/helpers"
import type { DaytripEventProps } from "~/types"


export default function DaytripEvent({
  name,
  departureTime,
  returnTime,
  returnsNextDay,
  militaryTime,
  isActiveDuringStay,
  confirmationLink,
}: DaytripEventProps) {
  
  // --- 1. NESTED VARIANT (When a stay is active) ---
  if (isActiveDuringStay) {
    const month = departureTime.toLocaleString("en-US", { month: "short" })
    const day = departureTime.getDate()

    return (
      <div className="plasmo-w-full plasmo-max-w-md plasmo-bg-background-subtle plasmo-border plasmo-border-border plasmo-rounded-md plasmo-p-2 plasmo-flex plasmo-flex-col plasmo-gap-2">
        <div className="plasmo-text-foreground plasmo-text-p plasmo-font-semibold">
          {name}
        </div>
        <div className=" plasmo-flex plasmo-justify-between plasmo-gap-8 plasmo-text-foreground">
          <div className="plasmo-text-foreground plasmo-text-p">
            {month} {day}
          </div>
          <div className="plasmo-text-foreground plasmo-text-p">
            {formatTime(departureTime, militaryTime)} - {formatTime(returnTime, militaryTime)}
            {returnsNextDay && (
              <sup className="plasmo-text-p-sm plasmo-font-bold plasmo-ml-0.5">+1</sup>
            )}
          </div>
        </div>
      </div>
    )
  }

  const month = departureTime.toLocaleString("en-US", { month: "short" })
  const day = departureTime.getDate()

  return (
  <div className="plasmo-inline-flex plasmo-justify-start plasmo-items-start plasmo-gap-6">
    {/* Date Column */}
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-leading-none plasmo-gap-0 plasmo-shrink-0 plasmo-w-6">
      <span className="plasmo-text-black plasmo-text-p">{month}</span>
      <span className="plasmo-text-black plasmo-text-lg plasmo-font-semibold plasmo-leading-none">{day}</span>
    </div>

    {/* Main Card Wrapper */}
    <div className="plasmo-w-72 plasmo-h-28 plasmo-relative plasmo-bg-background-subtle plasmo-rounded-lg plasmo-border plasmo-border-border plasmo-overflow-hidden">
      
      {/* Top Row — Name + Sign Icon */}
      <div className="plasmo-absolute plasmo-top-[7px] plasmo-left-0 plasmo-w-full plasmo-px-2 plasmo-flex plasmo-justify-between plasmo-items-start">
        <span className="plasmo-text-foreground plasmo-text-h4 plasmo-font-semibold plasmo-truncate plasmo-max-w-[220px]">
          {name}
        </span>
        <Signpost className="plasmo-size-8 plasmo-stroke-1 plasmo-shrink-0 plasmo-text-foreground" />
      </div>

      {/* Bottom Row — Times + Optional Confirmation Link */}
      <div className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-w-full plasmo-px-2 plasmo-pb-2 plasmo-flex plasmo-justify-between plasmo-items-end">
        <div className="plasmo-flex plasmo-flex-col leading-tight">
          <span className="plasmo-text-foreground plasmo-text-p">
            {formatTime(departureTime, militaryTime)} - {formatTime(returnTime, militaryTime)}
            {returnsNextDay && (
              <sup className="plasmo-text-p-sm plasmo-font-bold plasmo-ml-0.5">+1</sup>
            )}
          </span>
        </div>

        {confirmationLink && (
          <Button size="xs" onClick={() => window.open(confirmationLink, "_blank")}>
            Confirmation
          </Button>
        )}
      </div>

    </div>
  </div>
  )
}