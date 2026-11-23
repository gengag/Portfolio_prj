import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  meta?: any
) => {
  const response: ApiResponseData<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta })
  };
  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode = 200, meta?: any) => {
  return sendResponse<T>(res, statusCode, true, message, data, meta);
};

export const sendError = (res: Response, message: string, statusCode = 400, errors?: any) => {
  const response: ApiResponseData = {
    success: false,
    message,
    ...(errors && { errors })
  };
  return res.status(statusCode).json(response);
};
