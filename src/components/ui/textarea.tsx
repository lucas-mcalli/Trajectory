import * as React from "react"

import { cn } from "src/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "plasmo-flex plasmo-min-h-[80px] plasmo-w-full plasmo-rounded-md plasmo-border plasmo-border-input plasmo-bg-background plasmo-px-3 plasmo-py-2 plasmo-text-base plasmo-ring-offset-background placeholder:plasmo-text-muted-foreground focus-visible:plasmo-outline-none focus-visible:plasmo-ring-2 focus-visible:plasmo-ring-ring focus-visible:plasmo-ring-offset-2 disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50 md:plasmo-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
