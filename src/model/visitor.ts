// external import
import mongoose, { Schema, model, InferSchemaType } from "mongoose";

// visitor schema
const visitorSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },

  occupation: {
    type: String,
    required: true,
  },
  selfie: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

// generate type from schema
export type VisitorType = InferSchemaType<typeof visitorSchema>;

// type without timestamp
export type TVisitor = Omit<VisitorType, "createdAt" | "updatedAt">;

// create visitor model
const Visitor =
  mongoose.models.Visitor || model<VisitorType>("Visitor", visitorSchema);

// export
export default Visitor;
