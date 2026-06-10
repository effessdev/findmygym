import { Spinner } from "./spinner"

export function DefaultLoadingScreen({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden bg-background">
      <Spinner />
      {text && <p className="text-center text-muted-foreground">{text}</p>}
    </div>
  )
}
