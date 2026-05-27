import React, { useRef, useState } from "react"
import "~style.css"
import { Navbar } from "./navbar"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type TripEvent = {
  id: string
  type: "flight" | "airbnb"
  title: string
  details?: string
}

const sampleTrip = (): TripEvent[] => [
  { id: "e1", type: "flight", title: "Flight: SFO → LAX", details: "AA 123 • 9:00 AM" },
  { id: "e2", type: "airbnb", title: "Stay: Cozy Cottage", details: "3 nights • Oceanview" },
  { id: "e3", type: "flight", title: "Flight: LAX → SFO", details: "AA 987 • 6:30 PM" }
]

function SortableItem({ id, item, dark }: { id: string; item: TripEvent; dark: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id }) // all of these parameters come from the useSortable dnd-kit hook. They are used to make the cards draggable.
  const transformStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined
  }

  const baseClasses = isDragging
    ? "plasmo-p-3 plasmo-rounded plasmo-border-2 plasmo-border-dashed plasmo-border-blue-400 plasmo-bg-transparent"
    : `plasmo-p-3 plasmo-rounded plasmo-shadow-sm ${dark ? "plasmo-bg-slate-900 plasmo-border plasmo-border-slate-700" : "plasmo-bg-white plasmo-border plasmo-border-gray-200"}`

  return (
    <li ref={setNodeRef} style={transformStyle} {...attributes} {...listeners} className={baseClasses}>
      {!isDragging ? (
        <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
          <div>
            <div className="plasmo-font-semibold">{item.type === "flight" ? "✈️ " : "🏠 "}{item.title}</div>
            <div className="plasmo-text-sm plasmo-text-gray-400">{item.details}</div>
          </div>
          <div className="plasmo-text-xs plasmo-text-gray-500">Drag</div>
        </div>
      ) : (
        <div style={{ height: 40 }} />
      )}
    </li>
  )
}

function renderDragOverlay(item: TripEvent, dark: boolean) {
  if (!item) return null
  return (
    <div className="plasmo-p-3 plasmo-rounded plasmo-shadow-lg plasmo-w-[520px] plasmo-bg-white dark:plasmo-bg-slate-900">
      <div className="plasmo-font-semibold">{item.type === "flight" ? "✈️ " : "🏠 "}{item.title}</div>
      <div className="plasmo-text-sm plasmo-text-gray-400">{item.details}</div>
    </div>
  )
}

export default function IndexPopup() {
  const [dark, setDark] = useState(false)
  const [timeline, setTimeline] = useState<TripEvent[] | null>(null)
  const dragIndex = useRef<number | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const sensors = useSensors(useSensor(PointerSensor))

  const onCreate = () => setTimeline(sampleTrip())

  // legacy HTML5 drag handlers replaced by dnd-kit below

  const addEvent = (type: TripEvent["type"]) => {
    setTimeline((prev) => {
      const next = prev ? [...prev] : [] // spread operator here makes next, a new array with the SAME elements as prev. It's asking "does prev exist? if so, make a new array with the same elements. If not, start with an empty array. This is required by React state management to trigger re-renders, as directly mutating prev would not create a new reference and thus React would not detect the change."
      next.push({ id: String(Date.now()), type, title: type === "flight" ? "New Flight" : "New Stay", details: "details" }) 
      return next
    })
  }

  return (
    <div className={`plasmo-min-h-[600px] plasmo-w-[600px] plasmo-rounded-md plasmo-overflow-hidden plasmo-text-slate-900 dark:plasmo-text-slate-100 ${dark ? "dark plasmo-bg-slate-900 plasmo-text-slate-100" : "plasmo-bg-white plasmo-text-slate-900"}}`}>
      <Navbar dark={dark} setDark={setDark} />

      <main className="plasmo-p-4">
        {!timeline ? (
          <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-4 plasmo-py-8">
            <h3 className="plasmo-text-2xl plasmo-font-semibold">Create New Trip</h3>
            <p className="plasmo-text-sm plasmo-text-gray-500">Start building a timeline: add flights, stays and reorder them.</p>
            <div className="plasmo-flex plasmo-gap-3 plasmo-mt-3">
              <button className="plasmo-px-4 plasmo-py-2 plasmo-rounded plasmo-bg-blue-600 plasmo-text-white" onClick={onCreate}>Create new trip</button>
              <button className="plasmo-px-3 plasmo-py-2 plasmo-rounded plasmo-border" onClick={() => addEvent("airbnb")}>Add sample stay</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-4">
              <h3 className="plasmo-text-xl plasmo-font-semibold">My Trip</h3>
              <div className="plasmo-flex plasmo-gap-2">
                <button className="plasmo-px-3 plasmo-py-1 plasmo-rounded plasmo-border" onClick={() => setTimeline(null)}>Reset</button>
                <button className="plasmo-px-3 plasmo-py-1 plasmo-rounded plasmo-border" onClick={() => addEvent("flight")}>+ Flight</button>
                <button className="plasmo-px-3 plasmo-py-1 plasmo-rounded plasmo-border" onClick={() => addEvent("airbnb")}>+ Stay</button>
              </div>
            </div>

            {timeline && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={({ active }) => setActiveId(active.id as string)}
                onDragEnd={({ active, over }) => {
                  setActiveId(null)
                  if (!over) return
                  if (active.id === over.id) return
                  setTimeline((prev) => {
                    if (!prev) return prev
                    const oldIndex = prev.findIndex((t) => t.id === active.id)
                    const newIndex = prev.findIndex((t) => t.id === over.id)
                    if (oldIndex === -1 || newIndex === -1) return prev
                    return arrayMove(prev, oldIndex, newIndex)
                  })
                }}
              >
                <SortableContext items={timeline.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <ul className="plasmo-space-y-3">
                    {timeline.map((ev) => (
                      <SortableItem key={ev.id} id={ev.id} item={ev} dark={dark} />
                    ))}
                  </ul>
                </SortableContext>

                <DragOverlay>{activeId ? renderDragOverlay(timeline.find((t) => t.id === activeId)!, dark) : null}</DragOverlay>
              </DndContext>
            )}
          </div>
        )}
      </main>
    </div>
  )
}