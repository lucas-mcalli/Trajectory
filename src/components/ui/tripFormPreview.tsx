import { useEffect, useState } from "react"
import { fetchLocationPhoto } from "~helpers"
import { regionPreviews } from "~data/regionPreviews"

const RANDOM_CITIES = Object.values(regionPreviews).flat()

interface TripFormPreviewProps {
  regionId: string
}

export default function TripFormPreview({ regionId }: TripFormPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  function getRandomCity() {
    return RANDOM_CITIES[Math.floor(Math.random() * RANDOM_CITIES.length)]
  }

  function getCityInRegion(rId: string) {
    const cities = regionPreviews[rId]
    if (!cities || cities.length === 0) return getRandomCity()
    return cities[Math.floor(Math.random() * cities.length)]
  }

  // Pick a single stable random fallback city exactly once on mount
  const [initialRandomCity] = useState(() => getRandomCity())
  const [activeLocation, setActiveLocation] = useState<{ city: string; country: string; flag: string }>(initialRandomCity)

  useEffect(() => {
    let isMounted = true
    let targetLocation = initialRandomCity

    // Use a regional city if selected, otherwise stick to initial random city
    if (regionId) {
      targetLocation = getCityInRegion(regionId)
    }

    setActiveLocation(targetLocation)

    async function loadPhoto() {
      setIsLoading(true)
      const searchQuery = `${targetLocation.city} ${targetLocation.country}`
      const url = await fetchLocationPhoto(searchQuery)

      if (isMounted) {
        if (url) {
          setImageUrl(url)
        } else {
          // Stock photo just in case
          setImageUrl("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200")
        }
        setIsLoading(false)
      }
    }

    loadPhoto()

    return () => {
      isMounted = false
    }
  }, [regionId])

  return (
    <div className="plasmo-w-full plasmo-border plasmo-border-border plasmo-rounded-lg plasmo-bg-background-subtle plasmo-relative plasmo-overflow-hidden plasmo-flex plasmo-flex-col plasmo-justify-end plasmo-p-6 plasmo-h-[400px] md:plasmo-h-auto md:plasmo-min-h-full">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={activeLocation.city}
          className={`plasmo-absolute plasmo-inset-0 plasmo-w-full plasmo-h-full plasmo-object-cover plasmo-transition-opacity plasmo-duration-500 ${
            isLoading ? "plasmo-opacity-40 plasmo-blur-sm" : "plasmo-opacity-100"
          }`}
        />
      )}

      <div className="plasmo-absolute plasmo-inset-0 plasmo-bg-gradient-to-t plasmo-from-black/80 plasmo-via-black/20 plasmo-to-transparent" />

      <div className="plasmo-relative plasmo-flex plasmo-justify-end plasmo-text-right plasmo-z-10 plasmo-text-white plasmo-space-y-1">
        <h3 className="plasmo-text-2xl plasmo-font-bold plasmo-flex plasmo-items-center plasmo-gap-2">
          <img src={activeLocation.flag} alt={activeLocation.country} className="plasmo-w-6 plasmo-h-6 plasmo-rounded" />
          <span>
            {activeLocation.city},{" "}
            <span className="plasmo-opacity-80 plasmo-font-normal">{activeLocation.country}</span>
          </span>
        </h3>
      </div>
    </div>
  )
}