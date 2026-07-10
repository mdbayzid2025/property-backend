import { Schema, model } from "mongoose";

const parkingSpaceSchema = new Schema(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    slotNumber: { type: String, required: true },
    allocatedTo: { type: Schema.Types.ObjectId, ref: "Unit" },
    vehiclePlate: { type: String },
    rentAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' }
  },
  { timestamps: true }
);

export const ParkingSpace = model("ParkingSpace", parkingSpaceSchema);
