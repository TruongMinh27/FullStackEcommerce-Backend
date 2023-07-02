import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Generated('uuid')
  id!: string;
  @Column()
  name: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  type: string;
  @Column()
  isVerified: boolean = false;
  @Column()
  otp: string = null;
  @Column()
  otpExpiryTime: Date = null;
}
