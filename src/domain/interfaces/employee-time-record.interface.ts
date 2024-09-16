import { EmployeeTimeRecord } from '@prisma/client';

export type CreateEmployeeTimeRecordDTO = {
  timeRecordDate: Date;
  recordType: 'CLOCK_IN' | 'CLOCK_OUT';
};

export type WorkingHoursByMonth = {
  dia: string;
  pontos: string[];
};

export abstract class EmployeeTimeRecordRepository {
  abstract create(
    data: CreateEmployeeTimeRecordDTO,
  ): Promise<EmployeeTimeRecord>;
  abstract countByDay(day: string): Promise<number>;
  abstract getLastTimeRecord(day: string): Promise<EmployeeTimeRecord | null>;
  abstract findByDate(date: string): Promise<EmployeeTimeRecord | null>;
  abstract listRecordsByDay(date: string): Promise<EmployeeTimeRecord[]>;
  abstract countTotalHoursByMonth(yearMonth: string): Promise<number>;
  abstract listWorkingHoursByMonth(
    yearMonth: string,
  ): Promise<WorkingHoursByMonth[]>;
}
