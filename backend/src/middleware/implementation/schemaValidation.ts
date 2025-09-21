import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";
import { CustomError, ValidationError } from "../../utils";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);     

      if (!result.success) {
        const firstError = result.error.issues[0];
        const path = firstError.path.join(".");
        return next(new ValidationError(`${path} : ${firstError.message}`));
      }
      req.body = result.data;

      next();
    } catch (error) {
      next(error);
    }
  };
};
