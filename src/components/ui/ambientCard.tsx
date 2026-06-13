import React, { useEffect, useState } from "react";
import type { Trip } from "~types";
import { getEventStartTime, getEventEndTime, sorted, fetchLocationPhoto } from "~helpers";
import { Plus, Plane, Bed, MapPin } from "lucide-react";
import { useRightPanel } from "~context/rightPanelContext"
import { regionPreviews } from "~data/regionPreviews";

function formatDateRange(start: Date | undefined, end: Date | undefined): string {
  if (!start) return "Dates not set";
  const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  if (!end) return `${startStr} – ?`;
  const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return `${startStr} – ${endStr}`;
}

export default function AmbientCard({ trip }: { trip: Trip }) {
  const [fabOpen, setFabOpen] = useState(false);

  const startDate = (() => {
    if (trip?.startDate) return trip.startDate;
    if (trip?.events && trip.events.length > 0) {
      return getEventStartTime(sorted(trip.events)[0]);
    }
    return undefined;
  })();

  const endDate = (() => {
    if (trip?.endDate) return trip.endDate;
    if (trip?.events && trip.events.length > 0) {
      return getEventEndTime(sorted(trip.events)[trip.events.length - 1]);
    }
    return undefined;
  })();

  const { setPanel } = useRightPanel();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Fetch the photo when the trip or regionId changes
  useEffect(() => {
    async function getBackgroundImage() {
      if (!trip?.regionId) return;

      const citiesInRegion = regionPreviews[trip.regionId];
      
      let queryText = "travel"; // default fallback

      if (citiesInRegion && citiesInRegion.length > 0) {
        const randomIndex = Math.floor(Math.random() * citiesInRegion.length);
        const randomCityObj = citiesInRegion[randomIndex];
        
        queryText = `${randomCityObj.city}, ${randomCityObj.country}`;
      } else {
        queryText = trip.regionId.replace("-", " ");
      }

      const final = await fetchLocationPhoto(queryText);
      setPhotoUrl(final);
    }

    getBackgroundImage();
  }, [trip?.regionId]);

  return (
    <div className="plasmo-relative plasmo-overflow-hidden plasmo-w-full plasmo-h-full plasmo-rounded-lg plasmo-border plasmo-border-border plasmo-bg-background plasmo-p-4 plasmo-flex plasmo-flex-col plasmo-justify-between">

      {photoUrl && (
        <img
          src={photoUrl}
          alt={trip.name}
          className="plasmo-absolute plasmo-inset-0 plasmo-w-full plasmo-h-full plasmo-object-cover plasmo-opacity-[65%] plasmo-transition-opacity plasmo-duration-500"
        />
      )}

      <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-gradient-to-b plasmo-from-black/40 plasmo-via-transparent plasmo-to-black/80" />

      <div className="plasmo-flex plasmo-flex-col">
        <h4 className="plasmo-text-white plasmo-z-10 plasmo-text-h4 plasmo-font-semibold plasmo-leading-tight">
          {trip.name}
        </h4>
        <p className="plasmo-text-white plasmo-opacity-80 plasmo-text-p-sm plasmo-z-10 plasmo-font-medium plasmo-mt-0.5">
          {formatDateRange(startDate, endDate)}
        </p>
      </div>

      <div className="plasmo-absolute plasmo-bottom-4 plasmo-right-4 plasmo-flex plasmo-flex-col plasmo-items-end">
  
        {fabOpen && (
          <div className="plasmo-flex plasmo-flex-col plasmo-gap-2 plasmo-mb-2 plasmo-animate-in plasmo-fade-in plasmo-slide-in-from-bottom-2 plasmo-duration-200">
            <button
              onClick={() => { setPanel("flight"); setFabOpen(false); }}
              className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-muted hover:plasmo-bg-muted/80 plasmo-text-foreground plasmo-px-3 plasmo-py-1.5 plasmo-rounded-lg plasmo-text-p-sm plasmo-font-medium plasmo-shadow-sm plasmo-transition-colors"
            >
              <Plane className="plasmo-size-3.5" />
              Add flight
            </button>
            <button
              onClick={() => { setPanel("stay"); setFabOpen(false); }}
              className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-muted hover:plasmo-bg-muted/80 plasmo-text-foreground plasmo-px-3 plasmo-py-1.5 plasmo-rounded-lg plasmo-text-p-sm plasmo-font-medium plasmo-shadow-sm plasmo-transition-colors"
            >
              <Bed className="plasmo-size-3.5" />
              Add stay
            </button>
            <button
              onClick={() => { setPanel("daytrip"); setFabOpen(false); }}
              className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-bg-muted hover:plasmo-bg-muted/80 plasmo-text-foreground plasmo-px-3 plasmo-py-1.5 plasmo-rounded-lg plasmo-text-p-sm plasmo-font-medium plasmo-shadow-sm plasmo-transition-colors"
            >
              <MapPin className="plasmo-size-3.5" />
              Add daytrip
            </button>
          </div>
        )}

        <button
          onClick={() => setFabOpen(!fabOpen)}
          className="plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-bg-primary hover:plasmo-bg-primary/90 plasmo-text-primary-foreground plasmo-px-4 plasmo-py-2 plasmo-rounded-lg plasmo-text-p plasmo-font-semibold plasmo-shadow-md plasmo-transition-transform active:plasmo-scale-[98%]"
        >
          <Plus className={`plasmo-size-4 plasmo-transition-transform plasmo-duration-200 ${fabOpen ? 'plasmo-rotate-45' : ''}`} />
          Add event
        </button>
      </div>

    </div>
  );
}