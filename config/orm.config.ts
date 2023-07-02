import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Feedbackers,
  Products,
  SkuDetails,
} from 'src/products/entities/product.entity';
import { Users } from 'src/users/Entities/user.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'example',
    database: 'e-commerce',
    entities: [Users, Products, SkuDetails, Feedbackers],
    synchronize: true,
  }),
);
