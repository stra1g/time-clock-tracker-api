import { EmployeeTimeRecordRepository } from 'src/domain/interfaces/employee-time-record.interface';
import { GenerateTimeSheetService } from './generate-time-sheet.service';

type MockEmployeeTimeRecordRepository =
  jest.Mocked<EmployeeTimeRecordRepository>;

describe('Generate Time Sheet Service', () => {
  let service: GenerateTimeSheetService;
  let employeeTimeRecordRepository: MockEmployeeTimeRecordRepository;

  beforeEach(() => {
    employeeTimeRecordRepository = {
      create: jest.fn(),
      countByDay: jest.fn(),
      getLastTimeRecord: jest.fn(),
      findByDate: jest.fn(),
      listRecordsByDay: jest.fn(),
      countTotalHoursByMonth: jest.fn(),
      listWorkingHoursByMonth: jest.fn(),
    } as unknown as MockEmployeeTimeRecordRepository;

    service = new GenerateTimeSheetService(employeeTimeRecordRepository);
  });

  it(`shouldn't be able to get time sheet if total hours worked is 0`, async () => {
    employeeTimeRecordRepository.countTotalHoursByMonth.mockResolvedValue(0);

    const dto = {
      yearMonth: '2024-09',
    };

    await expect(service.run(dto)).rejects.toThrow('Relatório não encontrado');
  });

  it('should be able to get time sheet', async () => {
    employeeTimeRecordRepository.countTotalHoursByMonth.mockResolvedValue(8);
    employeeTimeRecordRepository.listWorkingHoursByMonth.mockResolvedValue([
      {
        dia: '2024-09-01',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'],
      },
    ]);

    const dto = {
      yearMonth: '2024-09',
    };

    const {
      anoMes,
      expedientes,
      horasDevidas,
      horasExcedentes,
      horasTrabalhadas,
    } = await service.run(dto);

    expect(anoMes).toBe('2024-09');
    expect(horasTrabalhadas).toBe('8');
    expect(horasExcedentes).toBe('0');
    expect(horasDevidas).toBe('152');
    expect(expedientes).toEqual([
      {
        dia: '2024-09-01',
        pontos: ['08:00:00', '12:00:00', '13:00:00', '17:00:00'],
      },
    ]);
  });
});
