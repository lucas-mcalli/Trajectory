import React, { useState } from "react"
import { Turn as Hamburger } from "hamburger-react"

type Props = {
  dark: boolean
  setDark: React.Dispatch<React.SetStateAction<boolean>>
}

export const Navbar = ({ dark, setDark }: Props) => {
  const [isOpen, setOpen] = useState(false)
  
  return (
    <nav className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-pl-4 plasmo-pr-2 plasmo-border-b" style={{ borderColor: dark ? "#1f2a37" : "#eee" }}>
      <div className="plasmo-font-bold plasmo-text-lg">trajectory</div>
      <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
      {isOpen && (
        <div className="plasmo-p-1 plasmo-border plasmo-border-gray-200 plasmo-bg-gray-50 plasmo-rounded-lg">
          <button className="plasmo-w-full plasmo-h-full" onClick={() => setDark((d) => !d)}>
            {dark ? "Set light mode" : "Set dark mode"}
          </button>
        </div>
      )}
      <Hamburger toggled={isOpen} toggle={setOpen} size={16} />
      </div>
    </nav>
  )
}