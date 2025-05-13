/*
  Warnings:

  - You are about to drop the column `subcategoryId` on the `Guideline` table. All the data in the column will be lost.
  - You are about to drop the `Subcategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Guideline` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Guideline" DROP CONSTRAINT "Guideline_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "Guideline" DROP COLUMN "subcategoryId",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Subcategory";

-- AddForeignKey
ALTER TABLE "Guideline" ADD CONSTRAINT "Guideline_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
