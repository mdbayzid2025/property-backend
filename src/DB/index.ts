import colors from "colors";
import { User } from "../app/modules/user/user.model";
import { Company } from "../app/modules/company/company.model";
import { Property } from "../app/modules/property/property.model";
import { Unit } from "../app/modules/unit/unit.model";
import { Tenant } from "../app/modules/tenant/tenant.model";
import { Invoice } from "../app/modules/invoice/invoice.model";
import { Receipt } from "../app/modules/receipt/receipt.model";
import { UtilityReading } from "../app/modules/utility/utility.model";
import { MaintenanceRequest } from "../app/modules/maintenance/maintenance.model";
import { Visitor } from "../app/modules/visitor/visitor.model";
import { ParkingSpace } from "../app/modules/parking/parking.model";
import { Employee } from "../app/modules/employee/employee.model";
import { Booking } from "../app/modules/booking/booking.model";
import { Installment } from "../app/modules/installment/installment.model";
import { AccountTransaction } from "../app/modules/transaction/accountTransaction.model";
import config from "../config";
import { USER_ROLES } from "../enums/user";
import { logger } from "../shared/logger";

const superUser = {
  name: "Super Admin",
  role: USER_ROLES.SUPER_ADMIN,
  email: config.admin.email || "admin@bongo.com",
  password: config.admin.password || "admin1234",
  verified: true,
};

