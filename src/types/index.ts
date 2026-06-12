
// Stored types — go in events array
export type Flight = {
  type: "flight"
  origin: string
  destination: string
  airline: string
  airlinePhoto: string
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
  children?: React.ReactNode
  nested?: Daytrip[]
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
  defaultMonth?: Date
  error? : string
  onOpen?: () => void
}

export type AirportComboboxProps = {
  label: string
  value?: string   // IATA code e.g. "MIA"
  onChange: (iata: string) => void
  placeholder?: string
  error? : string
  onOpen?: () => void
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
  onChange: (name: string, airlinePhoto: string) => void
  placeholder?: string
  error? : string
  onOpen?: () => void
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
  error? : string
  onOpen?: () => void
}

export type TimePickerProps = {
  label?: string
  value: Date | undefined
  onChange: (date: Date) => void
  militaryTime?: boolean
  showNextDayIndicator?: boolean
  error?: string
  onOpen?: () => void
}

export type TimelineEvent = Flight | Stay | Daytrip

export type Trip = {
  id: string
  name: string
  outboundFlight?: Flight
  returnFlight?: Flight
  events: TimelineEvent[]
  coverPhotoUrl?: string
  createdAt: string
  startDate?: Date
  endDate?: Date
  destinationCount?: number
  regionId?: string
}

export type RegionComboboxProps = {
  label: string
  value?: string       // region id
  onChange: (id: string) => void
  placeholder?: string
  error?: string
}

export type Region = { 
  id: string
  label: string 
}

export type Tabs = "home" | "tripScreen" | "onboarding" | "createTrip"