import { PipelineStage } from "mongoose";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { Car } from "../car/car.model";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from "../transaction/transaction.interface";
import { User } from "../user/user.model";
import { STATUS, USER_ROLES } from "../../../enums/user";
import { Types } from "mongoose";
import ApiError from "../../../errors/ApiErrors";
import { Transaction } from "../transaction/transaction.model";

// transaction success and booking status completed
const getDashboardStats = async () => {
  try {
    const transactionAgg = await Transaction.aggregate([
      {
        $match: {
          status: TRANSACTION_STATUS.SUCCESS,
          type: { $in: [TRANSACTION_TYPE.BOOKING, TRANSACTION_TYPE.EXTEND] },
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "bookingId",
          foreignField: "_id",
          as: "booking",
        },
      },
      { $unwind: "$booking" },
      {
        $match: {
          "booking.bookingStatus": BOOKING_STATUS.COMPLETED,
        },
      },
      {
        $addFields: {
          revenue: {
            $add: [
              { $ifNull: ["$charges.platformFee", 0] },
              { $ifNull: ["$charges.adminCommission", 0] },
            ],
          },
        },
      },
    ]);

    const totalRevenue = transactionAgg.reduce(
      (acc, t) => acc + (t.revenue || 0),
      0,
    );

    // const totalBookings = transactionAgg.length;
    const totalBookings = transactionAgg.filter(
      (t) => t.type === TRANSACTION_TYPE.BOOKING,
    ).length;

    const activeVehicles = await Car.countDocuments({ isActive: true });

    const totalCustomers = [
      ...new Set(transactionAgg.map((t) => t.userId.toString())),
    ].length;

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalBookings,
      activeVehicles,
      totalCustomers,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
  }
};

