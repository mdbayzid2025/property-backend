import { Schema, model } from "mongoose";

const visitorSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    nid: { type: String },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    purpose: { type: String, required: true },
    entryTime: { type: String, required: true },
    exitTime: { type: String },
    passCode: { type: String, required: true }
  },
  { timestamps: true }
);

export const Visitor = model("Visitor", visitorSchema);
