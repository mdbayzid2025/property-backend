import { Schema, model } from "mongoose";

const receiptSchema = new Schema(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true },
    receiptNumber: { type: String, required: true },
    receivedAmount: { type: Number, required: true },
    receivedDate: { type: String, required: true },
    receivedBy: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    remarks: { type: String }
  },
  { timestamps: true }
);

export const Receipt = model("Receipt", receiptSchema);
