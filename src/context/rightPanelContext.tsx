// src/context/RightPanelContext.tsx
import { createContext, useContext, useState } from "react"

type RightPanel = "ambient" | "flight" | "stay" | "daytrip"

const RightPanelContext = createContext<{
  panel: RightPanel
  setPanel: (panel: RightPanel) => void
}>({ panel: "ambient", setPanel: () => {} })

export function RightPanelProvider({ children }: { children: React.ReactNode }) {
  const [panel, setPanel] = useState<RightPanel>("ambient")
  return (
    <RightPanelContext.Provider value={{ panel, setPanel }}>
      {children}
    </RightPanelContext.Provider>
  )
}

export const useRightPanel = () => useContext(RightPanelContext)