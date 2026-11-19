import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

type AppHeaderActionsProps = {
  onChangeMode: () => void
}

export function AppHeaderActions({ onChangeMode }: AppHeaderActionsProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2.5">
      <ModeToggle />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer"
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
        className="opacity-45"
      >
        Login
      </Button>
    </div>
  )
}
