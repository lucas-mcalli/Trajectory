import { useState } from "react"
import { Trash2 } from "lucide-react"
import type { Trip, TimelineEvent } from "~types"
import React from "react"
import { formatDateRange, startDate, endDate } from "~helpers"
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

export default function TripEvent({ trip, events, onClick, onDelete }: { trip: Trip, events: TimelineEvent[], onClick: () => void, onDelete: (tripId: string) => void}) {
  
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <div
      onClick={onClick}
      className="plasmo-relative plasmo-w-64 plasmo-shrink-0 plasmo-h-full plasmo-rounded-xl plasmo-overflow-hidden plasmo-cursor-pointer plasmo-border plasmo-border-border plasmo-group"
    >
      {trip.coverPhotoUrl ? (
        <div
          className="plasmo-absolute plasmo-inset-0 plasmo-bg-cover plasmo-bg-center plasmo-transition-transform plasmo-duration-300 group-hover:plasmo-scale-105"
          style={{ backgroundImage: `url(${trip.coverPhotoUrl})` }}
        />
      ) : (
        <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-muted" />
      )}

      <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-gradient-to-t plasmo-from-black/70 plasmo-via-black/10 plasmo-to-transparent" />

      <div className="plasmo-absolute plasmo-top-0 plasmo-left-0 plasmo-w-full plasmo-px-3 plasmo-pt-3 plasmo-flex plasmo-justify-end plasmo-items-start">
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogTrigger asChild>
            <button
              onClick={(e) => { e.stopPropagation(); setAlertOpen(true) }}
              className="plasmo-text-white/80 hover:plasmo-text-white plasmo-transition-colors plasmo-p-1"
            >
              <Trash2 className="plasmo-size-4 plasmo-drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete "{trip.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this trip and all of its events. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAlertOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete(trip.id)
                  setAlertOpen(false)
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="plasmo-absolute plasmo-bottom-0 plasmo-left-0 plasmo-w-full plasmo-px-3 plasmo-pb-3">
        <p className="plasmo-text-white plasmo-text-h4 plasmo-font-semibold plasmo-leading-tight plasmo-truncate">{trip.name}</p>
        <p className="plasmo-text-white/80 plasmo-text-p-sm plasmo-font-medium plasmo-mt-0.5">
          {formatDateRange(startDate(events), endDate(events))}
        </p>
      </div>
    </div>
  )
}