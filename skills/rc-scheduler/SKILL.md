---
name: rc-scheduler
description: Use when building a Rocket.Chat App that needs scheduled, recurring, or timed jobs — cron, daily reminders, periodic tasks.
---

# Skill: Scheduler

## RC-specific corrections

- **Scheduling is two-phase, not one.** Gemini tries to schedule a job inline. RC requires you to register a processor at startup in `extendConfiguration`, THEN trigger it at runtime via `modify.getScheduler()`. Skipping registration means the schedule call is silently ignored.

- **Unregistered processor IDs fail silently.** Gemini typos or forgets to register the processor. RC doesn't throw — the job just never runs.

- **Recurring jobs fire immediately by default.** Gemini sets an interval expecting it to wait. RC runs the processor immediately on first registration unless you explicitly set skip-immediate to true.

- **Same-ID recurring schedule replaces the previous one.** Gemini schedules multiple recurring jobs with the same processor ID expecting them to stack. Each new schedule replaces the last.

- **Disabled apps skip jobs silently.** Gemini adds error handling for "job failed while app disabled." RC just skips the job with no error or callback.

- **The job context is whatever you passed in.** Gemini tries to access structured fields like `jobContext.room`. The context is a plain free-form object — it only contains what you put in the `data` field when scheduling.

- **Don't create re-scheduling loops.** Gemini writes a processor that calls `scheduleOnce` on itself. Without a termination condition, this runs forever.

- **The schedule descriptor field is `id`, not `processorId`.** Gemini invents descriptive names like `processorId` or `jobId`. The actual field that links a schedule to its processor is just `id`. Read `IOnetimeSchedule.d.ts` and `IRecurringSchedule.d.ts` to confirm.

- **Startup-phase and runtime accessors use different patterns.** Gemini uses `configurationModify.getScheduler()` by analogy with `modify.getScheduler()`. The configuration-phase accessor is a direct property, not a getter method. Read `IConfigurationModify.d.ts` to get the correct access pattern.
