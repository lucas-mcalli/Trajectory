import type { StayEventProps } from "~/types"
import { fetchLocationPhoto, formatTime } from "~/helpers"
import { House } from "lucide-react"
import { Button } from "~/components/ui/button"
import { useEffect, useState } from "react"

export default function StayEvent({ checkIn, checkOut, name, location, militaryTime, flagLink, confirmationLink }: StayEventProps) {
  const checkInMonth = checkIn.toLocaleString("en-US", { month: "short" })
  const checkInDay = checkIn.getDate()
  const checkOutMonth = checkOut.toLocaleString("en-US", { month: "short" })
  const checkOutDay = checkOut.getDate()
  const [coverPhoto, setCoverPhoto] = useState<string>("")

  useEffect(() => {
    fetchLocationPhoto(location).then((photo) => {
    console.log("Cover photo result:", photo)
    setCoverPhoto(photo || "")
  })
  }, [location])

  const getTotalNights = () => {
    const msInDay = 24 * 60 * 60 * 1000
    return Math.round((checkOut.getTime() - checkIn.getTime()) / msInDay)
  }

  return (
    <div className="plasmo-inline-flex plasmo-justify-start plasmo-items-start plasmo-gap-6">
      <div className="plasmo-flex plasmo-flex-col plasmo-leading-none plasmo-gap-0 plasmo-shrink-0">
        <span className="plasmo-text-black plasmo-text-p">{checkInMonth}</span>
        <span className="plasmo-text-black plasmo-text-lg plasmo-font-semibold plasmo-leading-none plasmo-w-6">{checkInDay}</span>
      </div>

      <div className="plasmo-w-72 plasmo-relative plasmo-rounded-lg plasmo-border plasmo-border-border plasmo-overflow-hidden" style={{ height: `${getTotalNights() <= 1 ? 130 : getTotalNights() * 70}px` }}>
  
        {/* Background image */}
        <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-cover plasmo-bg-center" style={{ backgroundImage: coverPhoto? `url(${coverPhoto})` : "none" }} />
        {/* Dark overlay so text is readable */}
        <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-white plasmo-opacity-70" />

        {/* Top row */}
        <div className="plasmo-absolute plasmo-top-2 plasmo-left-0 plasmo-w-full plasmo-px-2 plasmo-flex plasmo-justify-between plasmo-items-start">
          <div className="plasmo-flex plasmo-flex-col">
            <span className="plasmo-text-p plasmo-italic plasmo-text-shadow-md">&lt;- {checkInMonth} {checkInDay} · {formatTime(checkIn, militaryTime)}</span>
            <span className="plasmo-text-h4 plasmo-font-semibold plasmo-text-shadow-md">{name}</span>
          </div>
          <div className="plasmo-size-8 plasmo-shrink-0">
            <img src={flagLink} alt="Flag" className="plasmo-w-full plasmo-h-full plasmo-object-contain" />
          </div>
        </div>

        {/* Bottom row */}
        <div className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-w-full plasmo-px-2 plasmo-pb-2 plasmo-flex plasmo-justify-between plasmo-items-end">
          <span className="plasmo-text-p plasmo-italic plasmo-text-shadow-md">-&gt; {checkOutMonth} {checkOutDay} · {formatTime(checkOut, militaryTime)}</span>
          <Button size="xs" onClick={() => window.open(confirmationLink, "_blank")}>
            Confirmation
          </Button>
        </div>

      </div>
    </div>
  )
}
