import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "src/lib/utils"
import { Label } from "src/components/ui/label"
import { Separator } from "src/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "plasmo-flex plasmo-flex-col plasmo-gap-6",
        "has-[>[data-slot=checkbox-group]]:plasmo-gap-3 has-[>[data-slot=radio-group]]:plasmo-gap-3",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "plasmo-mb-3 plasmo-font-medium",
        "data-[variant=legend]:plasmo-text-base",
        "data-[variant=label]:plasmo-text-sm",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "plasmo-group/field-group plasmo-@container/field-group plasmo-flex plasmo-w-full plasmo-flex-col plasmo-gap-7 data-[slot=checkbox-group]:plasmo-gap-3 [&>[data-slot=field-group]]:plasmo-gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "plasmo-group/field data-[invalid=true]:plasmo-text-destructive plasmo-flex plasmo-w-full plasmo-gap-1.5",
  {
    variants: {
      orientation: {
        vertical: ["plasmo-flex-col [&>*]:plasmo-w-full [&>.sr-only]:plasmo-w-auto"],
        horizontal: [
          "plasmo-flex-row plasmo-items-center",
          "[&>[data-slot=field-label]]:plasmo-flex-auto",
          "has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:plasmo-mt-px has-[>[data-slot=field-content]]:plasmo-items-start",
        ],
        responsive: [
          "@md/field-group:plasmo-flex-row @md/field-group:plasmo-items-center @md/field-group:[&>*]:plasmo-w-auto plasmo-flex-col [&>*]:plasmo-w-full [&>.sr-only]:plasmo-w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:plasmo-flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:plasmo-items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:plasmo-mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "plasmo-group/field-content plasmo-flex plasmo-flex-1 plasmo-flex-col plasmo-gap-1.5 plasmo-leading-snug",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "plasmo-group/field-label plasmo-peer/field-label plasmo-flex plasmo-w-fit plasmo-gap-2 plasmo-leading-snug group-data-[disabled=true]/field:plasmo-opacity-50",
        "has-[>[data-slot=field]]:plasmo-w-full has-[>[data-slot=field]]:plasmo-flex-col has-[>[data-slot=field]]:plasmo-rounded-md has-[>[data-slot=field]]:plasmo-border [&>[data-slot=field]]:plasmo-p-4",
        "has-data-[state=checked]:plasmo-bg-primary/5 has-data-[state=checked]:plasmo-border-primary dark:has-data-[state=checked]:plasmo-bg-primary/10",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "plasmo-flex plasmo-w-fit plasmo-items-center plasmo-gap-2 plasmo-text-sm plasmo-font-medium plasmo-leading-snug group-data-[disabled=true]/field:plasmo-opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "plasmo-text-muted-foreground plasmo-text-sm plasmo-font-normal plasmo-leading-normal group-has-[[data-orientation=horizontal]]/field:plasmo-text-balance",
        "nth-last-2:plasmo--mt-1 last:plasmo-mt-0 [[data-variant=legend]+&]:plasmo--mt-1.5",
        "[&>a:hover]:plasmo-text-primary [&>a]:plasmo-underline [&>a]:plasmo-underline-offset-4",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "plasmo-relative plasmo--my-2 plasmo-h-5 plasmo-text-sm group-data-[variant=outline]/field-group:plasmo--mb-2",
        className
      )}
      {...props}
    >
      <Separator className="plasmo-absolute plasmo-inset-0 plasmo-top-1/2" />
      {children && (
        <span
          className="plasmo-bg-background plasmo-text-muted-foreground plasmo-relative plasmo-mx-auto plasmo-block plasmo-w-fit plasmo-px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="plasmo-ml-4 plasmo-flex plasmo-list-disc plasmo-flex-col plasmo-gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("plasmo-text-destructive plasmo-text-sm plasmo-font-normal", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
