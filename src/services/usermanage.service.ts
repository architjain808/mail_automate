import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as fs from 'fs';
import { AddUserDto } from 'src/DTO/addUser.dto';
import { Users } from 'src/interface/users';
import { AesService } from './enc-dec.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRegisterEntity } from 'src/entities/UserRegister.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserManageService {
  constructor(
    private readonly aesService: AesService,
    @InjectRepository(UserRegisterEntity)
    private readonly userRepo: Repository<UserRegisterEntity>,
  ) {}

  addUser(userdata: AddUserDto) {
    // const rawData = JSON.parse(
    //   fs.readFileSync('./src/Data/users.json', 'utf-8'),
    // );
    let isAvailabe;
    this.userRepo
      .findOneBy({
        useremail: userdata.user_email,
      })
      .then((res) => {
        isAvailabe = res;
      })
      .catch((err) => {
        console.error(err);
      });
    if (isAvailabe) {
      throw new UnauthorizedException('User Already Exists');
    }
    const rawData = {
      useremail: userdata?.user_email,
      appPassword: this.aesService.encrypt(userdata?.user_app_password),
      subject: userdata?.mail_subject,
      text: userdata?.mail_text,
      mailIndex: 0,
    };
    // fs.writeFileSync('./src/Data/users.json', JSON.stringify(rawData));
    return this.userRepo.save(rawData);
  }
}
