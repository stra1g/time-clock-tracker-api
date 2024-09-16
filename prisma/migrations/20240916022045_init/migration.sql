-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('CLOCK_IN', 'CLOCK_OUT');

-- CreateTable
CREATE TABLE "EmployeeTimeRecord" (
    "id" SERIAL NOT NULL,
    "timeRecordDate" TIMESTAMP(3) NOT NULL,
    "recordType" "RecordType" NOT NULL,

    CONSTRAINT "EmployeeTimeRecord_pkey" PRIMARY KEY ("id")
);
