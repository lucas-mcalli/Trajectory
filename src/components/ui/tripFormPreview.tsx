import { useEffect, useState } from "react"
import { fetchLocationPhoto } from "~helpers"

export const regionPreviews: Record<string, Array<{ city: string; country: string; flag: string }>> = {
  "northeastern-us": [
    { city: "New York City", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Boston", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Philadelphia", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Washington D.C.", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Pittsburgh", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Portland", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Newport", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Buffalo", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Baltimore", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Cape Cod", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" }
  ],
  "southern-us": [
    { city: "New Orleans", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Miami", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Atlanta", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Austin", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Nashville", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Charleston", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Savannah", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Houston", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Orlando", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Key West", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" }
  ],
  "western-us": [
    { city: "Los Angeles", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "San Francisco", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Seattle", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Las Vegas", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Denver", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Portland", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Phoenix", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Salt Lake City", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "San Diego", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Aspen", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" }
  ],
  "canada": [
    { city: "Vancouver", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Toronto", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Montreal", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Quebec City", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Calgary", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Banff", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Ottawa", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Victoria", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Whistler", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" },
    { city: "Halifax", country: "Canada", flag: "https://flagsapi.com/CA/flat/64.png" }
  ],
  "mexico-central-america": [
    { city: "Mexico City", country: "Mexico", flag: "https://flagsapi.com/MX/flat/64.png" },
    { city: "Cancun", country: "Mexico", flag: "https://flagsapi.com/MX/flat/64.png" },
    { city: "Oaxaca", country: "Mexico", flag: "https://flagsapi.com/MX/flat/64.png" },
    { city: "Guatemala City", country: "Guatemala", flag: "https://flagsapi.com/GT/flat/64.png" },
    { city: "Antigua", country: "Guatemala", flag: "https://flagsapi.com/GT/flat/64.png" },
    { city: "San Jose", country: "Costa Rica", flag: "https://flagsapi.com/CR/flat/64.png" },
    { city: "Panama City", country: "Panama", flag: "https://flagsapi.com/PA/flat/64.png" },
    { city: "San Salvador", country: "El Salvador", flag: "https://flagsapi.com/SV/flat/64.png" },
    { city: "Roatan", country: "Honduras", flag: "https://flagsapi.com/HN/flat/64.png" },
    { city: "Granada", country: "Nicaragua", flag: "https://flagsapi.com/NI/flat/64.png" }
  ],
  "caribbean": [
    { city: "Havana", country: "Cuba", flag: "https://flagsapi.com/CU/flat/64.png" },
    { city: "San Juan", country: "Puerto Rico", flag: "https://flagsapi.com/PR/flat/64.png" },
    { city: "Nassau", country: "Bahamas", flag: "https://flagsapi.com/BS/flat/64.png" },
    { city: "Kingston", country: "Jamaica", flag: "https://flagsapi.com/JM/flat/64.png" },
    { city: "Punta Cana", country: "Dominican Republic", flag: "https://flagsapi.com/DO/flat/64.png" },
    { city: "Santo Domingo", country: "Dominican Republic", flag: "https://flagsapi.com/DO/flat/64.png" },
    { city: "Willemstad", country: "Curaçao", flag: "https://flagsapi.com/CW/flat/64.png" },
    { city: "Oranjestad", country: "Aruba", flag: "https://flagsapi.com/AW/flat/64.png" },
    { city: "Grand Cayman", country: "Cayman Islands", flag: "https://flagsapi.com/KY/flat/64.png" },
    { city: "St. George's", country: "Grenada", flag: "https://flagsapi.com/GD/flat/64.png" }
  ],
  "south-america": [
    { city: "Buenos Aires", country: "Argentina", flag: "https://flagsapi.com/AR/flat/64.png" },
    { city: "Rio de Janeiro", country: "Brazil", flag: "https://flagsapi.com/BR/flat/64.png" },
    { city: "São Paulo", country: "Brazil", flag: "https://flagsapi.com/BR/flat/64.png" },
    { city: "Lima", country: "Peru", flag: "https://flagsapi.com/PE/flat/64.png" },
    { city: "Bogota", country: "Colombia", flag: "https://flagsapi.com/CO/flat/64.png" },
    { city: "Medellin", country: "Colombia", flag: "https://flagsapi.com/CO/flat/64.png" },
    { city: "Santiago", country: "Chile", flag: "https://flagsapi.com/CL/flat/64.png" },
    { city: "Quito", country: "Ecuador", flag: "https://flagsapi.com/EC/flat/64.png" },
    { city: "Cusco", country: "Peru", flag: "https://flagsapi.com/PE/flat/64.png" },
    { city: "Cartagena", country: "Colombia", flag: "https://flagsapi.com/CO/flat/64.png" }
  ],
  "western-europe": [
    { city: "Paris", country: "France", flag: "https://flagsapi.com/FR/flat/64.png" },
    { city: "London", country: "United Kingdom", flag: "https://flagsapi.com/GB/flat/64.png" },
    { city: "Amsterdam", country: "Netherlands", flag: "https://flagsapi.com/NL/flat/64.png" },
    { city: "Brussels", country: "Belgium", flag: "https://flagsapi.com/BE/flat/64.png" },
    { city: "Berlin", country: "Germany", flag: "https://flagsapi.com/DE/flat/64.png" },
    { city: "Munich", country: "Germany", flag: "https://flagsapi.com/DE/flat/64.png" },
    { city: "Vienna", country: "Austria", flag: "https://flagsapi.com/AT/flat/64.png" },
    { city: "Zurich", country: "Switzerland", flag: "https://flagsapi.com/CH/flat/64.png" },
    { city: "Geneva", country: "Switzerland", flag: "https://flagsapi.com/CH/flat/64.png" },
    { city: "Edinburgh", country: "United Kingdom", flag: "https://flagsapi.com/GB/flat/64.png" }
  ],
  "southern-europe": [
    { city: "Barcelona", country: "Spain", flag: "https://flagsapi.com/ES/flat/64.png" },
    { city: "Madrid", country: "Spain", flag: "https://flagsapi.com/ES/flat/64.png" },
    { city: "Rome", country: "Italy", flag: "https://flagsapi.com/IT/flat/64.png" },
    { city: "Milan", country: "Italy", flag: "https://flagsapi.com/IT/flat/64.png" },
    { city: "Venice", country: "Italy", flag: "https://flagsapi.com/IT/flat/64.png" },
    { city: "Lisbon", country: "Portugal", flag: "https://flagsapi.com/PT/flat/64.png" },
    { city: "Athens", country: "Greece", flag: "https://flagsapi.com/GR/flat/64.png" },
    { city: "Santorini", country: "Greece", flag: "https://flagsapi.com/GR/flat/64.png" },
    { city: "Florence", country: "Italy", flag: "https://flagsapi.com/IT/flat/64.png" },
    { city: "Seville", country: "Spain", flag: "https://flagsapi.com/ES/flat/64.png" }
  ],
  "northern-europe": [
    { city: "Copenhagen", country: "Denmark", flag: "https://flagsapi.com/DK/flat/64.png" },
    { city: "Stockholm", country: "Sweden", flag: "https://flagsapi.com/SE/flat/64.png" },
    { city: "Oslo", country: "Norway", flag: "https://flagsapi.com/NO/flat/64.png" },
    { city: "Helsinki", country: "Finland", flag: "https://flagsapi.com/FI/flat/64.png" },
    { city: "Reykjavik", country: "Iceland", flag: "https://flagsapi.com/IS/flat/64.png" },
    { city: "Dublin", country: "Ireland", flag: "https://flagsapi.com/IE/flat/64.png" },
    { city: "Tallinn", country: "Estonia", flag: "https://flagsapi.com/EE/flat/64.png" },
    { city: "Bergen", country: "Norway", flag: "https://flagsapi.com/NO/flat/64.png" },
    { city: "Gothenburg", country: "Sweden", flag: "https://flagsapi.com/SE/flat/64.png" },
    { city: "Riga", country: "Latvia", flag: "https://flagsapi.com/LV/flat/64.png" }
  ],
  "eastern-europe": [
    { city: "Prague", country: "Czech Republic", flag: "https://flagsapi.com/CZ/flat/64.png" },
    { city: "Budapest", country: "Hungary", flag: "https://flagsapi.com/HU/flat/64.png" },
    { city: "Warsaw", country: "Poland", flag: "https://flagsapi.com/PL/flat/64.png" },
    { city: "Krakow", country: "Poland", flag: "https://flagsapi.com/PL/flat/64.png" },
    { city: "Bucharest", country: "Romania", flag: "https://flagsapi.com/RO/flat/64.png" },
    { city: "Dubrovnik", country: "Croatia", flag: "https://flagsapi.com/HR/flat/64.png" },
    { city: "Split", country: "Croatia", flag: "https://flagsapi.com/HR/flat/64.png" },
    { city: "Ljubljana", country: "Slovenia", flag: "https://flagsapi.com/SI/flat/64.png" },
    { city: "Bratislava", country: "Slovakia", flag: "https://flagsapi.com/SK/flat/64.png" },
    { city: "Sofia", country: "Bulgaria", flag: "https://flagsapi.com/BG/flat/64.png" }
  ],
  "middle-east": [
    { city: "Dubai", country: "UAE", flag: "https://flagsapi.com/AE/flat/64.png" },
    { city: "Abu Dhabi", country: "UAE", flag: "https://flagsapi.com/AE/flat/64.png" },
    { city: "Istanbul", country: "Turkey", flag: "https://flagsapi.com/TR/flat/64.png" },
    { city: "Doha", country: "Qatar", flag: "https://flagsapi.com/QA/flat/64.png" },
    { city: "Muscat", country: "Oman", flag: "https://flagsapi.com/OM/flat/64.png" },
    { city: "Manama", country: "Bahrain", flag: "https://flagsapi.com/BH/flat/64.png" },
    { city: "Riyadh", country: "Saudi Arabia", flag: "https://flagsapi.com/SA/flat/64.png" },
    { city: "Jeddah", country: "Saudi Arabia", flag: "https://flagsapi.com/SA/flat/64.png" },
    { city: "Amman", country: "Jordan", flag: "https://flagsapi.com/JO/flat/64.png" },
    { city: "Petra", country: "Jordan", flag: "https://flagsapi.com/JO/flat/64.png" }
  ],
  "north-africa": [
    { city: "Marrakech", country: "Morocco", flag: "https://flagsapi.com/MA/flat/64.png" },
    { city: "Cairo", country: "Egypt", flag: "https://flagsapi.com/EG/flat/64.png" },
    { city: "Casablanca", country: "Morocco", flag: "https://flagsapi.com/MA/flat/64.png" },
    { city: "Tunis", country: "Tunisia", flag: "https://flagsapi.com/TN/flat/64.png" },
    { city: "Alexandria", country: "Egypt", flag: "https://flagsapi.com/EG/flat/64.png" },
    { city: "Fes", country: "Morocco", flag: "https://flagsapi.com/MA/flat/64.png" },
    { city: "Luxor", country: "Egypt", flag: "https://flagsapi.com/EG/flat/64.png" },
    { city: "Chefchaouen", country: "Morocco", flag: "https://flagsapi.com/MA/flat/64.png" },
    { city: "Algiers", country: "Algeria", flag: "https://flagsapi.com/DZ/flat/64.png" },
    { city: "Aswan", country: "Egypt", flag: "https://flagsapi.com/EG/flat/64.png" }
  ],
  "sub-saharan-africa": [
    { city: "Cape Town", country: "South Africa", flag: "https://flagsapi.com/ZA/flat/64.png" },
    { city: "Johannesburg", country: "South Africa", flag: "https://flagsapi.com/ZA/flat/64.png" },
    { city: "Nairobi", country: "Kenya", flag: "https://flagsapi.com/KE/flat/64.png" },
    { city: "Lagos", country: "Nigeria", flag: "https://flagsapi.com/NG/flat/64.png" },
    { city: "Accra", country: "Ghana", flag: "https://flagsapi.com/GH/flat/64.png" },
    { city: "Dakar", country: "Senegal", flag: "https://flagsapi.com/SN/flat/64.png" },
    { city: "Zanzibar", country: "Tanzania", flag: "https://flagsapi.com/TZ/flat/64.png" },
    { city: "Victoria Falls", country: "Zimbabwe", flag: "https://flagsapi.com/ZW/flat/64.png" },
    { city: "Antananarivo", country: "Madagascar", flag: "https://flagsapi.com/MG/flat/64.png" },
    { city: "Windhoek", country: "Namibia", flag: "https://flagsapi.com/NA/flat/64.png" }
  ],
  "south-asia": [
    { city: "Mumbai", country: "India", flag: "https://flagsapi.com/IN/flat/64.png" },
    { city: "New Delhi", country: "India", flag: "https://flagsapi.com/IN/flat/64.png" },
    { city: "Kathmandu", country: "Nepal", flag: "https://flagsapi.com/NP/flat/64.png" },
    { city: "Colombo", country: "Sri Lanka", flag: "https://flagsapi.com/LK/flat/64.png" },
    { city: "Malé", country: "Maldives", flag: "https://flagsapi.com/MV/flat/64.png" },
    { city: "Dhaka", country: "Bangladesh", flag: "https://flagsapi.com/BD/flat/64.png" },
    { city: "Goa", country: "India", flag: "https://flagsapi.com/IN/flat/64.png" },
    { city: "Jaipur", country: "India", flag: "https://flagsapi.com/IN/flat/64.png" },
    { city: "Thimphu", country: "Bhutan", flag: "https://flagsapi.com/BT/flat/64.png" },
    { city: "Pokhara", country: "Nepal", flag: "https://flagsapi.com/NP/flat/64.png" }
  ],
  "southeast-asia": [
    { city: "Bangkok", country: "Thailand", flag: "https://flagsapi.com/TH/flat/64.png" },
    { city: "Singapore", country: "Singapore", flag: "https://flagsapi.com/SG/flat/64.png" },
    { city: "Kuala Lumpur", country: "Malaysia", flag: "https://flagsapi.com/MY/flat/64.png" },
    { city: "Hanoi", country: "Vietnam", flag: "https://flagsapi.com/VN/flat/64.png" },
    { city: "Ho Chi Minh City", country: "Vietnam", flag: "https://flagsapi.com/VN/flat/64.png" },
    { city: "Manila", country: "Philippines", flag: "https://flagsapi.com/PH/flat/64.png" },
    { city: "Jakarta", country: "Indonesia", flag: "https://flagsapi.com/ID/flat/64.png" },
    { city: "Phnom Penh", country: "Cambodia", flag: "https://flagsapi.com/KH/flat/64.png" },
    { city: "Siem Reap", country: "Cambodia", flag: "https://flagsapi.com/KH/flat/64.png" },
    { city: "Bali", country: "Indonesia", flag: "https://flagsapi.com/ID/flat/64.png" }
  ],
  "east-asia": [
    { city: "Shanghai", country: "China", flag: "https://flagsapi.com/CN/flat/64.png" },
    { city: "Beijing", country: "China", flag: "https://flagsapi.com/CN/flat/64.png" },
    { city: "Hong Kong", country: "Hong Kong", flag: "https://flagsapi.com/HK/flat/64.png" },
    { city: "Taipei", country: "Taiwan", flag: "https://flagsapi.com/TW/flat/64.png" },
    { city: "Macau", country: "Macau", flag: "https://flagsapi.com/MO/flat/64.png" },
    { city: "Chengdu", country: "China", flag: "https://flagsapi.com/CN/flat/64.png" },
    { city: "Xi'an", country: "China", flag: "https://flagsapi.com/CN/flat/64.png" },
    { city: "Guangzhou", country: "China", flag: "https://flagsapi.com/CN/flat/64.png" },
    { city: "Ulaanbaatar", country: "Mongolia", flag: "https://flagsapi.com/MN/flat/64.png" },
    { city: "Hangzhou", country: "China", flag: "https://flagsapi.com/CN/flat/64.png" }
  ],
  "japan-korea": [
    { city: "Tokyo", country: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
    { city: "Seoul", country: "South Korea", flag: "https://flagsapi.com/KR/flat/64.png" },
    { city: "Kyoto", country: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
    { city: "Osaka", country: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
    { city: "Busan", country: "South Korea", flag: "https://flagsapi.com/KR/flat/64.png" },
    { city: "Jeju Island", country: "South Korea", flag: "https://flagsapi.com/KR/flat/64.png" },
    { city: "Sapporo", country: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
    { city: "Hiroshima", country: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" },
    { city: "Incheon", country: "South Korea", flag: "https://flagsapi.com/KR/flat/64.png" },
    { city: "Okinawa", country: "Japan", flag: "https://flagsapi.com/JP/flat/64.png" }
  ],
  "australia-nz": [
    { city: "Sydney", country: "Australia", flag: "https://flagsapi.com/AU/flat/64.png" },
    { city: "Melbourne", country: "Australia", flag: "https://flagsapi.com/AU/flat/64.png" },
    { city: "Auckland", country: "New Zealand", flag: "https://flagsapi.com/NZ/flat/64.png" },
    { city: "Queenstown", country: "New Zealand", flag: "https://flagsapi.com/NZ/flat/64.png" },
    { city: "Brisbane", country: "Australia", flag: "https://flagsapi.com/AU/flat/64.png" },
    { city: "Perth", country: "Australia", flag: "https://flagsapi.com/AU/flat/64.png" },
    { city: "Cairns", country: "Australia", flag: "https://flagsapi.com/AU/flat/64.png" },
    { city: "Wellington", country: "New Zealand", flag: "https://flagsapi.com/NZ/flat/64.png" },
    { city: "Christchurch", country: "New Zealand", flag: "https://flagsapi.com/NZ/flat/64.png" },
    { city: "Adelaide", country: "Australia", flag: "https://flagsapi.com/AU/flat/64.png" }
  ],
  "pacific-islands": [
    { city: "Honolulu", country: "United States", flag: "https://flagsapi.com/US/flat/64.png" },
    { city: "Bora Bora", country: "French Polynesia", flag: "https://flagsapi.com/PF/flat/64.png" },
    { city: "Tahiti", country: "French Polynesia", flag: "https://flagsapi.com/PF/flat/64.png" },
    { city: "Fiji", country: "Fiji", flag: "https://flagsapi.com/FJ/flat/64.png" },
    { city: "Guam", country: "Guam", flag: "https://flagsapi.com/GU/flat/64.png" },
    { city: "Samoa", country: "Samoa", flag: "https://flagsapi.com/WS/flat/64.png" },
    { city: "Port Vila", country: "Vanuatu", flag: "https://flagsapi.com/VU/flat/64.png" },
    { city: "Rarotonga", country: "Cook Islands", flag: "https://flagsapi.com/CK/flat/64.png" },
    { city: "Nuku'alofa", country: "Tonga", flag: "https://flagsapi.com/TO/flat/64.png" },
    { city: "Palau", country: "Palau", flag: "https://flagsapi.com/PW/flat/64.png" }
  ]
}

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

      <div className="plasmo-relative plasmo-flex plasmo-justify-end plasmo-z-10 plasmo-text-white plasmo-space-y-1">
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