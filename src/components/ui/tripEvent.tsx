import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import type { Trip } from "~types";
import React from "react"

function formatDateRange(start: Date | undefined, end: Date | undefined): string {
  if (!start) return "Dates not set"
  const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  if (!end) return `${startStr} – ?`
  const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric" })
  return `${startStr} – ${endStr}`
}

export default function TripEvent({ trip, onClick }: { trip: Trip & { startDate?: Date; endDate?: Date; destinationCount?: number }; onClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      onClick={onClick}
      className="plasmo-relative plasmo-w-64 plasmo-shrink-0 plasmo-h-full plasmo-rounded-xl plasmo-overflow-hidden plasmo-cursor-pointer plasmo-border plasmo-border-border plasmo-group"
    >
      {/* Background photo */}
      {trip.coverPhotoUrl ? (
        <div
          className="plasmo-absolute plasmo-inset-0 plasmo-bg-cover plasmo-bg-center plasmo-transition-transform plasmo-duration-300 group-hover:plasmo-scale-105"
          style={{ backgroundImage: `url(${trip.coverPhotoUrl})` }}
        />
      ) : (
        <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-muted" />
      )}

      {/* Gradient overlay */}
      <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-gradient-to-t plasmo-from-black/70 plasmo-via-black/10 plasmo-to-transparent" />

      {/* Top row */}
      <div className="plasmo-absolute plasmo-top-0 plasmo-left-0 plasmo-w-full plasmo-px-3 plasmo-pt-3 plasmo-flex plasmo-justify-between plasmo-items-start">
        <span className="plasmo-text-white/90 plasmo-text-p-sm plasmo-font-medium plasmo-bg-black/20 plasmo-rounded-md plasmo-px-2 plasmo-py-0.5">
          {trip.destinationCount ?? 0} {trip.destinationCount === 1 ? "destination" : "destinations"}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="plasmo-text-white/80 hover:plasmo-text-white plasmo-transition-colors plasmo-p-1"
        >
          <MoreHorizontal className="plasmo-size-4" />
        </button>
      </div>

      {/* Bottom row */}
      <div className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-w-full plasmo-px-3 plasmo-pb-3">
        <p className="plasmo-text-white plasmo-text-h4 plasmo-font-semibold plasmo-leading-tight">{trip.name}</p>
        <p className="plasmo-text-white/80 plasmo-text-p-sm plasmo-font-medium plasmo-mt-0.5">
          {formatDateRange(trip.startDate, trip.endDate)}
        </p>
      </div>

      {/* Context menu */}
      {menuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="plasmo-absolute plasmo-top-8 plasmo-right-3 plasmo-bg-background plasmo-border plasmo-border-border plasmo-rounded-lg plasmo-shadow-lg plasmo-overflow-hidden plasmo-z-10 plasmo-w-32"
        >
          <button className="plasmo-w-full plasmo-text-left plasmo-px-3 plasmo-py-2 plasmo-text-p plasmo-text-foreground hover:plasmo-bg-muted plasmo-transition-colors">
            Edit
          </button>
          <button className="plasmo-w-full plasmo-text-left plasmo-px-3 plasmo-py-2 plasmo-text-p plasmo-text-destructive hover:plasmo-bg-muted plasmo-transition-colors">
            Delete
          </button>
        </div>
      )}
    </div>
  )
}
