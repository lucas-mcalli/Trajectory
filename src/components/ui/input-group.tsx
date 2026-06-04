import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "src/lib/utils"
import { Button } from "src/components/ui/button"
import { Input } from "src/components/ui/input"
import { Textarea } from "src/components/ui/textarea"

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "plasmo-group/input-group plasmo-border-input dark:plasmo-bg-input/30 plasmo-shadow-xs plasmo-relative plasmo-flex plasmo-w-full plasmo-items-center plasmo-rounded-md plasmo-border plasmo-outline-none plasmo-transition-[color,box-shadow]",
        "plasmo-h-9 has-[>textarea]:plasmo-h-auto",

        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:plasmo-pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:plasmo-pr-2",
        "has-[>[data-align=block-start]]:plasmo-h-auto has-[>[data-align=block-start]]:plasmo-flex-col has-[>[data-align=block-start]]:[&>input]:plasmo-pb-3",
        "has-[>[data-align=block-end]]:plasmo-h-auto has-[>[data-align=block-end]]:plasmo-flex-col has-[>[data-align=block-end]]:[&>input]:plasmo-pt-3",

        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:plasmo-ring-ring has-[[data-slot=input-group-control]:focus-visible]:plasmo-ring-2",

        // Error state.
        "has-[[data-slot][aria-invalid=true]]:plasmo-ring-destructive/20 has-[[data-slot][aria-invalid=true]]:plasmo-border-destructive dark:has-[[data-slot][aria-invalid=true]]:plasmo-ring-destructive/40",

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  "plasmo-text-muted-foreground plasmo-flex plasmo-h-auto plasmo-cursor-text plasmo-select-none plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-py-1.5 plasmo-text-sm plasmo-font-medium group-data-[disabled=true]/input-group:plasmo-opacity-50 [&>kbd]:plasmo-rounded-[calc(var(--radius)-5px)] [&>svg:not([class*=size-])]:plasmo-size-4",
  {
    variants: {
      align: {
        "inline-start":
          "plasmo-order-first plasmo-pl-3 has-[>button]:plasmo-ml-[-0.45rem] has-[>kbd]:plasmo-ml-[-0.35rem]",
        "inline-end":
          "plasmo-order-last plasmo-pr-3 has-[>button]:plasmo-mr-[-0.4rem] has-[>kbd]:plasmo-mr-[-0.35rem]",
        "block-start":
          "[.border-b]:plasmo-pb-3 plasmo-order-first plasmo-w-full plasmo-justify-start plasmo-px-3 plasmo-pt-3 group-has-[>input]/input-group:plasmo-pt-2.5",
        "block-end":
          "[.border-t]:plasmo-pt-3 plasmo-order-last plasmo-w-full plasmo-justify-start plasmo-px-3 plasmo-pb-3 group-has-[>input]/input-group:plasmo-pb-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-sm plasmo-shadow-none",
  {
    variants: {
      size: {
        xs: "plasmo-h-6 plasmo-gap-1 plasmo-rounded-[calc(var(--radius)-5px)] plasmo-px-2 has-[>svg]:plasmo-px-2 [&>svg:not([class*=size-])]:plasmo-size-3.5",
        sm: "plasmo-h-8 plasmo-gap-1.5 plasmo-rounded-md plasmo-px-2.5 has-[>svg]:plasmo-px-2.5",
        "icon-xs":
          "plasmo-size-6 plasmo-rounded-[calc(var(--radius)-5px)] plasmo-p-0 has-[>svg]:plasmo-p-0",
        "icon-sm": "plasmo-size-8 plasmo-p-0 has-[>svg]:plasmo-p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "plasmo-text-muted-foreground plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-sm [&_svg:not([class*=size-])]:plasmo-size-4 [&_svg]:plasmo-pointer-events-none",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "plasmo-flex-1 plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-shadow-none focus-visible:plasmo-ring-0 dark:plasmo-bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "plasmo-flex-1 plasmo-resize-none plasmo-rounded-none plasmo-border-0 plasmo-bg-transparent plasmo-py-3 plasmo-shadow-none focus-visible:plasmo-ring-0 dark:plasmo-bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
