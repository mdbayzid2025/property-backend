import { Schema, model } from "mongoose";

const unitSchema = new Schema(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    number: { type: String, required: true },
    floor: { type: Number, required: true },
    type: { type: String, enum: ['flat', 'shop', 'office', 'parking'], required: true },
    sizeSqft: { type: Number, required: true },
    rentAmount: { type: Number, required: true },
    serviceCharge: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    status: { type: String, enum: ['vacant', 'occupied', 'reserved', 'sold', 'maintenance'], default: 'vacant' },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    meterNumber: { type: String }
  },
  { timestamps: true }
);

export const Unit = model("Unit", unitSchema);
