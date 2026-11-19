import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

type AppHeaderActionsProps = {
  onChangeMode: () => void
}

export function AppHeaderActions({ onChangeMode }: AppHeaderActionsProps) {
  return (
    <div className="header-actions-bar flex shrink-0 flex-wrap items-center justify-end gap-1.5">
      <ModeToggle />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer border-transparent bg-transparent shadow-none hover:bg-muted/80"
        onClick={onChangeMode}
      >
        Change Mode
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        aria-disabled="true"
        className="border-transparent bg-transparent opacity-45 shadow-none"
      >
        Login
      </Button>
    </div>
  )
}
