import { Schema, model } from "mongoose";

const utilityReadingSchema = new Schema(
  {
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    utilityType: { type: String, enum: ['electricity', 'gas', 'water'], required: true },
    billingMonth: { type: String, required: true },
    prevReading: { type: Number, required: true },
    currReading: { type: Number, required: true },
    ratePerUnit: { type: Number, required: true },
    calculatedBill: { type: Number, required: true },
    status: { type: String, enum: ['billed', 'pending'], default: 'pending' }
  },
  { timestamps: true }
);

export const UtilityReading = model("UtilityReading", utilityReadingSchema);
