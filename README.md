# Trajectory

A Chrome extension for visual trip planning. Build and manage travel itineraries through a chronological timeline, adding flights, stays, and day trips. Trajectory automatically arranges them with proportional gaps so you can see the full shape of your journey at a glance.

![Trajectory](assets/icon.png)

---

## Features

- **Visual timeline** — events arranged chronologically with proportional gap spacing that reflects actual elapsed time
- **Three event types** — flights (with multi-leg support), hotel/accommodation stays, and day trips
- **Destination cover photos** — pulled from Unsplash based on trip region
- **Multiple trips** — create and manage separate trip cards from the home screen
- **Fully local** — all data stored in `chrome.storage.sync`.

---

## Stack

| | |
|---|---|
| Framework | [Plasmo](https://docs.plasmo.com/) |
| UI | React + TypeScript |
| Styling | Tailwind CSS (via `plasmo-` prefix) |
| Components | shadcn/ui (manually configured) |
| Forms | react-hook-form + Zod |
| Storage | `@plasmohq/storage` |
| Photos | Unsplash API |
| Airline logos | [logo.dev](https://logo.dev) |
| Country flags | [flagsapi.com](https://flagsapi.com) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
git clone https://github.com/lucas-mcalli/trajectory.git
cd trajectory
pnpm install
```

### Environment variables

Create a `.env.local` file in the project root:

```env
PLASMO_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

Get a free Unsplash API key at [unsplash.com/developers](https://unsplash.com/developers).

### Development

```bash
pnpm dev
```

Then load the extension in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `build/chrome-mv3-dev` folder

### Production build

```bash
pnpm package
```

Output is in `build/chrome-mv3-prod`.

---

## Project Structure

```
src/
├── assets/          # SVG icons and wordmark
├── components/
│   ├── screens/     # HomeScreen, TripScreen, CreateTripScreen
│   └── ui/          # Shared components (Navbar, DateTimePicker, event cards, forms)
├── context/         # RightPanelContext
├── data/            # airlines.json, regions.json, regionPreviews.json
├── lib/             # utils (cn)
├── types/           # index.ts — Trip, TimelineEvent, Flight, Stay, Daytrip
├── helpers.ts       # Date utils, gap height, photo fetching, event sorting
└── popup.tsx        # Extension entry point
```

---

## Data Model

All trip data is stored under `chrome.storage.sync` keyed by trip ID:

- `"trips"` — `Trip[]` (id, name, regionId, coverPhotoUrl, createdAt)
- `"events-{tripId}"` — `TimelineEvent[]` (Flight | Stay | Daytrip, each with a stable `id`)

Events are stored independently from trips and sorted at render time.

---

## Known Limitations

- The Unsplash free tier has rate limits (50 requests/hour). Cover photos may fail to load if the limit is hit.
- `chrome.storage.sync` has a 100KB total quota. Very large trip datasets (many events across many trips) may approach this limit.

---

## License

MIT
