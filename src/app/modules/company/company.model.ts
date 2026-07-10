import { Schema, model } from "mongoose";

const companySchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    address: { type: String, required: true },
    plan: { type: String, enum: ['Basic', 'Standard', 'Enterprise'], default: 'Basic' },
    expiryDate: { type: String, required: true },
    suspended: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Company = model("Company", companySchema);
