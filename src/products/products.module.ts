import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedbackers, Products, SkuDetails } from './entities/product.entity';
import { Users } from 'src/users/Entities/user.entity';
import { StripeModule } from 'nestjs-stripe';
import { AuthMiddleware } from 'src/shared/middleware/auth';
import { APP_GUARD } from '@nestjs/core';
import RolesGuard from 'src/shared/middleware/roles.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forFeature([Products, SkuDetails, Feedbackers, Users]),
    StripeModule.forRoot({
      apiKey: process.env.secret_key,
      apiVersion: '2022-11-15',
    }),
  ],

  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: `${process.env.app_prefix}/products`,
          method: RequestMethod.GET,
        },
        {
          path: `${process.env.app_prefix}/products/:id`,
          method: RequestMethod.GET,
        },
      )
      .forRoutes(ProductsController);
  }
}
