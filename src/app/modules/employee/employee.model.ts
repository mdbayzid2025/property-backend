import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: String, required: true },
    attendanceDays: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Employee = model("Employee", employeeSchema);
