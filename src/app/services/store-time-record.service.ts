import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { EmployeeTimeRecordRepository } from '@domain/interfaces/employee-time-record.interface';
import * as dayjs from 'dayjs';

type StoreTimeRecordRequest = {
  timestamp?: string;
};

@Injectable()
export class StoreTimeRecordService {
  constructor(
    private readonly employeeTimeRecordRepository: EmployeeTimeRecordRepository,
  ) {}

  public async run({ timestamp }: StoreTimeRecordRequest) {
    if (!timestamp)
      throw new BadRequestException('Campo obrigatório não informado');

    const date = dayjs(timestamp);
    const dayOfWeek = date.day();

    if (dayOfWeek === 0 || dayOfWeek === 6)
      throw new BadRequestException(
        'Sábado e domingo não são permitidos como dia de trabalho',
      );

    const timeRecordCountByDay =
      await this.employeeTimeRecordRepository.countByDay(
        date.format('YYYY-MM-DD'),
      );

    if (timeRecordCountByDay >= 4)
      throw new BadRequestException(
        'Apenas 4 horários podem ser registrados por dia',
      );

    if (timeRecordCountByDay === 2) {
      const lastTimeRecord =
        await this.employeeTimeRecordRepository.getLastTimeRecord(
          date.format('YYYY-MM-DD'),
        );

      const lastTimeRecordDate = dayjs(lastTimeRecord.timeRecordDate);
      const diffInMinutes = date.diff(lastTimeRecordDate, 'minute');

      if (diffInMinutes < 60)
        throw new BadRequestException('Deve haver no mínimo 1 hora de almoço');
    }

    const alreadyStoredTimeRecord =
      await this.employeeTimeRecordRepository.findByDate(date.toISOString());

    if (alreadyStoredTimeRecord)
      throw new ConflictException('Horário já registrado');

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
