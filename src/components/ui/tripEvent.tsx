import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import type { Trip, TimelineEvent } from "~types";
import React from "react"
import { formatDateRange, startDate, endDate } from "~helpers";

export default function TripEvent({ trip, events, onClick }: { trip: Trip ; events: TimelineEvent[];  onClick: () => void }) {
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
      <div className="plasmo-absolute plasmo-top-0 plasmo-left-0 plasmo-w-full plasmo-px-3 plasmo-pt-3 plasmo-flex plasmo-justify-end plasmo-items-start">
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
          className="plasmo-text-white/80 hover:plasmo-text-white plasmo-transition-colors plasmo-p-1"
        >
          <MoreHorizontal className="plasmo-size-4" />
        </button>
      </div>

      {/* Bottom row */}
      <div className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-w-full plasmo-px-3 plasmo-pb-3">
        <p className="plasmo-text-white plasmo-text-h4 plasmo-font-semibold plasmo-leading-tight plasmo-truncate">{trip.name}</p>
        <p className="plasmo-text-white/80 plasmo-text-p-sm plasmo-font-medium plasmo-mt-0.5">
          {formatDateRange(startDate(events), endDate(events))}
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
