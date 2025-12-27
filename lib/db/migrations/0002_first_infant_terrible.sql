CREATE TABLE "office_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"address" text,
	"city" text,
	"state" text,
	"country" text DEFAULT 'India',
	"phone" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updated_by" uuid,
	CONSTRAINT "office_units_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE INDEX "idx_office_units_code" ON "office_units" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_office_units_city" ON "office_units" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_office_units_active" ON "office_units" USING btree ("is_active");