import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaEmployeeTimeRecordsRepository } from './prisma/repositories/employee-time-record.repository';
import { EmployeeTimeRecordRepository } from '@/domain/interfaces/employee-time-record.interface';

@Module({
  providers: [
    PrismaService,
    {
      provide: EmployeeTimeRecordRepository,
      useClass: PrismaEmployeeTimeRecordsRepository,
    },
  ],
  exports: [EmployeeTimeRecordRepository],
})
export class DatabaseModule {}
