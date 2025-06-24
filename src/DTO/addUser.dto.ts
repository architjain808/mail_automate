import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddUserDto {
  @IsEmail()
  @MaxLength(50)
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'asd@gmail.com' })
  user_email: string;

  @IsString()
  @MaxLength(20)
  @MinLength(16)
  @IsNotEmpty()
  @ApiProperty({ example: 'asdd asdd asdd asdd' })
  user_app_password: string;

  @IsString()
  @MaxLength(150)
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'Email Subject' })
  mail_subject: string;

  @IsString()
  @MaxLength(700)
  @MinLength(3)
  @IsNotEmpty()
  @ApiProperty({ example: 'Email Subject' })
  mail_text: string;
}
