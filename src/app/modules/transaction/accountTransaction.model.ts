import { Schema, model } from "mongoose";

const accountTransactionSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    account: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
);

export const AccountTransaction = model("AccountTransaction", accountTransactionSchema);
