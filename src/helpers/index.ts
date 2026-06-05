export const isNextDay = (departureTime: Date, arrivalTime: Date): boolean => {
  return arrivalTime.getDate() !== departureTime.getDate()
}

export const formatTime = (date: Date, militaryTime: boolean) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: !militaryTime })

export const determineGapHeight = (precedingArrivalTime: Date, followingDepartureTime: Date): number => {
  const gapMinutes = (followingDepartureTime.getTime() - precedingArrivalTime.getTime()) / (1000 * 60)
  const minHeight = 40
  const maxHeight = 120
  const maxGapMinutes = 480

  return Math.min(maxHeight, Math.max(minHeight, (gapMinutes / maxGapMinutes) * maxHeight))
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