import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~components/ui/alert-dialog"
import type { AlertModalProps } from "~types"

export function AlertModal({ open, onOpenChange, title, description, cancelButton, cancelLabel = "Cancel", actionLabel, onAction }: AlertModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelButton && (
            <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          )}
          <AlertDialogAction onClick={() => { onAction(); onOpenChange(false) }}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}