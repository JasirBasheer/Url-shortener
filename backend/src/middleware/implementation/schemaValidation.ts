import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationException } from '../../exceptions';

export const validateSchema = (schema: Joi.ObjectSchema, target: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = target === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      throw new ValidationException(
        `Validation failed: ${errorMessages.join(', ')}`,
        'VALIDATION_ERROR'
      );
    }

    if (target === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }
    next();
  };
};
