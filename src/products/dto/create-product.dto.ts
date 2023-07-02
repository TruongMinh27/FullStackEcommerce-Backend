import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SkuDetails } from '../entities/product.entity';

export enum categoryType {
  operatingSystem = 'Operating System',
  applicationSoftware = 'Application Software',
}

export enum platformType {
  windows = 'Windows',
  mac = 'Mac',
  linux = 'Linux',
  android = 'Android',
  ios = 'iOS',
}

export enum baseType {
  computer = 'Computer',
  mobile = 'Mobile',
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tên' })
  productName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  imageDetails?: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  @IsEnum(categoryType)
  category: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(platformType)
  platformType: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(baseType)
  baseType: string;

  @IsString()
  @IsNotEmpty()
  productUrl: string;

  @IsString()
  @IsNotEmpty()
  downloadUrl: string;

  @IsArray()
  @IsNotEmpty()
  requirementSpecification: Record<string, any>[];

  @IsArray()
  @IsNotEmpty()
  highlights: string[];

  @IsOptional()
  @IsArray()
  skuDetails: SkuDetails[];

  @IsOptional()
  stripeProductId?: string;
}
