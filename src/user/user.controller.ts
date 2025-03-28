import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';  

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: User) {
    return await this.userService.create(user);
  }

  
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(id);
  }


  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User) {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }
}

