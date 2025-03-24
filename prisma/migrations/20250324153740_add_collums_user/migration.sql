-- AlterTable
ALTER TABLE "User" ADD COLUMN     "time_table" TEXT[] DEFAULT ARRAY[]::TEXT[];
