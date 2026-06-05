import CreateGymForm from "./create-gym-form"

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold">Create Gym Listing</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Fill in the form below to add a new gym record to the database.
          Latitude, longitude, and images are ignored for now.
        </p>
      </div>
      <CreateGymForm />
    </main>
  )
}
