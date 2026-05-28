CREATE TYPE "public"."form_protection_mode" AS ENUM('none', 'code', 'invite_only');--> statement-breakpoint
CREATE TYPE "public"."form_visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TYPE "public"."field_type" AS ENUM('TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER', 'YES_NO', 'SELECT', 'MULTI_SELECT', 'RATING', 'DATE', 'PASSWORD');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(80) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"salt" text,
	"password" text,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255),
	"description" text,
	"created_by" uuid NOT NULL,
	"slug" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"visibility" "form_visibility" DEFAULT 'unlisted' NOT NULL,
	"settings" jsonb DEFAULT '{"protectionMode":"none","accessCode":null,"allowedDomains":[],"responseLimit":null,"allowMultipleSubmissions":false,"expiresAt":null,"opensAt":null,"isShuffled":false,"showProgressBar":true,"confirmationMessage":"Thanks for your response!","redirectUrl":null,"notifyCreatorOnSubmit":true,"sendConfirmationToRespondent":false,"accentColor":"#6366f1","darkMode":false,"isTemplate":false,"category":"other","estimatedCompletionTime":null}'::jsonb,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(255) NOT NULL,
	"label_key" varchar(255) NOT NULL,
	"description" text,
	"placeholder" text,
	"is_required" boolean DEFAULT false NOT NULL,
	"index" numeric NOT NULL,
	"form_id" uuid NOT NULL,
	"type" "field_type" NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "form_fields_form_id_index_unique" UNIQUE("form_id","index")
);
--> statement-breakpoint
CREATE TABLE "form_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"values" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;