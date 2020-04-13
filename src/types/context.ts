import { Request } from "express";

export interface Context {
  req: ContextRequest;
  res: ContextResponse;
}

export interface ContextRequest extends Request {
  userRoles?: string[];
  userId?: string;
}

interface ContextResponse extends Response {
  clearCookie: (name: string) => void;
  cookie: (name: string, value: any, options: any) => void;
}

export interface TokenPayload {
  user: {
    email: string;
    id: string;
  }
}