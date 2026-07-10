import { Schema, model } from "mongoose";

const installmentSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    installmentNo: { type: Number, required: true },
    dueDate: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['paid', 'due', 'pending'], default: 'pending' },
    paymentDate: { type: String }
  },
  { timestamps: true }
);

export const Installment = model("Installment", installmentSchema);
