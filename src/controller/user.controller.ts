import {  Request, Response } from "express";
import UserService from "../service/user.service";
import { User as UserInterface } from "../interface/user.interface";
import { OrderBy, UserStatus } from "../const/common.enums";

const userService = new UserService();
export class UserController {


    static async getAll(req: Request, res: Response) {
      const { page = 1, limit = 10, search = '', status, orderBy } = req.query;
      try {
        const users = await userService.getAllUser(
          Number(page),
          Number(limit),
          search as string,
          status as UserStatus,
          orderBy as OrderBy
        );

        res.status(200).json({ message: 'all user retrived successfully', data: users});
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
    
    static async updateUser(req: Request, res: Response) {
      const { id } = req.params;
      const userData = req.body;
  
      try {
        const user = await userService.updateUser(Number(id), userData);
        res.status(200).json({ message: 'user details updated succefully' , data: user});
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }

    static async getOneUser(req: Request, res: Response) {
      const { id } = req.params;
      try {
        const user = await userService.getOneUser(Number(id));
        res.status(200).json({ message:'user details retrived' , data:user});
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }

    static createUser = async (req: Request, res: Response) => {
      try {
        const userData:UserInterface = req.body;
        const createUserData = await userService.createUser(userData);
        res.status(201).json({ data: createUserData, message: 'user Created Successfully' });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    };

    static async updateUserStatus(req: Request, res: Response) {
      const { id } = req.params;
      const status: UserStatus = req.body.status
      try {
        const user = await userService.updateUserStatus(Number(id), status);
        res.status(200).json({ message:'user status update successfully', data:user});
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }

    static deleteUser = async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
          const deleteUser: boolean = await userService.deleteUser(Number(id));
          res.status(201).json({ data: deleteUser, message: 'user deleted Successfully' });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    };
}