const getYearlyRevenueChart = async (year?: number) => {
  const currentYear = year || new Date().getUTCFullYear();
  const start = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${currentYear}-12-31T23:59:59.999Z`);

  const chartData = await Transaction.aggregate([
    {
      $match: {
        status: TRANSACTION_STATUS.SUCCESS,
        type: { $in: [TRANSACTION_TYPE.BOOKING, TRANSACTION_TYPE.EXTEND] },
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: {
        "booking.bookingStatus": BOOKING_STATUS.COMPLETED,
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalRevenue: {
          $sum: {
            $add: [
              { $ifNull: ["$charges.platformFee", 0] },
              { $ifNull: ["$charges.adminCommission", 0] },
            ],
          },
        },
        platformFee: {
          $sum: { $ifNull: ["$charges.platformFee", 0] },
        },
        adminCommission: {
          $sum: { $ifNull: ["$charges.adminCommission", 0] },
        },
        hostEarnings: {
          $sum: { $ifNull: ["$charges.hostCommission", 0] },
        },
        grossRevenue: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        month: "$_id",
        totalRevenue: 1,
        platformFee: 1,
        adminCommission: 1,
        hostEarnings: 1,
        grossRevenue: 1,
        _id: 0,
      },
    },
    { $sort: { month: 1 } },
  ]);

  // const result = Array.from({ length: 12 }, (_, i) => {
  //   const monthData = chartData.find((d) => d.month === i + 1);
  //   return {
  //     month: i + 1,
  //     totalRevenue: monthData?.totalRevenue || 0,
  //     platformFee: monthData?.platformFee || 0,
  //     adminCommission: monthData?.adminCommission || 0,
  //     hostEarnings: monthData?.hostEarnings || 0,
  //     grossRevenue: monthData?.grossRevenue || 0,
  //   };
  // });
  const formatMoney = (value: number | undefined) =>
    Number((value ?? 0).toFixed(2));

  const result = Array.from({ length: 12 }, (_, i) => {
    const monthData = chartData.find((d) => d.month === i + 1);

    return {
      month: i + 1,
      totalRevenue: formatMoney(monthData?.totalRevenue),
      platformFee: formatMoney(monthData?.platformFee),
      adminCommission: formatMoney(monthData?.adminCommission),
      hostEarnings: formatMoney(monthData?.hostEarnings),
      grossRevenue: formatMoney(monthData?.grossRevenue),
    };
  });

  return { year: currentYear, data: result };
};

const getYearlyBookingAndUserChart = async (year?: number) => {
  const targetYear = year || new Date().getUTCFullYear();
  const start = new Date(`${targetYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${targetYear}-12-31T23:59:59.999Z`);

  const bookingPipeline: PipelineStage[] = [
    {
      $match: {
        status: TRANSACTION_STATUS.SUCCESS,
        type: { $in: [TRANSACTION_TYPE.BOOKING] }, // , TRANSACTION_TYPE.EXTEND
        createdAt: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: {
        "booking.bookingStatus": BOOKING_STATUS.COMPLETED, // only completed bookings count
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalBookings: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 as const } },
  ];

  const userPipeline: PipelineStage[] = [
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        role: { $in: [USER_ROLES.USER] }, // e.g. ["USER", "ADMIN"]
        // verification check
        verified: true,
        // account status
        status: STATUS.ACTIVE,
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 as const } },
  ];

  const [bookingResult, userResult] = await Promise.all([
    Transaction.aggregate(bookingPipeline),
    User.aggregate(userPipeline),
  ]);

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const monthIndex = i + 1;
    const bookingMonth = bookingResult.find((r) => r._id === monthIndex);
    const userMonth = userResult.find((r) => r._id === monthIndex);

    return {
      month: monthIndex,
      bookings: bookingMonth ? bookingMonth.totalBookings : 0,
      users: userMonth ? userMonth.totalUsers : 0,
    };
  });

  return {
    year: targetYear,
    data: chartData,
  };
};

const getUserStats = async () => {
  // Total Users
  const totalUsers = await User.countDocuments({
    role: USER_ROLES.USER,
    status: STATUS.ACTIVE,
    verified: true,
  });

  // Total Hosts
  const totalHosts = await User.countDocuments({
    role: USER_ROLES.HOST,
    status: STATUS.ACTIVE,
    verified: true,
  });

  // Total Customers (unique users with at least 1 successful COMPLETED BOOKING or EXTEND)
  const customersAgg = await Transaction.aggregate([
    {
      $match: {
        status: TRANSACTION_STATUS.SUCCESS,
        type: { $in: [TRANSACTION_TYPE.BOOKING, TRANSACTION_TYPE.EXTEND] },
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: {
        "booking.bookingStatus": BOOKING_STATUS.COMPLETED, // only completed bookings count
      },
    },
    {
      $group: {
        _id: "$userId",
      },
    },
    { $count: "totalCustomers" },
  ]);

  const totalCustomers = customersAgg[0]?.totalCustomers || 0;

  return {
    totalUsers,
    totalHosts,
    totalCustomers,
  };
};

const getBookingSummary = async () => {
  const bookingAgg = await Booking.aggregate([
    {
      $lookup: {
        from: "transactions",
        localField: "transactionId",
        foreignField: "_id",
        as: "transaction",
      },
    },
    { $unwind: { path: "$transaction", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        ongoingBookings: {
          $sum: {
            $cond: [{ $eq: ["$bookingStatus", BOOKING_STATUS.ONGOING] }, 1, 0],
          },
        },
        cancelledBookings: {
          $sum: {
            $cond: [
              { $eq: ["$bookingStatus", BOOKING_STATUS.CANCELLED] },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  // totalBookings = BOOKING + EXTEND — only completed bookings count
  const transactionAgg = await Transaction.aggregate([
    {
      $match: {
        status: TRANSACTION_STATUS.SUCCESS,
        type: { $in: [TRANSACTION_TYPE.BOOKING] }, // , TRANSACTION_TYPE.EXTEND
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: {
        "booking.bookingStatus": BOOKING_STATUS.COMPLETED, // only completed bookings count
      },
    },
    {
      $count: "totalBookings",
    },
  ]);

  const stats = bookingAgg[0] || {
    ongoingBookings: 0,
    cancelledBookings: 0,
  };

  return {
    totalBookings: transactionAgg[0]?.totalBookings || 0,
    ongoingBookings: stats.ongoingBookings,
    cancelledBookings: stats.cancelledBookings,
  };
};

const getHostDashboardStats = async (hostId: string) => {
  if (!hostId || !Types.ObjectId.isValid(hostId)) {
    throw new ApiError(400, "Invalid hostId");
  }

  const objectHostId = new Types.ObjectId(hostId);

  // ------------------ TOTAL EARNING ------------------
  const earningResult = await Transaction.aggregate([
    {
      $match: {
        type: { $in: [TRANSACTION_TYPE.BOOKING, TRANSACTION_TYPE.EXTEND] }, // BOOKING + EXTEND
        status: TRANSACTION_STATUS.SUCCESS,
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: {
        "booking.hostId": objectHostId,
        "booking.bookingStatus": BOOKING_STATUS.COMPLETED,
      },
    },
    {
      $group: {
        _id: null,
        totalEarning: { $sum: "$charges.hostCommission" },
      },
    },
  ]);

  const totalEarning = earningResult[0]?.totalEarning ?? 0;

  // ------------------ TOTAL TRIPS ------------------
  const totalTrips = await Booking.countDocuments({
    hostId: objectHostId,
    bookingStatus: BOOKING_STATUS.COMPLETED,
  });

  // ------------------ YOUR VEHICLES ------------------
  const totalVehicles = await Car.countDocuments({
    assignedHosts: hostId,
    isActive: true,
  });

  // ------------------ PENDING REQUEST ------------------
  const pendingRequests = await Booking.countDocuments({
    hostId: objectHostId,
    bookingStatus: BOOKING_STATUS.PENDING,
  });

  return {
    totalEarning,
    totalTrips,
    totalVehicles,
    pendingRequests,
  };
};

const getHostMonthlyEarnings = async (hostId: string, year?: number) => {
  if (!hostId || !Types.ObjectId.isValid(hostId)) {
    throw new ApiError(400, "Invalid hostId");
  }

  const objectHostId = new Types.ObjectId(hostId);
  const selectedYear = year || new Date().getFullYear();

  const startDate = new Date(`${selectedYear}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${selectedYear + 1}-01-01T00:00:00.000Z`);

  const result = await Transaction.aggregate([
    {
      $match: {
        type: { $in: [TRANSACTION_TYPE.BOOKING, TRANSACTION_TYPE.EXTEND] }, // BOOKING + EXTEND
        status: TRANSACTION_STATUS.SUCCESS,
        createdAt: { $gte: startDate, $lt: endDate },
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "bookingId",
        foreignField: "_id",
        as: "booking",
      },
    },
    { $unwind: "$booking" },
    {
      $match: {
        "booking.hostId": objectHostId,
        "booking.bookingStatus": BOOKING_STATUS.COMPLETED, // only completed bookings count
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$charges.hostCommission" },
      },
    },
    {
      $project: {
        month: "$_id",
        total: 1,
        _id: 0,
      },
    },
  ]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = months.map((name, index) => {
    const found = result.find((r) => r.month === index + 1);
    return {
      month: name,
      total: found ? found.total : 0,
    };
  });

  return monthlyData;
};

export const AnalyticsServices = {
  getDashboardStats,
  getYearlyRevenueChart,
  getYearlyBookingAndUserChart,
  getUserStats,
  getBookingSummary,
  getHostDashboardStats,
  getHostMonthlyEarnings,
};
