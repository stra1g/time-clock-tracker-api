import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateEmployeeTimeRecordDTO,
  EmployeeTimeRecordRepository,
} from 'src/domain/interfaces/employee-time-record.interface';

@Injectable()
export class PrismaEmployeeTimeRecordsRepository
  implements EmployeeTimeRecordRepository
{
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateEmployeeTimeRecordDTO) {
    return this.prismaService.employeeTimeRecord.create({
      data,
    });
  }

  async countByDay(day: string): Promise<number> {
    return this.prismaService.employeeTimeRecord.count({
      where: {
        timeRecordDate: day,
      },
    });
  }

  async getLastTimeRecord(day: string) {
    return this.prismaService.employeeTimeRecord.findFirst({
      where: {
        timeRecordDate: day,
      },
      orderBy: {
        timeRecordDate: 'desc',
      },
    });
  }

  async findByDate(date: string) {
    return this.prismaService.employeeTimeRecord.findFirst({
      where: {
        timeRecordDate: date,
      },
    });
  }

  async listRecordsByDay(date: string) {
    return this.prismaService.employeeTimeRecord.findMany({
      where: {
        timeRecordDate: date,
      },
    });
  }
}
