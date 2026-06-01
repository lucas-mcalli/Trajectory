export const isNextDay = (departureTime: Date, arrivalTime: Date): boolean => {
  return arrivalTime.getDate() !== departureTime.getDate()
}

export const formatTime = (date: Date, militaryTime: boolean) =>
  date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: !militaryTime })
