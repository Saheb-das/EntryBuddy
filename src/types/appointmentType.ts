// external imports
import { z } from "zod";

// internal import
import { appointmentSchema } from "../zod/appointment";

export type TAppointmentInput = z.infer<typeof appointmentSchema>;
