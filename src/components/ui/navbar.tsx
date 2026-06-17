import React, { useState, useRef, useEffect } from "react"
import { Turn as Hamburger } from "hamburger-react"
import logoIcon from "data-base64:assets/LogoPrimary.svg"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~components/ui/alert-dialog"

export const Navbar = ({ militaryTime, setMilitaryTime, setActiveTab, onClearAllData }: { militaryTime: boolean, setMilitaryTime: (value: boolean) => void, setActiveTab: (tab: "home" | "tripScreen" | "createTrip") => void, onClearAllData: () => void }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen || alertOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [menuOpen, alertOpen])

  return (
    <nav className=" plasmo-z-50 plasmo-relative plasmo-flex plasmo-items-center plasmo-justify-between plasmo-pl-4 plasmo-pr-2 plasmo-border-b plasmo-border-slate-200 plasmo-bg-white plasmo-sticky">
      <img
        src={logoIcon}
        alt="Logo"
        className="plasmo-h-8 plasmo-w-8 plasmo-cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          setActiveTab("home")
        }}
      />

      <div ref={containerRef} className="plasmo-flex plasmo-items-center plasmo-gap-2">
        <Hamburger toggled={menuOpen} toggle={() => setMenuOpen(prev => !prev)} size={16} />
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
          className="plasmo-absolute plasmo-top-10 plasmo-right-5 plasmo-bg-background plasmo-border plasmo-border-border plasmo-rounded-lg plasmo-shadow-lg plasmo-overflow-hidden plasmo-z-50 plasmo-w-44"
        >
          <button
            onClick={() => {
              setMilitaryTime(!militaryTime)
              setMenuOpen(false)
            }}
            className="plasmo-w-full plasmo-text-left plasmo-px-3 plasmo-py-2 plasmo-text-p plasmo-text-foreground hover:plasmo-bg-muted plasmo-transition-colors"
          >
            {militaryTime ? "Use AM-PM time" : "Use 24-hour time"}
          </button>

          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogTrigger asChild>
              <button
                onClick={() => setAlertOpen(true)}
                className="plasmo-w-full plasmo-text-left plasmo-px-3 plasmo-py-2 plasmo-text-p plasmo-text-destructive hover:plasmo-bg-muted plasmo-transition-colors"
              >
                Clear all data
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all data?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all trips and events. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => { setAlertOpen(false); setMenuOpen(false) }}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onClearAllData()
                    setAlertOpen(false)
                    setMenuOpen(false)
                  }}
                >
                  Clear data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </nav>
  )
}