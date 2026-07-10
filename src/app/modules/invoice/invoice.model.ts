import { Schema, model } from "mongoose";

const invoiceSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    invoiceType: { type: String, enum: ['rent', 'utility', 'maintenance', 'booking', 'installment'], required: true },
    amount: { type: Number, required: true },
    dueDate: { type: String, required: true },
    billingMonth: { type: String, required: true },
    status: { type: String, enum: ['paid', 'pending', 'due', 'partial'], default: 'due' },
    paidAmount: { type: Number, default: 0 },
    paymentDate: { type: String },
    paymentMethod: { type: String },
    details: { type: String }
  },
  { timestamps: true }
);

export const Invoice = model("Invoice", invoiceSchema);
