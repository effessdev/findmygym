import CreateGymForm from "./create-gym-form"

export default function Page() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold">Create Gym Listing</h1>
        <p className="text-sm">
          Fill out the form below to create a new gym listing. All fields except
          the email are required.
        </p>
      </div>
      <CreateGymForm />
    </main>
  )
}
