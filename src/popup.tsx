import React, { useState } from "react"
import { Navbar } from "~components/ui/navbar"
// @ts-ignore
import "style.css"

import FlightEvent from "~/components/ui/flightEvent"
import Gap from "~components/ui/gap"
import AccomodationEvent from "~components/ui/stayEvent"
import FlightForm from "~/components/ui/flightForm"
import StayForm from "~components/ui/stayForm"
import DaytripForm from "~components/ui/daytripForm"
import DaytripEvent from "~components/ui/daytripEvent"
import { useStorage } from "@plasmohq/storage/hook"
import type { TimelineEvent, Tabs, Trip } from "~types"
import Timeline from "~components/ui/timeline"
import HomeScreen from "~components/screens/homeScreen" 
import TripScreen from "~components/screens/tripScreen"
import CreateTripScreen from "~components/screens/createTrip"


export default function IndexPopup() {

  const [activeTab, setActiveTab] = useState<Tabs>("home")
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [militaryTime, setMilitaryTime] = useState(false)

  return (
    <div style={{scrollbarWidth: "none" }} className="plasmo-h-[600px] plasmo-w-[775px] plasmo-rounded-md plasmo-flex plasmo-flex-col plasmo-overflow-hidden plasmo-bg-white plasmo-text-slate-900">
      <Navbar setMilitaryTime={setMilitaryTime} />
      <main className="plasmo-px-4 plasmo-pr-5 plasmo-flex-1 plasmo-overflow-hidden">
        {activeTab === "home" &&  <HomeScreen onSelectTrip={(trip) => {setSelectedTrip(trip); setActiveTab("tripScreen")}} onCreateTrip={() => {setActiveTab("createTrip"); console.log("Create trip clicked")}}  />}
        {activeTab === "tripScreen" && selectedTrip && <TripScreen trip={selectedTrip} militaryTime={militaryTime} />}
        {activeTab === "createTrip" && <CreateTripScreen onComplete={(trip) => {setSelectedTrip(trip); setActiveTab("tripScreen")}} />}
      </main>
    </div>
  )
}