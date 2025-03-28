import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';  // Import schema

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // ✅ Create User
  async create(user: any): Promise<UserDocument> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  // ✅ Get All Users
  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  // ✅ Get User by ID
  async findOne(id: string): Promise<UserDocument | null> {
    return await this.userModel.findById(id).exec();
  }

  // ✅ Update User
  async update(id: string, user: any): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
  }

  // ✅ Delete User
  async delete(id: string): Promise<UserDocument | null> {
    return await this.userModel.findByIdAndDelete(id).exec();
  }
}
