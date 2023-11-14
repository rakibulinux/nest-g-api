/*
  Warnings:

  - You are about to drop the column `img` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "img";

-- AlterTable
ALTER TABLE "file" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
