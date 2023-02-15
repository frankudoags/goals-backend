import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import User from "../db/models/userModel";
import { Unauthorized } from "../utils/errors";
import { JwtPayload, Secret, verify } from "jsonwebtoken";

const protectRoute = asyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    let token: string = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        //extract token from header and verify it
        token = req.headers.authorization.split(" ")[1];
        const decoded = verify(
          token,
          process.env.JWT_SECRET as Secret
        ) as JwtPayload;

        req.user = await User.findById(decoded.id);
        next();
      } catch (error) {
        res.status(401);
        throw new Unauthorized("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(401);
      throw new Unauthorized("Not authorized, no token");
    }
  }
);

export default protectRoute;
