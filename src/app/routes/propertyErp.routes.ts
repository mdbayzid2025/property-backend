import express from "express";
import { genericController } from "../helpers/genericController";
import { Company } from "../modules/company/company.model";
import { Property } from "../modules/property/property.model";
import { Unit } from "../modules/unit/unit.model";
import { Tenant } from "../modules/tenant/tenant.model";
import { Invoice } from "../modules/invoice/invoice.model";
import { Receipt } from "../modules/receipt/receipt.model";
import { UtilityReading } from "../modules/utility/utility.model";
import { MaintenanceRequest } from "../modules/maintenance/maintenance.model";
import { Visitor } from "../modules/visitor/visitor.model";
import { ParkingSpace } from "../modules/parking/parking.model";
import { Employee } from "../modules/employee/employee.model";
import { Booking } from "../modules/booking/booking.model";
import { Installment } from "../modules/installment/installment.model";
import { AccountTransaction } from "../modules/transaction/accountTransaction.model";

const router = express.Router();

// Helper to register simple CRUD routes
const registerModelRoutes = (path: string, model: any, populateFields: string[] = []) => {
  router.post(`/${path}`, genericController.create(model));
  router.get(`/${path}`, genericController.getAll(model, populateFields));
  router.get(`/${path}/:id`, genericController.getById(model, populateFields));
  router.put(`/${path}/:id`, genericController.update(model));
  router.delete(`/${path}/:id`, genericController.delete(model));
};

// Register routes with relationships populated
registerModelRoutes("companies", Company);
registerModelRoutes("properties", Property, ["companyId"]);
registerModelRoutes("units", Unit, ["propertyId"]);
registerModelRoutes("tenants", Tenant, ["companyId", "unitId"]);
registerModelRoutes("invoices", Invoice, ["companyId", "unitId", "tenantId"]);
registerModelRoutes("receipts", Receipt, ["invoiceId"]);
registerModelRoutes("utilities", UtilityReading, ["unitId"]);
registerModelRoutes("maintenance", MaintenanceRequest, ["propertyId", "unitId", "tenantId"]);
registerModelRoutes("visitors", Visitor, ["companyId", "unitId"]);
registerModelRoutes("parking", ParkingSpace, ["propertyId", "allocatedTo"]);
registerModelRoutes("employees", Employee, ["companyId"]);
registerModelRoutes("bookings", Booking, ["companyId", "unitId"]);
registerModelRoutes("installments", Installment, ["bookingId"]);
registerModelRoutes("transactions", AccountTransaction, ["companyId"]);

export const PropertyErpRoutes = router;
