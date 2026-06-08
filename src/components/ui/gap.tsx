import { determineGapHeight } from "../../helpers"

export default function Gap({precedingArrivalTime, followingDepartureTime}: {precedingArrivalTime: Date, followingDepartureTime: Date}) {
  const days = Math.round((followingDepartureTime.getTime() - precedingArrivalTime.getTime()) / (1000 * 60 * 60 * 24))
  const hours = Math.round((followingDepartureTime.getTime() - precedingArrivalTime.getTime()) / (1000 * 60 * 60))
  const minutes = Math.round((followingDepartureTime.getTime() - precedingArrivalTime.getTime()) / (1000 * 60)) % 60
  return (
    <div className="plasmo-ml-14 plasmo-flex plasmo-justify-start plasmo-items-center plasmo-gap-3 plasmo-mt-2">
      <div style={{ height: `${determineGapHeight(precedingArrivalTime, followingDepartureTime)}px` }} className="plasmo-w-px plasmo-bg-muted-foreground"></div>
      {days >= 2 ? <div className="plasmo-justify-start plasmo-text-muted-foreground plasmo-text-p plasmo-font-normal">{days} day gap</div> :
      <div className="plasmo-justify-start plasmo-text-muted-foreground plasmo-text-p plasmo-font-normal">{hours} hr {minutes} min gap</div> }
    </div>
  )
}