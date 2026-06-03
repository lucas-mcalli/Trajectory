export type FlightEventProps = {
  origin: string
  destination: string
  airline: string
  departureTime: Date
  arrivalTime: Date
  militaryTime: boolean
  confirmationLink?: string
}

export type AccomodationEventProps = {
  name: string
  checkIn: Date
  checkOut: Date
  location: string
  militaryTime: boolean
  confirmationLink?: string
}

export type DatePickerInputProps = {
  label: string
  value?: Date
  onChange: (date: Date | undefined) => void
}