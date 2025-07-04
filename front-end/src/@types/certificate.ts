import type { User } from "./user";

export interface Certificate {
    "id": string,
    "valid_from": Date,
    "valid_to": Date,
    "owner": User
}