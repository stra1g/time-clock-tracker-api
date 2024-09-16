export class EmployeeTimeRecord {
  id: string;
  timestamp: Date;
  recordType: 'CLOCK_IN' | 'CLOCK_OUT';
  createdAt: Date;
  updatedAt: Date;
}
