import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { EmployeeTimeRecord } from '@prisma/client';
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
    const payload = await this.prismaService.$queryRaw`
      SELECT COUNT(*)::int
      FROM "EmployeeTimeRecord"
      WHERE DATE_TRUNC('day', "timeRecordDate") = DATE_TRUNC('day', ${day}::timestamp)
    `;

    return payload ? payload[0].count : 0;
  }

  async getLastTimeRecord(day: string) {
    const payload = await this.prismaService.$queryRaw`
      SELECT *
      FROM "EmployeeTimeRecord"
      WHERE DATE_TRUNC('day', "timeRecordDate") = DATE_TRUNC('day', ${day}::timestamp)
      ORDER BY "timeRecordDate" DESC
      LIMIT 1
    `;

    return payload ? (payload[0] as EmployeeTimeRecord) : null;
  }

  async findByDate(date: string) {
    return this.prismaService.employeeTimeRecord.findFirst({
      where: {
        timeRecordDate: date,
      },
    });
  }

  async listRecordsByDay(day: string) {
    const payload = await this.prismaService.$queryRaw`
      SELECT *
      FROM "EmployeeTimeRecord"
      WHERE DATE_TRUNC('day', "timeRecordDate") = DATE_TRUNC('day', ${day}::timestamp)
    `;

    return payload as EmployeeTimeRecord[];
  }
}
