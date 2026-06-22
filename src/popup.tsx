import React, { useState } from "react"
import { Navbar } from "~components/ui/navbar"
import { Storage } from "@plasmohq/storage"
// @ts-ignore
import "style.css"

import { useStorage } from "@plasmohq/storage/hook"
import type { Tabs, Trip } from "~types"
import HomeScreen from "~components/screens/homeScreen" 
import TripScreen from "~components/screens/tripScreen"
import CreateTripScreen from "~components/screens/createTrip"
import { RightPanelProvider } from "~context/rightPanelContext"


export default function IndexPopup() {

  const [activeTab, setActiveTab] = useState<Tabs>("home")
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [militaryTime, setMilitaryTime] = useState(false)
  const [trips, setTrips] = useStorage<Trip[]>("trips", [])

  const clearAllData = async () => {
    const storage = new Storage()
    const tripIds = (trips ?? []).map((trip) => trip.id)
    await Promise.all(tripIds.map((id) => storage.remove(`events-${id}`)))
    setTrips([])
  }

  const deleteTrip = async (tripId: string) => {
    setTrips((prevTrips) => (prevTrips ?? []).filter((trip) => trip.id !== tripId))
    await new Storage().remove(`events-${tripId}`)
  }

  return (
    <div style={{scrollbarWidth: "none" }} className="plasmo-h-[600px] plasmo-w-[775px] plasmo-rounded-md plasmo-flex plasmo-flex-col plasmo-overflow-hidden plasmo-bg-white plasmo-text-slate-900">
      <Navbar militaryTime={militaryTime} setMilitaryTime={setMilitaryTime} setActiveTab={setActiveTab} onClearAllData={() => {clearAllData(); setActiveTab("home")}} />
      <main className="plasmo-px-4 plasmo-pr-5 plasmo-flex-1 plasmo-overflow-hidden">
        {activeTab === "home" &&  <HomeScreen onSelectTrip={(trip) => {setSelectedTrip(trip); setActiveTab("tripScreen")}} onCreateTrip={() => {setActiveTab("createTrip"); }} trips={trips} onDeleteTrip={(tripId: string) => deleteTrip(tripId)} />}
        {activeTab === "tripScreen" && selectedTrip &&  (
          <RightPanelProvider>
            <TripScreen trip={selectedTrip} militaryTime={militaryTime} />
          </RightPanelProvider>
        )}
        {activeTab === "createTrip" && <CreateTripScreen onComplete={(trip) => {setTrips((prevTrips) => [...prevTrips || [], trip]); setSelectedTrip(trip); setActiveTab("tripScreen"); }} />}
      </main>
    </div>
  )
}