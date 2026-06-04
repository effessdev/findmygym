CREATE TABLE "gym" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"fee_per_month" double precision NOT NULL,
	"location" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"description" text NOT NULL,
	"equipment" text NOT NULL,
	"opening_hours" text NOT NULL,
	"contact_email" text,
	"contact_phone" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"is_approved" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gym" ADD CONSTRAINT "gym_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;