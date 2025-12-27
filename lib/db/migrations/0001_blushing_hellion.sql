ALTER TABLE "employees" ALTER COLUMN "employment_type" SET DEFAULT 'full-time'::"public"."employment_type";--> statement-breakpoint
ALTER TABLE "employees" ALTER COLUMN "employment_type" SET DATA TYPE "public"."employment_type" USING "employment_type"::"public"."employment_type";--> statement-breakpoint
ALTER TABLE "calls" ALTER COLUMN "duration" SET DATA TYPE integer;--> statement-breakpoint
CREATE INDEX "idx_applications_status_date" ON "applications" USING btree ("status","applied_date");--> statement-breakpoint
CREATE INDEX "idx_applications_posting_status" ON "applications" USING btree ("job_posting_id","status");--> statement-breakpoint
CREATE INDEX "idx_tasks_status_due_date" ON "tasks" USING btree ("status","due_date");--> statement-breakpoint
CREATE INDEX "idx_tasks_project_status" ON "tasks" USING btree ("project_id","status");--> statement-breakpoint
CREATE INDEX "idx_tasks_assigned_status" ON "tasks" USING btree ("assigned_to_id","status");--> statement-breakpoint
CREATE INDEX "idx_daily_reports_user_date" ON "daily_reports" USING btree ("user_id","date");--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "chk_projects_progress" CHECK ("projects"."progress" >= 0 AND "projects"."progress" <= 100);--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "chk_tasks_progress" CHECK ("tasks"."progress" >= 0 AND "tasks"."progress" <= 100);--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "chk_tasks_level" CHECK ("tasks"."level" >= 0 AND "tasks"."level" <= 2);--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "chk_goals_progress" CHECK ("goals"."progress" >= 0 AND "goals"."progress" <= 100);--> statement-breakpoint
ALTER TABLE "trainings" ADD CONSTRAINT "chk_trainings_progress" CHECK ("trainings"."progress" >= 0 AND "trainings"."progress" <= 100);