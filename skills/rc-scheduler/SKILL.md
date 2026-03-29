---
name: rc-scheduler
description: Use when building a Rocket.Chat App that needs scheduled, recurring, or timed jobs — cron, daily reminders, periodic tasks.
---

# Skill: Scheduler

## Steps

1. **Read the type definitions.**
   Open these files in the scaffolded app's `node_modules/@rocket.chat/apps-engine/definition/`:
   - `scheduler/IProcessor.d.ts` — for the processor interface.
   - `accessors/ISchedulerModify.d.ts` — for runtime scheduling methods.
   - `accessors/IOnetimeSchedule.d.ts` and `IRecurringSchedule.d.ts` — for schedule descriptor shapes.
   Note: The field that links a schedule to its processor is `id`, NOT `processorId` or `jobId`.

2. **Create the processor class.**
   Implement `IProcessor` with a unique `id` string and a `processor()` method:
   ```ts
   export class MyProcessor implements IProcessor {
       id = 'my-unique-processor-id';
       async processor(jobContext: Record<string, any>, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
           // Job logic here
       }
   }
   ```
   - The `jobContext` is a plain free-form object — it only contains what you put in the `data` field when scheduling. Do not expect structured fields like `jobContext.room` unless you explicitly set them.

3. **Register the processor at startup.**
   In the main App class, inside `extendConfiguration()`:
   ```ts
   configuration.scheduler.registerProcessors([new MyProcessor()]);
   ```
   GATE: Is the processor registered in `extendConfiguration`? Not in the constructor, not in `onEnable`. Unregistered processor IDs fail silently — the job just never runs.
   GATE: The configuration-phase scheduler accessor is a direct property on `configuration`, not a getter method. Read `IConfigurationModify.d.ts` to confirm the access pattern.

4. **Schedule the job at runtime.**
   Use `modify.getScheduler()` to trigger jobs (e.g., from a slash command, event handler, or `onEnable`):
   - **One-time:**
     ```ts
     await modify.getScheduler().scheduleOnce({ id: 'my-unique-processor-id', when: new Date(Date.now() + 60000), data: { roomId: room.id } });
     ```
   - **Recurring:**
     ```ts
     await modify.getScheduler().scheduleRecurring({ id: 'my-unique-processor-id', interval: '0 9 * * *' });
     ```
   GATE: Does the `id` in the schedule descriptor exactly match the processor's `id`? A typo means the job silently never runs.

5. **Handle recurring job behavior.**
   - Recurring jobs fire immediately on first registration by default. Set `skipImmediate: true` if you want to wait for the first interval.
   - Scheduling a recurring job with the same processor ID replaces the previous schedule — they do not stack.

6. **Prevent re-scheduling loops.**
   If the processor calls `scheduleOnce` on itself:
   GATE: Is there a termination condition? Without one, the job runs forever.

7. **Verify.**
   - Grep for `console.log` → replace with `this.getLogger()`.
   - Confirm processor ID string matches between registration and scheduling.
   - Confirm processor is registered in `extendConfiguration`, not elsewhere.
