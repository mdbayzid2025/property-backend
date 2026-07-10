import { Schema, model } from "mongoose";

const maintenanceRequestSchema = new Schema(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    unitId: { type: Schema.Types.ObjectId, ref: "Unit", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'assigned', 'in_progress', 'resolved'], default: 'pending' },
    technicianName: { type: String },
    materialCost: { type: Number, default: 0 },
    laborCost: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const MaintenanceRequest = model("MaintenanceRequest", maintenanceRequestSchema);
