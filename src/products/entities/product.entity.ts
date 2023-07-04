import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Generated,
} from 'typeorm';
import {
  baseType,
  categoryType,
  platformType,
} from '../dto/create-product.dto';

@Entity()
export class Feedbackers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  rating: number;

  @Column()
  feedbackMsg: string;
}

@Entity()
export class SkuDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  skuName: string;

  @Column()
  price: number;

  @Column()
  validity: number; // in days

  @Column()
  lifetime: boolean;

  @Column()
  stripePriceId: string;

  @Column({ nullable: true })
  skuCode?: string;
}

@Entity()
export class Products {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  @Generated('uuid')
  id!: string;

  @Column()
  productName: string;

  @Column()
  description: string;

  @Column({
    default:
      'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101027/112815900-no-image-available-icon-flat-vector.jpg?ver=6',
  })
  image?: string;

  @Column()
  category: string;

  @Column({
    type: 'enum',
    enum: platformType,
  })
  platformType: string;

  @Column({
    type: 'enum',
    enum: baseType,
  })
  baseType: string;

  @Column()
  productUrl: string;

  @Column()
  downloadUrl: string;

  @Column({
    default: 0,
  })
  avgRating: number;

  @OneToMany(() => Feedbackers, (feedbacker) => feedbacker)
  feedbackDetails: Feedbackers[];

  @OneToMany(() => SkuDetails, (skuDetail) => skuDetail)
  skuDetails: SkuDetails[];

  @Column({ type: 'json', nullable: true })
  imageDetails: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  requirementSpecification: Record<string, any>[];

  @Column('simple-array', { nullable: true })
  highlights: string[];

  @Column({ nullable: true })
  stripeProductId: string;
  @Column()
  createAt: Date;
}
