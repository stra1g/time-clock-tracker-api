import { EmployeeTimeRecordRepository } from 'src/domain/interfaces/employee-time-record.interface';
import { StoreTimeRecordService } from './store-time-record.service';

type MockEmployeeTimeRecordRepository =
  jest.Mocked<EmployeeTimeRecordRepository>;

describe('Store Time Record Service', () => {
  let service: StoreTimeRecordService;
  let employeeTimeRecordRepository: MockEmployeeTimeRecordRepository;

  beforeEach(() => {
    employeeTimeRecordRepository = {
      create: jest.fn(),
      countByDay: jest.fn(),
      getLastTimeRecord: jest.fn(),
      findByDate: jest.fn(),
      listRecordsByDay: jest.fn(),
    } as unknown as MockEmployeeTimeRecordRepository;

    service = new StoreTimeRecordService(employeeTimeRecordRepository);
  });

  it(`shouldn't be able to store time record if the day is Saturday`, async () => {
    const saturdayDate = new Date('2023-04-15T12:00:00Z'); // A Saturday
    const dto = {
      timestamp: saturdayDate.toISOString(),
    };

    await expect(service.run(dto)).rejects.toThrow(
      'Sábado e domingo não são permitidos como dia de trabalho',
    );
  });

  it(`shouldn't be able to store time record if the day is Sunday`, async () => {
    const sundayDate = new Date('2023-04-16T12:00:00Z'); // A Sunday
    const dto = {
      timestamp: sundayDate.toISOString(),
    };

    await expect(service.run(dto)).rejects.toThrow(
      'Sábado e domingo não são permitidos como dia de trabalho',
    );
  });

  it(`shouldn't be able to store a fifth time record`, async () => {
    employeeTimeRecordRepository.countByDay.mockResolvedValue(4);

    const date = new Date('2023-04-17T12:00:00Z');
    const dto = {
      timestamp: date.toISOString(),
    };

    await expect(service.run(dto)).rejects.toThrow(
      'Apenas 4 horários podem ser registrados por dia',
    );
  });

  it(`shouldn't be able to store the third time record if the difference from second is less than 1 hour`, async () => {
    employeeTimeRecordRepository.countByDay.mockResolvedValue(2);
    employeeTimeRecordRepository.getLastTimeRecord.mockResolvedValue({
      timeRecordDate: new Date('2023-04-17T12:30:00Z'),
      id: 2,
      recordType: 'CLOCK_OUT',
    });

    const date = new Date('2023-04-17T13:00:00Z');
    const dto = {
      timestamp: date.toISOString(),
    };

    await expect(service.run(dto)).rejects.toThrow(
      'Deve haver no mínimo 1 hora de almoço',
    );
  });

  it(`shouldn't be able to store the same time record twice`, async () => {
    const existingDate = new Date('2023-04-17T09:00:00Z');

    employeeTimeRecordRepository.findByDate.mockResolvedValue({
      timeRecordDate: existingDate,
      id: 1,
      recordType: 'CLOCK_IN',
    });

    const dto = {
      timestamp: existingDate.toISOString(),
    };

    await expect(service.run(dto)).rejects.toThrow('Horário já registrado');

    expect(employeeTimeRecordRepository.findByDate).toHaveBeenCalledWith(
      existingDate.toISOString(),
    );
  });

  it(`should be able to store new time record`, async () => {
    const date = new Date('2023-04-17T09:00:00Z');
    employeeTimeRecordRepository.countByDay.mockResolvedValue(0);
    employeeTimeRecordRepository.listRecordsByDay.mockResolvedValue([
      {
        timeRecordDate: date,
        id: 1,
        recordType: 'CLOCK_IN',
      },
    ]);

    const dto = {
      timestamp: date.toISOString(),
    };

    const { day, records } = await service.run(dto);

    expect(employeeTimeRecordRepository.create).toHaveBeenCalledWith({
      timeRecordDate: date,
      recordType: 'CLOCK_IN',
    });

    expect(day).toBe('2023-04-17');
    expect(records).toEqual(['06:00:00']);
  });
});
