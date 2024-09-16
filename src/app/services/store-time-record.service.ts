import { Injectable } from '@nestjs/common';
import { EmployeeTimeRecordRepository } from '@domain/interfaces/employee-time-record.interface';
import * as dayjs from 'dayjs';

type StoreTimeRecordRequest = {
  timestamp: string; // ISO string
};

@Injectable()
export class StoreTimeRecordService {
  constructor(
    private readonly employeeTimeRecordRepository: EmployeeTimeRecordRepository,
  ) {}

  public async run({ timestamp }: StoreTimeRecordRequest) {
    const date = dayjs(timestamp);
    const dayOfWeek = date.day();

    if (dayOfWeek === 0 || dayOfWeek === 6)
      throw new Error(
        'Sábado e domingo não são permitidos como dia de trabalho',
      );

    const timeRecordCountByDay =
      await this.employeeTimeRecordRepository.countByDay(
        date.format('YYYY-MM-DD'),
      );

    if (timeRecordCountByDay >= 4)
      throw new Error('Apenas 4 horários podem ser registrados por dia');

    if (timeRecordCountByDay === 2) {
      const lastTimeRecord =
        await this.employeeTimeRecordRepository.getLastTimeRecord(
          date.format('YYYY-MM-DD'),
        );

      const lastTimeRecordDate = dayjs(lastTimeRecord.timeRecordDate);
      const diffInMinutes = date.diff(lastTimeRecordDate, 'minute');

      if (diffInMinutes < 60)
        throw new Error('Deve haver no mínimo 1 hora de almoço');
    }

    const alreadyStoredTimeRecord =
      await this.employeeTimeRecordRepository.findByDate(date.toISOString());

    if (alreadyStoredTimeRecord) throw new Error('Horário já registrado');

    await this.employeeTimeRecordRepository.create({
      timeRecordDate: date.toDate(),
      recordType: timeRecordCountByDay % 2 === 0 ? 'CLOCK_IN' : 'CLOCK_OUT',
    });

    const allRecords = await this.employeeTimeRecordRepository.listRecordsByDay(
      date.format('YYYY-MM-DD'),
    );

    return {
      day: date.format('YYYY-MM-DD'),
      records: allRecords.map((record) =>
        dayjs(record.timeRecordDate).format('HH:mm:ss'),
      ),
    };
  }
}
