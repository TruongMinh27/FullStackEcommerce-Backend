import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsAndRelatedTables1634567890123
  implements MigrationInterface
{
  name = 'CreateProductsAndRelatedTables1634567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE feedbackers (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        feedback_msg TEXT NOT NULL
      );

      CREATE TABLE sku_details (
        id SERIAL PRIMARY KEY,
        sku_name VARCHAR(255) NOT NULL,
        price FLOAT NOT NULL,
        validity INTEGER NOT NULL,
        lifetime BOOLEAN NOT NULL,
        stripe_price_id VARCHAR(255) NOT NULL,
        sku_code VARCHAR(255)
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255) DEFAULT 'https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101027/112815900-no-image-available-icon-flat-vector.jpg?ver=6',
        category ENUM ('Operating System', 'Application Software') NOT NULL,
        platform_type ENUM ('Windows', 'Mac', 'Linux', 'Android', 'iOS') NOT NULL,
        base_type ENUM ('Computer', 'Mobile') NOT NULL,
        product_url VARCHAR(255) NOT NULL,
        download_url VARCHAR(255) NOT NULL,
        avg_rating FLOAT NOT NULL,
        image_details JSONB,
        requirement_specification JSONB,
        highlights TEXT[],
        stripe_product_id VARCHAR(255) NOT NULL
      );

      ALTER TABLE feedbackers
        ADD COLUMN product_id INTEGER,
        ADD FOREIGN KEY (product_id) REFERENCES products (id);

      ALTER TABLE sku_details
        ADD COLUMN product_id INTEGER,
        ADD FOREIGN KEY (product_id) REFERENCES products (id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE sku_details DROP COLUMN product_id');
    await queryRunner.query('ALTER TABLE feedbackers DROP COLUMN product_id');
    await queryRunner.query('DROP TABLE products');
    await queryRunner.query('DROP TABLE sku_details');
    await queryRunner.query('DROP TABLE feedbackers');
  }
}
