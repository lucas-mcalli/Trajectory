export type FlightEventProps = {
  origin: string
  destination: string
  airline: string
  departureTime: Date
  arrivalTime: Date
  militaryTime: boolean
  confirmationLink?: string
}