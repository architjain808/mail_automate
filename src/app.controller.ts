import { Body, Controller, Get, Post } from '@nestjs/common';
import { AddUserDto } from './DTO/addUser.dto';
import { ApiBody } from '@nestjs/swagger';
import { UserManageService } from './services/usermanage.service';

@Controller()
export class AppController {
  constructor(private userService: UserManageService) {}

  @Get()
  hello() {
    return 'HELLO';
  }

  @Post('addUser')
  @ApiBody({ type: AddUserDto })
  addNewUser(@Body() body: AddUserDto) {
    return this.userService.addUser(body);
  }
  @Get('ping')
  getPing() {
    return { message: 'pong' };
  }
}
