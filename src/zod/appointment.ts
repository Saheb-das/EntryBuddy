// external imports
import { z } from "zod";

export const appointmentSchema = z.object({
  purpose: z.string(),
  timeSlot: z.string(),
  eventDate: z.string(),
});
