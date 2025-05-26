/*
  Warnings:

  - You are about to drop the column `brandId` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Workshop` table. All the data in the column will be lost.
  - You are about to drop the `LaborTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleBrand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VehicleModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `QuotationItem` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `QuotationItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `color` to the `Vehicle` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Workshop` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'WORKSHOP', 'ADMIN');

-- CreateEnum
CREATE TYPE "QuotationRequestStatus" AS ENUM ('ACTIVE', 'CLOSED', 'CANCELED');

-- CreateEnum
CREATE TYPE "QuotationItemType" AS ENUM ('PART', 'LABOR');

-- CreateEnum
CREATE TYPE "VehicleColor" AS ENUM ('WHITE', 'BLACK', 'SILVER', 'GRAY', 'BLUE', 'RED', 'BROWN', 'GREEN', 'BEIGE', 'YELLOW', 'ORANGE', 'PURPLE', 'GOLD', 'OTHER');

-- DropForeignKey
ALTER TABLE "LaborTask" DROP CONSTRAINT "LaborTask_workshopId_fkey";

-- DropForeignKey
ALTER TABLE "QuotationItem" DROP CONSTRAINT "QuotationItem_laborTaskId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Vehicle" DROP CONSTRAINT "Vehicle_modelId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleModel" DROP CONSTRAINT "VehicleModel_vehicleBrandId_fkey";

-- DropForeignKey
ALTER TABLE "Workshop" DROP CONSTRAINT "Workshop_ownerId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Part" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "QuotationItem" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin',
DROP COLUMN "type",
ADD COLUMN     "type" "QuotationItemType" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "workshopId" TEXT,
ADD COLUMN     "workshopsId" TEXT,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "brandId",
ADD COLUMN     "color" "VehicleColor" NOT NULL,
ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "WorkOrder" ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin';

-- AlterTable
ALTER TABLE "Workshop" DROP COLUMN "ownerId",
ADD COLUMN     "createdBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "updatedBy" TEXT NOT NULL DEFAULT 'admin',
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "LaborTask";

-- DropTable
DROP TABLE "VehicleBrand";

-- DropTable
DROP TABLE "VehicleModel";

-- DropEnum
DROP TYPE "ItemType";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationRequest" (
    "id" TEXT NOT NULL,
    "description" TEXT,
    "customerId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "workshopId" TEXT,
    "status" "QuotationRequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "QuotationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Labor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "workshopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL DEFAULT 'admin',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "Labor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequest" ADD CONSTRAINT "QuotationRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequest" ADD CONSTRAINT "QuotationRequest_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationRequest" ADD CONSTRAINT "QuotationRequest_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_laborTaskId_fkey" FOREIGN KEY ("laborTaskId") REFERENCES "Labor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Labor" ADD CONSTRAINT "Labor_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "Workshop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
