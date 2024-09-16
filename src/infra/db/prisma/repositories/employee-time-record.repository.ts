import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { EmployeeTimeRecord } from '@prisma/client';
import {
  CreateEmployeeTimeRecordDTO,
  EmployeeTimeRecordRepository,
  WorkingHoursByMonth,
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

  async countTotalHoursByMonth(yearMonth: string) {
    const payload = await this.prismaService.$queryRaw`
      WITH clock_ins AS (
        SELECT
          "id",
          "timeRecordDate" AS clock_in_time,
          ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('day', "timeRecordDate") ORDER BY "timeRecordDate") AS rn
        FROM
          "EmployeeTimeRecord"
        WHERE
          "recordType" = 'CLOCK_IN'
          AND TO_CHAR("timeRecordDate", 'YYYY-MM') = ${yearMonth}
      ),
      clock_outs AS (
        SELECT
          "id",
          "timeRecordDate" AS clock_out_time,
          ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('day', "timeRecordDate") ORDER BY "timeRecordDate") AS rn
        FROM
          "EmployeeTimeRecord"
        WHERE
          "recordType" = 'CLOCK_OUT'
          AND TO_CHAR("timeRecordDate", 'YYYY-MM') = ${yearMonth}
      )
      SELECT
        COALESCE(SUM(EXTRACT(EPOCH FROM (clock_outs.clock_out_time - clock_ins.clock_in_time)) / 3600), 0) AS total_worked_hours
      FROM
        clock_ins
      JOIN
        clock_outs ON clock_ins.rn = clock_outs.rn
        AND DATE_TRUNC('day', clock_ins.clock_in_time) = DATE_TRUNC('day', clock_outs.clock_out_time);
    `;

    return payload[0].total_worked_hours;
  }

  async listWorkingHoursByMonth(yearMonth: string) {
    const payload = await this.prismaService.$queryRaw`
      SELECT
        TO_CHAR("timeRecordDate", 'YYYY-MM-DD') AS dia,
        ARRAY_AGG(TO_CHAR("timeRecordDate", 'HH24:MI:SS') ORDER BY "timeRecordDate") AS pontos
      FROM
        "EmployeeTimeRecord"
      WHERE
        TO_CHAR("timeRecordDate", 'YYYY-MM') = ${yearMonth}
      GROUP BY
        TO_CHAR("timeRecordDate", 'YYYY-MM-DD')
      ORDER BY
        dia;
    `;

    return payload as WorkingHoursByMonth[];
  }
}
