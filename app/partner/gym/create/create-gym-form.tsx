"use client"

import { useState, useTransition } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { createGym } from "./actions"
import { gymCreateSchema } from "@/lib/schemas/gym"
import Link from "next/link"

type GymFormInput = z.input<typeof gymCreateSchema>
type GymCreateValues = z.infer<typeof gymCreateSchema>

export default function CreateGymForm() {
  const [isPending, startTransition] = useTransition()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GymFormInput>({
    resolver: zodResolver(gymCreateSchema),
    defaultValues: {
      name: "",
      feePerMonth: 0,
      location: "",
      description: "",
      equipment: "",
      openingHours: "",
      contactEmail: "",
      contactPhone: "",
    },
  })

  const onSubmit: SubmitHandler<GymFormInput> = (values) => {
    setSubmissionError(null)
    setStatusMessage(null)

    startTransition(async () => {
      try {
        await createGym(values)
        reset()
        setStatusMessage("Gym created successfully.")
      } catch (error) {
        setSubmissionError(
          error instanceof Error ? error.message : "Unable to create gym."
        )
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border border-slate-200/80 bg-white/80 p-6 shadow-sm ring-1 ring-slate-200/80 dark:border-slate-800/80 dark:bg-slate-950/60 dark:ring-slate-800/80"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Gym name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your Awesome Gym"
            {...register("name")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="feePerMonth" className="block text-sm font-medium">
            Monthly fee (INR)
          </label>
          <input
            id="feePerMonth"
            type="number"
            step="0.01"
            min="0"
            {...register("feePerMonth", { valueAsNumber: true })}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.feePerMonth && (
            <p className="text-sm text-destructive">
              {errors.feePerMonth.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <textarea
            id="location"
            rows={4}
            placeholder="4th Floor, Syama Business Centre, Opposite Hindu Office, Vyttila Junction, NH Bypass, Kochi, Kerala 682019, India"
            {...register("location")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.location && (
            <p className="text-sm text-destructive">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            placeholder="Describe your gym and its amenities..."
            {...register("description")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="equipment" className="block text-sm font-medium">
            Equipment
          </label>
          <textarea
            id="equipment"
            rows={6}
            placeholder="Cardio Machines (8), Strength Machines (12), Squat Racks (2), Smith Machines (1), Adjustable Benches (6), Barbells (6), Dumbbell Pairs (20), Weight Plates (500kg), Kettlebells (12), Cable Stations (2), Resistance Bands (20), Medicine Balls (10), Yoga Mats (20), Pull-Up Stations (2), Battle Ropes (2)."
            {...register("equipment")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.equipment && (
            <p className="text-sm text-destructive">
              {errors.equipment.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="openingHours" className="block text-sm font-medium">
            Opening hours
          </label>
          <textarea
            id="openingHours"
            rows={1}
            placeholder="Mon-Fri: 6am - 10pm, Sat-Sun: 8am - 8pm"
            {...register("openingHours")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.openingHours && (
            <p className="text-sm text-destructive">
              {errors.openingHours.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contactPhone" className="block text-sm font-medium">
            Contact phone
          </label>
          <input
            id="contactPhone"
            type="tel"
            {...register("contactPhone")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.contactPhone && (
            <p className="text-sm text-destructive">
              {errors.contactPhone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="contactEmail" className="block text-sm font-medium">
            Contact email (optional)
          </label>
          <input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          {errors.contactEmail && (
            <p className="text-sm text-destructive">
              {errors.contactEmail.message}
            </p>
          )}
        </div>
      </div>

      {submissionError ? (
        <p className="text-sm text-destructive">{submissionError}</p>
      ) : statusMessage ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {statusMessage}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Link href="/partner/gym" className="flex-1">
          <Button variant="secondary" className="w-full">
            Go Back
          </Button>
        </Link>

        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Creating..." : "Create Gym"}
        </Button>
      </div>
    </form>
  )
}
