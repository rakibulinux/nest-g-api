/*
  Warnings:

  - The values [available,upcoming] on the enum `ProductAvailability` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductAvailability_new" AS ENUM ('Available', 'Upcoming');
ALTER TABLE "products" ALTER COLUMN "availability" DROP DEFAULT;
ALTER TABLE "products" ALTER COLUMN "availability" TYPE "ProductAvailability_new" USING ("availability"::text::"ProductAvailability_new");
ALTER TYPE "ProductAvailability" RENAME TO "ProductAvailability_old";
ALTER TYPE "ProductAvailability_new" RENAME TO "ProductAvailability";
DROP TYPE "ProductAvailability_old";
ALTER TABLE "products" ALTER COLUMN "availability" SET DEFAULT 'Available';
COMMIT;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "availability" SET DEFAULT 'Available';
