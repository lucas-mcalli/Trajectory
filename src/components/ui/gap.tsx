import { determineGapHeight } from "../../helpers"

export default function Gap({precedingArrivalTime, followingDepartureTime}: {precedingArrivalTime: Date, followingDepartureTime: Date}) {
  const diffMs = followingDepartureTime.getTime() - precedingArrivalTime.getTime();
  
  // 1. Calculate total minutes cleanly
  const totalMinutes = Math.round(diffMs / (1000 * 60));
  
  // 2. Break down into days, hours, and remaining minutes
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="plasmo-ml-14 plasmo-flex plasmo-justify-start plasmo-items-center plasmo-gap-3 plasmo-mt-2">
      <div 
        style={{ height: `${determineGapHeight(precedingArrivalTime, followingDepartureTime)}px` }} 
        className="plasmo-w-px plasmo-bg-muted-foreground"
      ></div>
      
      {days >= 2 ? (
        <div className="plasmo-justify-start plasmo-text-muted-foreground plasmo-text-p plasmo-font-normal">
          {days} day gap
        </div>
      ) : (
        <div className="plasmo-justify-start plasmo-text-muted-foreground plasmo-text-p plasmo-font-normal">
          {/* Optional: Hide '0 hr' if it's less than an hour */}
          {hours > 0 ? `${hours} hr ` : ''}{minutes} min gap
        </div>
      )}
    </div>
  )
}