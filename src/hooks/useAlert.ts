import { useState } from "react"
import type { AlertConfig } from "~types"

export function useAlert() {
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertContent, setAlertContent] = useState<AlertConfig>({
    title: "",
    description: "",
    cancelButton: false,
    cancelLabel: "Cancel",
    actionLabel: "OK",
    onAction: () => {}
  })

  function triggerAlert(config: AlertConfig) {
    setAlertContent({ ...config, cancelLabel: config.cancelLabel ?? "Cancel" })
    setAlertOpen(true)
  }

  return { alertOpen, setAlertOpen, alertContent, triggerAlert }
}