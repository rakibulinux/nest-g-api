/*
  Warnings:

  - You are about to drop the column `Products` on the `orders` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "Products",
ADD COLUMN     "products" JSONB[];

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "options" JSONB[],
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);
