import { Spinner } from "./spinner"

export function DefaultLoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-background">
      <Spinner />
    </div>
  )
}
