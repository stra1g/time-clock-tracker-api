import { Injectable, NotFoundException } from '@nestjs/common';
import { EmployeeTimeRecordRepository } from '@domain/interfaces/employee-time-record.interface';

type GenerateTimeSheetRequest = {
  yearMonth: string;
};

@Injectable()
export class GenerateTimeSheetService {
  constructor(
    private readonly employeeTimeRecordRepository: EmployeeTimeRecordRepository,
  ) {}

  public async run({ yearMonth }: GenerateTimeSheetRequest) {
    const OFFICE_HOURS_PER_DAY = 8;
    const WORKING_DAYS_PER_MONTH = 20;
    const OFFICE_HOURS_PER_MONTH =
      OFFICE_HOURS_PER_DAY * WORKING_DAYS_PER_MONTH;

    const totalWorkedHours =
      await this.employeeTimeRecordRepository.countTotalHoursByMonth(yearMonth);

    if (totalWorkedHours === 0)
      throw new NotFoundException('Relatório não encontrado');

    const totalExceededHours = totalWorkedHours - OFFICE_HOURS_PER_MONTH;
    const remainingHours =
      OFFICE_HOURS_PER_MONTH - totalWorkedHours > 0
        ? OFFICE_HOURS_PER_MONTH - totalWorkedHours
        : 0;
    const workingHours =
      await this.employeeTimeRecordRepository.listWorkingHoursByMonth(
        yearMonth,
      );

    return {
      anoMes: yearMonth,
      horasTrabalhadas: String(totalWorkedHours),
      horasExcedentes: String(totalExceededHours > 0 ? totalExceededHours : 0),
      horasDevidas: String(remainingHours),
      expedientes: workingHours,
    };
  }
}
