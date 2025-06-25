import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { UserManageService } from './services/usermanage.service';
import { AesService } from './services/enc-dec.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // TypeOrmModule.forFeature([]),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres', // your PostgreSQL username
    //   password: 'A90@j09#', // your PostgreSQL password
    //   database: 'practise_nest', // name of the DB you just created
    //   autoLoadEntities: true,
    //   synchronize: true, // use true in dev only!
    // }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, MailService, UserManageService, AesService],
})
export class AppModule {}
