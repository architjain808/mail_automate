import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './services/mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserManageService } from './services/usermanage.service';
import { AesService } from './services/enc-dec.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserRegisterEntity } from './entities/UserRegister.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([UserRegisterEntity]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('CONNECTION_STRING'),
        entities: [UserRegisterEntity],
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: {
          rejectUnauthorized: false, // Helps with some cloud database providers
        },
        retryAttempts: 5,
        retryDelay: 3000,
      }),
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, MailService, UserManageService, AesService],
})
export class AppModule {}
