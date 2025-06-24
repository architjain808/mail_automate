import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import { AddUserDto } from 'src/DTO/addUser.dto';
import { Users } from 'src/interface/users';
import { AesService } from './enc-dec.service';

@Injectable()
export class UserManageService {
  constructor(private readonly aesService: AesService) {}

  addUser(userdata: AddUserDto) {
    const rawData = JSON.parse(
      fs.readFileSync('./src/Data/users.json', 'utf-8'),
    );

    const isAvailabe = rawData.find(
      (user: Users) => user.useremail == userdata.user_email,
    );
    if (isAvailabe) {
      throw new UnauthorizedException('User Already Exists');
    }
    rawData.push({
      useremail: userdata?.user_email,
      appPassword: this.aesService.encrypt(userdata?.user_app_password),
      subject: userdata?.user_email,
      text: userdata?.user_email,
      mailIndex: 0,
    });
    fs.writeFileSync('./src/Data/users.json', JSON.stringify(rawData));
    return { message: 'User Added' };
  }
}
