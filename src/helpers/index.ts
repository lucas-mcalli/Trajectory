import type { TimelineEvent } from "~types"

export const isNextDay = (departureTime: Date, arrivalTime: Date): boolean => {
  return arrivalTime.getDate() !== departureTime.getDate()
}

export const formatTime = (date: Date, militaryTime: boolean) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: !militaryTime })

export const determineGapHeight = (precedingArrivalTime: Date, followingDepartureTime: Date): number => {
  const gapMinutes = (followingDepartureTime.getTime() - precedingArrivalTime.getTime()) / (1000 * 60)

  const minHeight = 32
  const thresholdHeight = 48   // height at the 6hr mark — below this, gaps barely grow
  const maxHeight = 160
  const thresholdMinutes = 360  // 6 hours — where "this matters" begins
  const maxGapMinutes = 20160   // 14 days — beyond this, fully capped

  if (gapMinutes <= thresholdMinutes) {
    // sub-6hr: small linear ramp, stays compressed
    const t = Math.max(0, gapMinutes - 30) / (thresholdMinutes - 30)
    return minHeight + t * (thresholdHeight - minHeight)
  }

  // 6hr+: log growth from thresholdHeight up to maxHeight
  const clamped = Math.min(maxGapMinutes, gapMinutes)
  const t = Math.log(clamped / thresholdMinutes) / Math.log(maxGapMinutes / thresholdMinutes)
  return thresholdHeight + t * (maxHeight - thresholdHeight)
}

export const fetchLocationPhoto = async (location: string): Promise<string | null> => {
  try {
    // @ts-ignore
    const apiKey = process.env.PLASMO_PUBLIC_UNSPLASH_ACCESS_KEY
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(location)}&client_id=${apiKey}`)
    const data = await response.json()
    return data.results[0]?.urls?.regular || null
  } catch (error) {
    console.error("Error fetching location photo:", error)
    return null
  }
}

export const getEventStartTime = (event: TimelineEvent) => {
  if (event.type === "flight" || event.type === "daytrip") return new Date (event.departureTime)
  else return new Date(event.checkIn)
}

export const getEventEndTime = (event:TimelineEvent ) => {
  if (event.type === "flight") return new Date(event.arrivalTime)
  if (event.type === "daytrip") return new Date(event.returnTime.getTime() + (event.returnsNextDay ? 24 * 60 * 60 * 1000 : 0))
  else return new Date(event.checkOut)
}

export const sorted = (events: TimelineEvent[]) => [...events].sort((a,b) => // .sort() doesnt take a boolean like c++, if you return a negative number, a goes before, 0 = no change, and positive number means b goes before a.
  getEventStartTime(a).getTime() - getEventStartTime(b).getTime()
)

export const formatDateRange = (start: Date | undefined, end: Date | undefined): string => {
  if (!start) return "Dates not set"
  const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  if (!end) return `${startStr} – ?`
  const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  return `${startStr} – ${endStr}`
}

export const startDate = (events : TimelineEvent[]) => {
  if (events &&events.length > 0) {
    return getEventStartTime(sorted(events)[0])
  }
  return undefined;
}

export const endDate = (events : TimelineEvent[]) => {
  if (events &&events.length > 0) {
    return getEventEndTime(sorted(events)[events.length - 1])
  }
  return undefined;
}


