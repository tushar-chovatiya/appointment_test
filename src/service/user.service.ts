import { OrderBy, UserStatus } from '../const/common.enums';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';
import { User as UserInterface } from '../interface/user.interface';
import * as bcrypt from 'bcrypt'


export default class UserService {
  private userRepository = AppDataSource.getRepository(User);

  
  async getAllUser(page: number, limit: number, search: string, status: UserStatus, orderBy: OrderBy) {
    try {
      const query = this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.createdDate', orderBy)
      .skip((page - 1) * limit)
      .take(limit);
  

      if (search) {
        query.andWhere('user.fullName LIKE :search OR user.email LIKE :search', { search: `%${search}%` });
      }

      if (status) {
        query.andWhere('user.status = :status', { status });
      }

      const userData = await query.getMany();

      const totalCount = await this.userRepository.count();
      const totalPage = Math.ceil(totalCount / limit);

      if (page > totalPage) {
        page = 1;
      }

      return { totalPage, totalCount, currentPage: page, data: userData };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }


  async createUser(userData:UserInterface) {
    if ( await this.isEmailExsist(userData.email)){
      throw new Error('Email alredy exsist');
    }
    const user = new User();
    user.fullName = userData.fullName;
    user.email = userData.email;
    user.status = userData.status;
    user.password = await bcrypt.hash(userData.password, 10);

    return await this.userRepository.save(user);
  }

   async updateUser(id: number, userData: UserInterface) {
     const user = await this.getOneUser(id);
     
    if (user) {
      user.fullName= userData.fullName
      user.email = userData.email
      user.status = userData.status

      return await this.userRepository.save(user);
    } else {
      throw new Error('User not found');
    }
  }

  async isEmailExsist(email:string){
    return await this.userRepository.findOneBy({ email });
  }

  async updateUserStatus(id: number, status: UserStatus) {
    const user = await this.getOneUser(id);
    if (user) {
      user.status = status;
      return await this.userRepository.save(user);
    } else {
      throw new Error('User not found');
    }
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      await this.userRepository.remove(user);
      return true;
    } else {
      throw new Error('User not found');
    }
  }
  
  async getOneUser(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (user) {
      return user;
    } else {
      throw new Error('User not found');
    }
  }
}
