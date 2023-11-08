/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_fileId_fkey";

-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "file" (
    "PK_36b46d232307066b3a2c9ea3a1d" UUID NOT NULL,
    "file_path" VARCHAR NOT NULL,

    CONSTRAINT "file_pkey" PRIMARY KEY ("PK_36b46d232307066b3a2c9ea3a1d")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("PK_36b46d232307066b3a2c9ea3a1d") ON DELETE SET NULL ON UPDATE CASCADE;
