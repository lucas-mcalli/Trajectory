import React from "react"
import { Turn as Hamburger } from "hamburger-react"

export const Navbar = ({ setMilitaryTime }: { setMilitaryTime: (value: boolean) => void }) => {
  return (
    <nav className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-pl-4 plasmo-pr-2 plasmo-border-b plasmo-border-slate-200 plasmo-bg-white plasmo-sticky">
      <div className="plasmo-font-bold plasmo-text-lg">trajectory</div>
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
        <Hamburger
          toggled={false}
          toggle={() => {
            // TODO: implement hamburger menu behavior
          }}
          size={16}
        />
      </div>
    </nav>
  )
}