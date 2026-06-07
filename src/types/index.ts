
// Stored types — go in events array
export type Flight = {
  type: "flight"
  origin: string
  destination: string
  airline: string
  departureTime: Date
  arrivalTime: Date
  confirmationLink?: string
}

export type Stay = {
  type: "stay"
  name: string
  guests: number
  checkIn: Date
  checkOut: Date
  location: string
  flagLink: string
  confirmationLink?: string
}

export type Daytrip = {
  type: "daytrip"
  name: string
  departureTime: Date
  returnTime: Date
  returnsNextDay: boolean
  isActiveDuringStay: boolean
  confirmationLink?: string
}

// Types to render event components
export type FlightEventProps = Flight & { militaryTime: boolean }
export type StayEventProps = Stay & { militaryTime: boolean }
export type DaytripEventProps = Daytrip & { militaryTime: boolean }

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

export type LocationEntry = {
  city: string
  country: string
  flag: string
  geonameid?: string | number // Optional mapping backup if passing row instances
}

export type CitiesComboboxProps = {
  label: string
  value: string // Value state tracking the selection key (e.g., "City, Country" or geonameid string)
  onChange: (location: LocationEntry | null) => void
  placeholder?: string
}

export type TripEvent = Flight | Stay | Daytrip