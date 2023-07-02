import { Injectable, MiddlewareConsumer } from '@nestjs/common';
import { CreateProductDto, platformType } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectStripe } from 'nestjs-stripe';
import Stripe from 'stripe';
import { ResponseModel } from 'src/Model/ResponseModel';
import { GetProductQueryDto } from './dto/getproduct.dto';
import { ProductsController } from './products.controller';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productDb: Repository<Products>,
    @InjectStripe()
    private readonly stripeClient: Stripe,
  ) {}
  async createProduct(createProductDto: CreateProductDto) {
    try {
      // tạo sản phẩm trong stripe
      if (!createProductDto.stripeProductId) {
        const createdProductInStripe = await this.stripeClient.products.create({
          name: createProductDto.productName,
          description: createProductDto.description,
        });
        createProductDto.stripeProductId = createdProductInStripe.id;
      }
      const createdProductInDb = await this.productDb.save(createProductDto);
      return {
        message: 'Tạo sản phẩm thành công',
        results: createdProductInDb,
        success: true,
      };
    } catch (error) {
      throw error.message;
    }
  }

  async findAllProducts(query: GetProductQueryDto) {
    try {
      const { search, category, platformType, baseType } = query;
      let callForHomePage = false;

      if (query.homepage) {
        callForHomePage = true;
      }

      const searchOptions: any = {
        name: search,
        category,
        platformType,
        baseType,
      };

      if (callForHomePage) {
        const products = await this.productDb.find();
        return {
          message:
            products.length > 0
              ? 'Products fetched successfully'
              : 'No products found',
          result: products,
          success: true,
        };
      }

      const [products, totalProductCount] = await this.productDb.findAndCount({
        where: searchOptions,
        take: query.limit || 10,
        skip: query.skip || 0,
      });

      const totalPages = Math.ceil(totalProductCount / (query.limit || 10));

      const nextPage =
        query.skip &&
        totalProductCount - Number(query.skip) > (Number(query.limit) || 10)
          ? Number(query.skip) + (Number(query.limit) || 10)
          : query.limit || 10;

      let nextPageUrl = `/?limit=${query.limit || 10}&skip=${nextPage}`;

      if (
        Number(query.skip) + (Number(query.limit) || 10) >=
        totalProductCount
      ) {
        nextPageUrl = null;
      }
      const paginationUrls = {
        nextPage: nextPageUrl,
        previousPage: null,
      };

      if (totalPages > 1) {
        paginationUrls.previousPage = `/?limit=${query.limit || 10}&skip=${
          query.skip ? Number(query.skip) - (Number(query.limit) || 10) : 0
        }`;

        if (!query.skip) {
          paginationUrls.previousPage = null;
        }

        if (Number(query.skip) <= (Number(query.limit) || 10)) {
          paginationUrls.previousPage = `/?limit=${query.limit || 10}`;
        }
      }

      return {
        message:
          products.length > 0
            ? 'Products fetched successfully'
            : 'No products found',
        result: {
          metadata: {
            skip: query.skip || 0,
            limit: query.limit || 10,
            total: totalProductCount,
            pages: totalPages,
            paginationUrls,
          },
          products,
        },
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string): Promise<ResponseModel<CreateProductDto>> {
    try {
      const productExists = await this.productDb.findOne({ where: { id: id } });
      if (!productExists) {
        throw new Error(`Sản phẩm không tồn tại`);
      }
      return {
        message: 'Tìm kiếm thành công',
        result: productExists,
        success: true,
      };
    } catch (error) {
      throw error.message;
    }
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<{
    message: string;
    result: UpdateProductDto;
    success: boolean;
  }> {
    try {
      const productExists = await this.productDb.findOne({ where: { id: id } });
      if (!productExists) {
        throw new Error(`Sản phẩm không tồn tại`);
      }
      const updatedProduct = await this.productDb.save({
        ...productExists,
        ...updateProductDto,
      });

      if (!updateProductDto.stripeProductId) {
        await this.stripeClient.products.update(productExists.stripeProductId, {
          name: updateProductDto.productName,
          description: updateProductDto.description,
        });
      }
      return {
        message: 'Chỉnh sửa thành công',
        result: updatedProduct,
        success: true,
      };
    } catch (error) {
      throw error.message;
    }
  }

  async removeProduct(id: string): Promise<ResponseModel<any>> {
    try {
      const productExists = await this.productDb.findOne({ where: { id: id } });
      if (!productExists) {
        throw new Error(`Sản phẩm không tồn tại`);
      }

      await this.productDb.remove(productExists);
      return {
        message: 'Xóa thành công',
        success: true,
      };
    } catch (error) {
      throw error.message;
    }
  }
}
