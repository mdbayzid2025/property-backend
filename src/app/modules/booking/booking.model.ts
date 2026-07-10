import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerNid: { type: String, required: true },
    bookingAmount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingDate: { type: String, required: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    downPayment: { type: Number, default: 0 },
    installmentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Booking = model("Booking", bookingSchema);
