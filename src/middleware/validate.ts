import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ObjectSchema } from 'joi';

export const validate = (schema: ObjectSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        error: error.details?.[0]?.message || 'Validation error'
      });
      return;
    }
    next();
  };
};
