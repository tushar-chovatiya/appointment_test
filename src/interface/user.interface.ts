import { UserStatus } from "../const/common.enums";

export interface User {
    id?: string;
    fullName:string;
    email: string;
    password: string;
    status:UserStatus;
    createdDate?:Date;
  }
  