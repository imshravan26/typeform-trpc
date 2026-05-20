CREATE TYPE "public"."field_type_enum" AS ENUM('TEXT', 'EMAIL', 'NUMBER', 'YES_NO', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(255) NOT NULL,
	"label_key" varchar(255) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false,
	"index" numeric NOT NULL,
	"type" "field_type_enum" NOT NULL,
	"form_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "form_fields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;