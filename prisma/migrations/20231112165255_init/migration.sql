/*
  Warnings:

  - You are about to drop the column `fileId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_fileId_fkey";

-- AlterTable
ALTER TABLE "file" ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "fileId",
DROP COLUMN "image";

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
