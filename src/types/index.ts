export type FlightEventProps = {
  origin: string
  destination: string
  airline: string
  departureTime: Date
  arrivalTime: Date
  militaryTime: boolean
  confirmationLink?: string
}

export type StayEventProps = {
  name: string
  checkIn: Date
  checkOut: Date
  location: string
  militaryTime: boolean
  confirmationLink?: string
}

export type DateTimeInputProps = {
  label: string
  value?: Date
  onChange: (date: Date | undefined) => void
  militaryTime?: boolean
}

export type AirportComboboxProps = {
  label: string
  value?: string   // IATA code e.g. "MIA"
  onChange: (iata: string) => void
  placeholder?: string
}

export type Airport = {
  iata: string
  name: string
  city: string
  country: string
}

export type AirlineEntry = {
  icao: string
  name: string
  domain: string
}

export type AirlineComboboxProps = {
  label: string
  value?: string
  onChange: (iata: string) => void
  placeholder?: string
}

export type CalendarState = {
  month: number
  year: number
}