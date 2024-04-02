import { Request } from "express";
import { users } from "@prisma/client"
export interface RequestToken extends Request {
    tokenData: users
}