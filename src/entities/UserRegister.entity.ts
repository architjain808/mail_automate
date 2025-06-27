import {
  Column,
  CreateDateColumn,
  Unique,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
@Unique(['useremail'])
export class UserRegisterEntity {

  @PrimaryGeneratedColumn('increment')
  user_id: number;

  @Column()
  useremail: string;

  @Column()
  appPassword: string;

  @Column()
  subject: string;

  @Column()
  text: string;

  @Column()
  mailIndex: number;

  @CreateDateColumn()
  created_date: Date;
}