const seedSuperAdmin = async () => {
  // 1. Seed Super Admin
  const isExistSuperAdmin = await User.findOne({
    role: USER_ROLES.SUPER_ADMIN,
  });

  if (!isExistSuperAdmin) {
    await User.create(superUser);
    logger.info(colors.green("✔ Super admin created successfully!"));
  }

  // 2. Seed Demo Companies
  const companyCount = await Company.countDocuments();
  if (companyCount === 0) {
    logger.info(colors.yellow("Seeding demo data..."));

    // We seed companies and keep their IDs to seed children
    const c1 = await Company.create({ name: 'বঙ্গ প্রোপার্টি হোল্ডিংস লিমিটেড (Bongo Holdings)', type: 'Real Estate Developer', address: 'ধানমন্ডি, ঢাকা', plan: 'Enterprise', expiryDate: '2027-12-31', suspended: false });
    const c2 = await Company.create({ name: 'অনন্যা হাইটস কমার্শিয়াল (Anannya Plaza)', type: 'Commercial Shopping Complex', address: 'গুলশান-২, ঢাকা', plan: 'Standard', expiryDate: '2026-12-31', suspended: false });
    const c3 = await Company.create({ name: 'আমান গ্রিন ভ্যালি (Aman Land Projects)', type: 'Housing & Land Developers', address: 'পূর্বাচল, ঢাকা', plan: 'Basic', expiryDate: '2026-09-30', suspended: false });

    // 3. Seed Properties
    const p1 = await Property.create({ companyId: c1._id, name: 'বঙ্গ टाওয়ার (Dhanmondi)', type: 'mixed', address: 'রোড ৮/এ, ধানমন্ডি, ঢাকা', floors: 10, totalUnits: 15, status: 'active' });
    const p2 = await Property.create({ companyId: c2._id, name: 'অনন্যা প্লাজা (Gulshan)', type: 'commercial', address: 'গুলশান সার্কেল ২, ঢাকা', floors: 5, totalUnits: 5, status: 'active' });
    const p3 = await Property.create({ companyId: c3._id, name: 'আমান ভ্যালি ফেজ-১', type: 'land', address: 'সেক্টর ৪, পূর্বাচল, ঢাকা', floors: 0, totalUnits: 20, status: 'construction' });

    // 4. Seed Units
    const u1 = await Unit.create({ propertyId: p1._id, number: 'Flat A1', floor: 1, type: 'flat', sizeSqft: 1800, rentAmount: 32000, serviceCharge: 5000, securityDeposit: 64000, status: 'occupied', bedrooms: 3, bathrooms: 3, meterNumber: 'E-882711' });
    const u2 = await Unit.create({ propertyId: p1._id, number: 'Flat A2', floor: 1, type: 'flat', sizeSqft: 1800, rentAmount: 32000, serviceCharge: 5000, securityDeposit: 64000, status: 'vacant', bedrooms: 3, bathrooms: 3, meterNumber: 'E-882712' });
    const u3 = await Unit.create({ propertyId: p1._id, number: 'Flat B1', floor: 2, type: 'flat', sizeSqft: 1500, rentAmount: 26000, serviceCharge: 4000, securityDeposit: 52000, status: 'occupied', bedrooms: 3, bathrooms: 2, meterNumber: 'E-882721' });
    const u4 = await Unit.create({ propertyId: p1._id, number: 'Flat B2', floor: 2, type: 'flat', sizeSqft: 1500, rentAmount: 26000, serviceCharge: 4000, securityDeposit: 52000, status: 'maintenance', bedrooms: 3, bathrooms: 2, meterNumber: 'E-882722' });
    const u5 = await Unit.create({ propertyId: p1._id, number: 'Shop 101', floor: 0, type: 'shop', sizeSqft: 450, rentAmount: 45000, serviceCharge: 8000, securityDeposit: 90000, status: 'occupied', meterNumber: 'E-900101' });
    const u6 = await Unit.create({ propertyId: p1._id, number: 'Shop 102', floor: 0, type: 'shop', sizeSqft: 600, rentAmount: 60000, serviceCharge: 10000, securityDeposit: 120000, status: 'reserved', meterNumber: 'E-900102' });
    const u7 = await Unit.create({ propertyId: p2._id, number: 'Office 201', floor: 2, type: 'office', sizeSqft: 3500, rentAmount: 120000, serviceCharge: 25000, securityDeposit: 240000, status: 'occupied', meterNumber: 'E-700201' });
    const u8 = await Unit.create({ propertyId: p2._id, number: 'Office 301', floor: 3, type: 'office', sizeSqft: 3500, rentAmount: 120000, serviceCharge: 25000, securityDeposit: 240000, status: 'vacant', meterNumber: 'E-700301' });
    const u9 = await Unit.create({ propertyId: p3._id, number: 'Plot A-5', floor: 0, type: 'parking', sizeSqft: 21780, rentAmount: 0, serviceCharge: 2000, securityDeposit: 0, status: 'sold' });
    const u10 = await Unit.create({ propertyId: p3._id, number: 'Plot A-6', floor: 0, type: 'parking', sizeSqft: 21780, rentAmount: 0, serviceCharge: 2000, securityDeposit: 0, status: 'reserved' });

    // 5. Seed Tenants
    const t1 = await Tenant.create({ companyId: c1._id, name: 'কামরুল হাসান চৌধুরী', phone: '01712-345678', nid: '3829102938210', email: 'kamrul.hasan@gmail.com', occupation: 'উচ্চপদস্থ সরকারি কর্মকর্তা', unitId: u1._id, moveInDate: '2025-01-01', emergencyContact: '০১৮১২-৯৯০৯৯০ (স্ত্রী)', status: 'active' });
    const t2 = await Tenant.create({ companyId: c1._id, name: 'রনি ইলেকট্রনিক্স (মালিক: রফিকুল আলম)', phone: '01911-887766', nid: '8827162534210', email: 'rony.electronics@yahoo.com', occupation: 'ব্যবসা', unitId: u5._id, moveInDate: '2024-05-15', emergencyContact: '০১৭৫৫-৬৬৭৭৮৮ (ম্যানেজার)', status: 'active' });
    const t3 = await Tenant.create({ companyId: c2._id, name: 'সফটওয়্যার পয়েন্ট বিডি (মালিক: মইনুল ইসলাম)', phone: '01724-561670', nid: '1928374650123', email: 'info@softwarepointbd.com', occupation: 'আইটি কোম্পানি', unitId: u7._id, moveInDate: '2023-11-01', emergencyContact: '০১৮১৬-২১২১২১ (অপারেশন্স ম্যানেজার)', status: 'active' });

    // 6. Seed Invoices
    const inv1 = await Invoice.create({ companyId: c1._id, unitId: u1._id, tenantId: t1._id, invoiceType: 'rent', amount: 37000, dueDate: '2026-06-10', billingMonth: 'June 2026', status: 'paid', paidAmount: 37000, paymentDate: '2026-06-08', paymentMethod: 'bKash', details: 'ভাড়া: ৩২,০০০৳, সার্ভিস চার্জ: ৫,০০০৳' });
    const inv2 = await Invoice.create({ companyId: c1._id, unitId: u1._id, tenantId: t1._id, invoiceType: 'rent', amount: 37000, dueDate: '2026-07-10', billingMonth: 'July 2026', status: 'due', paidAmount: 0, details: 'ভাড়া: ৩২,০০০৳, সার্ভিস চার্জ: ৫,০০০৳' });
    const inv3 = await Invoice.create({ companyId: c1._id, unitId: u5._id, tenantId: t2._id, invoiceType: 'rent', amount: 53000, dueDate: '2026-06-10', billingMonth: 'June 2026', status: 'paid', paidAmount: 53000, paymentDate: '2026-06-09', paymentMethod: 'Cash', details: 'দোকান ভাড়া: ৪৫,০০০৳, সার্ভিস চার্জ: ৮,০০০৳' });
    const inv4 = await Invoice.create({ companyId: c1._id, unitId: u5._id, tenantId: t2._id, invoiceType: 'rent', amount: 53000, dueDate: '2026-07-10', billingMonth: 'July 2026', status: 'pending', paidAmount: 20000, paymentDate: '2026-07-04', paymentMethod: 'Nagad', details: 'দোকান ভাড়া: ৪৫,০০০৳, সার্ভিস চার্জ: ৮,০০০৳ (আংশিক পরিশোধ)' });
    const inv5 = await Invoice.create({ companyId: c2._id, unitId: u7._id, tenantId: t3._id, invoiceType: 'rent', amount: 145000, dueDate: '2026-07-05', billingMonth: 'July 2026', status: 'paid', paidAmount: 145000, paymentDate: '2026-07-04', paymentMethod: 'Bank Transfer', details: 'অফিস ভাড়া: ১,২০,০০০৳, সার্ভিস চার্জ: ২৫,০০০৳' });

    // 7. Seed Receipts
    await Receipt.create({ invoiceId: inv1._id, receiptNumber: 'MR-2026-0001', receivedAmount: 37000, receivedDate: '2026-06-08', receivedBy: 'ক্যাশিয়ার রফিক', paymentMethod: 'bKash', remarks: 'মোবাইল ব্যাংকিং পেমেন্ট সম্পন্ন' });
    await Receipt.create({ invoiceId: inv3._id, receiptNumber: 'MR-2026-0002', receivedAmount: 53000, receivedDate: '2026-06-09', receivedBy: 'ক্যাশিয়ার রফিক', paymentMethod: 'Cash', remarks: 'নগদ ক্যাশ গ্রহণ' });
    await Receipt.create({ invoiceId: inv5._id, receiptNumber: 'MR-2026-0003', receivedAmount: 145000, receivedDate: '2026-07-04', receivedBy: 'অ্যাকাউন্ট্যান্ট শফিক', paymentMethod: 'Bank Transfer', remarks: 'ব্যাংক জমা চেক নং ৮৮৭২১৯২' });

    // 8. Seed Utilities
    await UtilityReading.create({ unitId: u1._id, utilityType: 'electricity', billingMonth: 'June 2026', prevReading: 12450, currReading: 12790, ratePerUnit: 12, calculatedBill: 4080, status: 'billed' });
    await UtilityReading.create({ unitId: u1._id, utilityType: 'water', billingMonth: 'June 2026', prevReading: 480, currReading: 510, ratePerUnit: 40, calculatedBill: 1200, status: 'billed' });
    await UtilityReading.create({ unitId: u5._id, utilityType: 'electricity', billingMonth: 'June 2026', prevReading: 34100, currReading: 34950, ratePerUnit: 14, calculatedBill: 11900, status: 'billed' });

    // 9. Seed Maintenance Requests
    await MaintenanceRequest.create({ propertyId: p1._id, unitId: u1._id, tenantId: t1._id, title: 'বাথরুম ট্যাপ লিক', description: 'মাস্টার বেডরুমের সংযুক্ত বাথরুমে পানির কল থেকে অবিরাম পানি ঝড়ছে। দ্রুত কল পরিবর্তন প্রয়োজন।', priority: 'medium', status: 'resolved', technicianName: 'রহমান প্লাম্বার', materialCost: 450, laborCost: 300 });
    await MaintenanceRequest.create({ propertyId: p1._id, unitId: u5._id, tenantId: t2._id, title: 'পাওয়ার সার্কিট ব্রেকার ট্রিপ', description: 'দোকানের ভেতরের প্রধান এমডিবি বোর্ডের একটি ব্রেকার গরম হয়ে ট্রিপ করছে। লোড টেস্ট করা দরকার।', priority: 'high', status: 'assigned', technicianName: 'সোহেল ইলেকট্রিশিয়ান', materialCost: 1500, laborCost: 500 });
    await MaintenanceRequest.create({ propertyId: p1._id, unitId: u4._id, title: 'ফাঁকা ফ্ল্যাট রঙ ও ক্লিনিং', description: 'নতুন ভাড়াটিয়া আসার আগে বি২ ফ্ল্যাটে সিলিং ও ড্যাম্প দেয়ালে নতুন করে ডিস্টেম্পার রঙ ও ডিপ ক্লিনিং করা প্রয়োজন।', priority: 'low', status: 'pending', materialCost: 8000, laborCost: 4000 });

    // 10. Seed Visitors
    await Visitor.create({ companyId: c1._id, name: 'মোঃ হাসিবুর রহমান', phone: '01815-554433', unitId: u1._id, purpose: 'পারিবারিক সাক্ষাৎ', entryTime: '2026-07-06T15:20:00', exitTime: '2026-07-06T18:10:00', passCode: 'VST-9902' });
    await Visitor.create({ companyId: c1._id, name: 'আব্দুল্লাহ কুরিয়ার সার্ভিস', phone: '01511-223344', unitId: u3._id, purpose: 'পার্সেল ডেলিভারি', entryTime: '2026-07-06T19:10:00', passCode: 'VST-2819' });

    // 11. Seed Parking Space
    await ParkingSpace.create({ propertyId: p1._id, slotNumber: 'Parking P1-A', allocatedTo: u1._id, vehiclePlate: 'Dhaka Metro G-11-2233', rentAmount: 2500, status: 'occupied' });
    await ParkingSpace.create({ propertyId: p1._id, slotNumber: 'Parking P1-B', allocatedTo: u3._id, vehiclePlate: 'Dhaka Metro Ka-44-5566', rentAmount: 2500, status: 'occupied' });
    await ParkingSpace.create({ propertyId: p1._id, slotNumber: 'Parking P1-C', rentAmount: 2500, status: 'vacant' });

    // 12. Seed Employees
    await Employee.create({ companyId: c1._id, name: 'মোঃ রফিকুল ইসলাম', phone: '01711-229988', role: 'ম্যানেজার', department: 'অপারেশন্স', salary: 35000, joinDate: '2024-01-01', attendanceDays: 26 });
    await Employee.create({ companyId: c1._id, name: 'সোহেল রানা', phone: '01912-334455', role: 'কেয়ারটেকার ও গার্ড', department: 'নিরাপত্তা', salary: 16000, joinDate: '2025-03-10', attendanceDays: 30 });

    // 13. Seed Bookings & Installments
    const b1 = await Booking.create({ companyId: c1._id, unitId: u6._id, customerName: 'মোঃ মাহাবুবুর রহমান', customerPhone: '01755-998877', customerNid: '1998273645019', bookingAmount: 500000, totalPrice: 4500000, bookingDate: '2026-05-10', status: 'active', downPayment: 1000000, installmentsCount: 12 });
    await Installment.create({ bookingId: b1._id, installmentNo: 1, dueDate: '2026-06-15', amount: 250000, paidAmount: 250000, status: 'paid', paymentDate: '2026-06-12' });
    await Installment.create({ bookingId: b1._id, installmentNo: 2, dueDate: '2026-07-15', amount: 250000, paidAmount: 0, status: 'due' });

    // 14. Seed Transactions
    await AccountTransaction.create({ companyId: c1._id, date: '2026-06-08', type: 'income', category: 'Rent Revenue', account: 'Bkash Merchant', amount: 37000, description: 'Flat A1 জুন ২৬ ভাড়া সংগ্রহ' });
    await AccountTransaction.create({ companyId: c1._id, date: '2026-06-09', type: 'income', category: 'Rent Revenue', account: 'Cashbook', amount: 53000, description: 'Shop 101 জুন ২৬ ভাড়া সংগ্রহ' });
    await AccountTransaction.create({ companyId: c1._id, date: '2026-07-02', type: 'expense', category: 'Maintenance Cost', account: 'Cashbook', amount: 750, description: 'Flat A1 ট্যাপ মেরামত ব্যয়' });
    await AccountTransaction.create({ companyId: c1._id, date: '2026-07-05', type: 'expense', category: 'Salary Expense', account: 'Bank Account', amount: 51000, description: 'জুন ২৬ কর্মচারীদের বেতন পরিশোধ' });

    logger.info(colors.green("✔ Seeding completed successfully!"));
  }
};

export default seedSuperAdmin;
