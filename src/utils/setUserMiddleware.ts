import { Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

// Internal Dependencies
import { TokenPayload, ContextRequest } from "../types/context";

export async function setUserMiddleware(req: ContextRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET || '') as TokenPayload;

      req.userId = decoded.user.id;
    } else {
      delete req.userId;
    }

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
}