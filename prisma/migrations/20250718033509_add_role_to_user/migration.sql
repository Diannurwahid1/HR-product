/*
  Warnings:

  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "roleId" TEXT;

-- Set roleId default untuk user existing ke Admin
UPDATE "public"."User" SET "roleId" = '443bc4c0-414b-4260-9bf1-deb541f126e4' WHERE "roleId" IS NULL;

-- Set NOT NULL constraint
ALTER TABLE "public"."User" ALTER COLUMN "roleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
