import { Response, Request, NextFunction } from "express";
import { ZodSchema } from "zod";

import logger from "../config/logger.config";

export const validateCreateSubmissionDto =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (schema: ZodSchema<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({ ...req.body });
        next();
      } catch (error) {
        logger.error(error);
        return res.json({
          success: false,
          msg: "Invalid data received",
          data: {},
          error: error,
        });
      }
    };
