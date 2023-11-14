/*
  Warnings:

  - You are about to drop the column `catSlug` on the `products` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_catSlug_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "catSlug",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
