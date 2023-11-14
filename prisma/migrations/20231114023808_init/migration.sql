/*
  Warnings:

  - A unique constraint covering the columns `[id,slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "catSlug" TEXT NOT NULL DEFAULT 'all-time-favorite';

-- CreateIndex
CREATE UNIQUE INDEX "categories_id_slug_key" ON "categories"("id", "slug");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_catSlug_fkey" FOREIGN KEY ("categoryId", "catSlug") REFERENCES "categories"("id", "slug") ON DELETE RESTRICT ON UPDATE CASCADE;
