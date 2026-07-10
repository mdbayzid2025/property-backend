import { Schema, model } from "mongoose";

const tenantSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    nid: { type: String, required: true },
    email: { type: String },
    occupation: { type: String, required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    moveInDate: { type: String, required: true },
    moveOutDate: { type: String },
    emergencyContact: { type: String, required: true },
    status: { type: String, enum: ['active', 'blacklisted', 'moved_out'], default: 'active' }
  },
  { timestamps: true }
);

export const Tenant = model("Tenant", tenantSchema);
