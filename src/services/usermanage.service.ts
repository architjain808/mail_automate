import { UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import { AddUserDto } from 'src/DTO/addUser.dto';
import { Users } from 'src/interface/users';

export class UserManageService {
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
      appPassword: userdata?.user_email,
      subject: userdata?.user_email,
      text: userdata?.user_email,
      mailIndex: 0,
    });
    fs.writeFileSync('./src/Data/users.json', JSON.stringify(rawData));
    return { message: 'User Added' };
  }
}
