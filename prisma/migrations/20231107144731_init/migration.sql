-- AlterTable
ALTER TABLE "users" ADD COLUMN     "fileId" UUID;

-- CreateTable
CREATE TABLE "forgot" (
    "PK_087959f5bb89da4ce3d763eab75" TEXT NOT NULL,
    "forgot_hash" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(6),
    "userId" TEXT,

    CONSTRAINT "forgot_pkey" PRIMARY KEY ("PK_087959f5bb89da4ce3d763eab75")
);

-- CreateTable
CREATE TABLE "File" (
    "PK_36b46d232307066b3a2c9ea3a1d" UUID NOT NULL,
    "file_path" VARCHAR NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("PK_36b46d232307066b3a2c9ea3a1d")
);

-- CreateIndex
CREATE INDEX "IDX_df507d27b0fb20cd5f7bef9b9a" ON "forgot"("forgot_hash");

-- AddForeignKey
ALTER TABLE "forgot" ADD CONSTRAINT "FK_31f3c80de0525250f31e23a9b83" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("PK_36b46d232307066b3a2c9ea3a1d") ON DELETE SET NULL ON UPDATE CASCADE;
