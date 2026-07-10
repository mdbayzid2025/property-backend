import { Schema, model } from "mongoose";

const propertySchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['residential', 'commercial', 'shopping', 'office', 'land', 'mixed'], required: true },
    address: { type: String, required: true },
    floors: { type: Number, default: 0 },
    totalUnits: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'construction'], default: 'active' }
  },
  { timestamps: true }
);

export const Property = model("Property", propertySchema);
