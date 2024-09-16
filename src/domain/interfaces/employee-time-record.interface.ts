import { EmployeeTimeRecord } from '@prisma/client';

export type CreateEmployeeTimeRecordDTO = {
  timeRecordDate: Date;
  recordType: 'CLOCK_IN' | 'CLOCK_OUT';
};

export abstract class EmployeeTimeRecordRepository {
  abstract create(
    data: CreateEmployeeTimeRecordDTO,
  ): Promise<EmployeeTimeRecord>;
  abstract countByDay(day: string): Promise<number>;
  abstract getLastTimeRecord(day: string): Promise<EmployeeTimeRecord | null>;
  abstract findByDate(date: string): Promise<EmployeeTimeRecord | null>;
  abstract listRecordsByDay(date: string): Promise<EmployeeTimeRecord[]>;
}
