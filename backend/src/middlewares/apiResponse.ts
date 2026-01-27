import { Response } from "express";
import '../types/api';
import { ApiError, ApiResponse, ApiResponseWithData } from "../types/api";

export const sendSuccess = (
    res: Response,
    message: string,
    status: number = 200,
): void => {
    res.status(status).json({
        success: true,
        message: message
    } as ApiResponse)
}

export const sendSuccessWithData = <T>(
    res: Response,
    message: string,
    status: number = 200,
    data: T 
): void => {
    res.status(status).json({
        message: message,
        success: true,
        data: data
    } as ApiResponseWithData<T>)
}

export const sendError = (
  res: Response,
  error: string,
  status = 500
): void => {
  res.status(status).json({
    success: false,
    error: error
  } as ApiError);
};