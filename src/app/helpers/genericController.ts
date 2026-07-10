import { Request, Response } from "express";
import { Model } from "mongoose";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";

export const genericController = {
  create: (model: Model<any>) =>
    catchAsync(async (req: Request, res: Response) => {
      const result = await model.create(req.body);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `${model.modelName} created successfully`,
        data: result,
      });
    }),

  getAll: (model: Model<any>, populateFields: string[] = []) =>
    catchAsync(async (req: Request, res: Response) => {
      const queryObj = { ...req.query };
      const excludeFields = ['page', 'limit', 'sort', 'fields'];
      excludeFields.forEach((el) => delete queryObj[el]);

      // Handle simple matching filter (e.g. companyId, unitId etc.)
      let query = model.find(queryObj);

      if (populateFields.length > 0) {
        populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const result = await query;
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `${model.modelName}s retrieved successfully`,
        data: result,
      });
    }),

  getById: (model: Model<any>, populateFields: string[] = []) =>
    catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      let query = model.findById(id);

      if (populateFields.length > 0) {
        populateFields.forEach((field) => {
          query = query.populate(field);
        });
      }

      const result = await query;
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `${model.modelName} retrieved successfully`,
        data: result,
      });
    }),

  update: (model: Model<any>) =>
    catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await model.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `${model.modelName} updated successfully`,
        data: result,
      });
    }),

  delete: (model: Model<any>) =>
    catchAsync(async (req: Request, res: Response) => {
      const { id } = req.params;
      await model.findByIdAndDelete(id);
      sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `${model.modelName} deleted successfully`,
        data: null,
      });
    }),
};
