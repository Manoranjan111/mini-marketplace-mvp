import { z } from "zod";
import { Request, Response, NextFunction } from "express";
function VerifySchema(schema: z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedBody = JSON.parse(JSON.stringify(req.body));
      schema.safeParse(parsedBody);
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.message });
      } else {
        res.status(500).json({
          message: "Internal Server Error from Form schema validator",
        });
      }
    }
  };
}

export default VerifySchema;
